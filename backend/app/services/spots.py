from __future__ import annotations

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import DayPlan, SpotNode
from app.schemas.spot import (
    SpotCreateRequest,
    SpotListResponse,
    SpotReorderRequest,
    SpotReorderResponse,
    SpotResponse,
    SpotUpdateRequest,
)
from app.services.db_support import (
    get_day_plan,
    list_day_spots,
    persist_spot_order,
    rebuild_route_segments,
    reorder_day_spots,
    spot_to_response,
)


def _resolve_route_status(segments_count: int) -> str:
    return "ready" if segments_count > 0 else "pending"


async def create_spot(payload: SpotCreateRequest, session: AsyncSession) -> SpotResponse:
    day_plan = await get_day_plan(session, payload.itinerary_id, payload.day_index, create=True)
    if day_plan is None:
        raise HTTPException(status_code=404, detail="itinerary-day-not-found")

    existing_spots = await list_day_spots(session, day_plan.id)
    spot = SpotNode(
        day_plan_id=day_plan.id,
        name=payload.name,
        category=payload.category,
        kind=payload.kind,
        address=payload.address,
        search_keyword=payload.search_keyword,
        lng=payload.lng,
        lat=payload.lat,
        order_index=len(existing_spots) + 1,
        short_description=payload.short_description,
        description=payload.description,
    )
    session.add(spot)
    await session.flush()

    ordered = await list_day_spots(session, day_plan.id)
    if payload.order_index > 0:
        ordered = [item for item in ordered if item.id != spot.id]
        insert_at = min(max(payload.order_index - 1, 0), len(ordered))
        ordered.insert(insert_at, spot)
        await persist_spot_order(session, ordered)

    await rebuild_route_segments(session, payload.itinerary_id, day_plan, "manual")
    await session.commit()
    await session.refresh(spot)
    return spot_to_response(spot, payload.itinerary_id, payload.day_index)


async def list_spots(itinerary_id: int, day_index: int | None, session: AsyncSession) -> SpotListResponse:
    query = select(DayPlan).where(DayPlan.itinerary_id == itinerary_id)
    if day_index is not None:
        query = query.where(DayPlan.day_index == day_index)
    query = query.order_by(DayPlan.day_index.asc(), DayPlan.id.asc())

    result = await session.execute(query)
    day_plans = list(result.scalars())

    items: list[SpotResponse] = []
    for day_plan in day_plans:
        for spot in await list_day_spots(session, day_plan.id):
            items.append(spot_to_response(spot, itinerary_id, day_plan.day_index))

    return SpotListResponse(itinerary_id=itinerary_id, day_index=day_index, items=items)


async def update_spot(spot_id: int, payload: SpotUpdateRequest, session: AsyncSession) -> SpotResponse:
    spot = await session.get(SpotNode, spot_id)
    if spot is None:
        raise HTTPException(status_code=404, detail="spot-not-found")

    current_day_plan = await session.get(DayPlan, spot.day_plan_id)
    if current_day_plan is None:
        raise HTTPException(status_code=404, detail="day-plan-not-found")

    target_day_index = payload.day_index or current_day_plan.day_index
    target_day_plan = current_day_plan
    old_day_plan = current_day_plan

    if payload.day_index is not None and payload.day_index != current_day_plan.day_index:
        target_day_plan = await get_day_plan(session, current_day_plan.itinerary_id, payload.day_index, create=True)
        if target_day_plan is None:
            raise HTTPException(status_code=404, detail="target-day-plan-not-found")
        spot.day_plan_id = target_day_plan.id
        spot.order_index = 999999
        await session.flush()

    if payload.name is not None:
        spot.name = payload.name
    if payload.address is not None:
        spot.address = payload.address
    if payload.category is not None:
        spot.category = payload.category
    if payload.search_keyword is not None:
        spot.search_keyword = payload.search_keyword
    if payload.lng is not None:
        spot.lng = payload.lng
    if payload.lat is not None:
        spot.lat = payload.lat
    if payload.short_description is not None:
        spot.short_description = payload.short_description
    if payload.description is not None:
        spot.description = payload.description

    should_reorder_target = payload.order_index is not None or target_day_plan.id != old_day_plan.id
    if should_reorder_target:
        target_spots = await list_day_spots(session, target_day_plan.id)
        target_spots = [item for item in target_spots if item.id != spot.id]
        insert_at = len(target_spots) if payload.order_index is None else min(max(payload.order_index - 1, 0), len(target_spots))
        target_spots.insert(insert_at, spot)
        await persist_spot_order(session, target_spots)
        await rebuild_route_segments(session, current_day_plan.itinerary_id, target_day_plan, "manual")
    else:
        await session.flush()

    if target_day_plan.id != old_day_plan.id:
        old_day_spots = await list_day_spots(session, old_day_plan.id)
        await persist_spot_order(session, old_day_spots)
        await rebuild_route_segments(session, current_day_plan.itinerary_id, old_day_plan, "manual")

    await session.commit()
    await session.refresh(spot)
    return spot_to_response(spot, current_day_plan.itinerary_id, target_day_index)


async def reorder_spots(payload: SpotReorderRequest, session: AsyncSession) -> SpotReorderResponse:
    day_plan = await get_day_plan(session, payload.itinerary_id, payload.day_index)
    if day_plan is None:
        raise HTTPException(status_code=404, detail="day-plan-not-found")

    try:
        await reorder_day_spots(session, day_plan.id, payload.ordered_node_ids)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    segments = await rebuild_route_segments(session, payload.itinerary_id, day_plan, payload.sort_source)
    await session.commit()
    return SpotReorderResponse(
        itinerary_id=payload.itinerary_id,
        day_index=payload.day_index,
        ordered_node_ids=payload.ordered_node_ids,
        sort_source=payload.sort_source,
        route_status=_resolve_route_status(len(segments)),
        message="已按数据库顺序重排点位，并同步刷新路线段。",
    )