from __future__ import annotations

import json
from typing import Iterable

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import DayPlan, RouteSegment, RouteStatus, SpotNode
from app.schemas.route import RouteSegmentResponse
from app.schemas.spot import SpotResponse

DAY_COLOR_PALETTE = ["#c43d2b", "#206fba", "#1f9a6d", "#8b5cf6", "#f59e0b"]


def fallback_day_title(day_index: int) -> str:
    return f"Day {day_index}"


def fallback_day_color(day_index: int) -> str:
    return DAY_COLOR_PALETTE[(day_index - 1) % len(DAY_COLOR_PALETTE)]


async def get_day_plan(
    session: AsyncSession,
    itinerary_id: int,
    day_index: int,
    *,
    create: bool = False,
) -> DayPlan | None:
    result = await session.execute(
        select(DayPlan).where(
            DayPlan.itinerary_id == itinerary_id,
            DayPlan.day_index == day_index,
        )
    )
    day_plan = result.scalar_one_or_none()
    if day_plan or not create:
        return day_plan

    day_plan = DayPlan(
        itinerary_id=itinerary_id,
        day_index=day_index,
        title=fallback_day_title(day_index),
        color=fallback_day_color(day_index),
        summary="运行时新增行程日。",
    )
    session.add(day_plan)
    await session.flush()
    return day_plan


async def list_day_spots(session: AsyncSession, day_plan_id: int) -> list[SpotNode]:
    result = await session.execute(
        select(SpotNode)
        .where(SpotNode.day_plan_id == day_plan_id)
        .order_by(SpotNode.order_index.asc(), SpotNode.id.asc())
    )
    return list(result.scalars())


async def persist_spot_order(session: AsyncSession, ordered_spots: Iterable[SpotNode]) -> list[SpotNode]:
    spots = list(ordered_spots)
    for index, spot in enumerate(spots, start=1):
        spot.order_index = -index
    await session.flush()

    for index, spot in enumerate(spots, start=1):
        spot.order_index = index
    await session.flush()
    return spots


async def reorder_day_spots(
    session: AsyncSession,
    day_plan_id: int,
    ordered_node_ids: list[int],
) -> list[SpotNode]:
    spots = await list_day_spots(session, day_plan_id)
    by_id = {spot.id: spot for spot in spots}
    missing_ids = [spot_id for spot_id in ordered_node_ids if spot_id not in by_id]
    if missing_ids:
        raise ValueError(f"invalid-node-ids:{','.join(str(item) for item in missing_ids)}")

    ordered = [by_id[spot_id] for spot_id in ordered_node_ids]
    remainder = [spot for spot in spots if spot.id not in set(ordered_node_ids)]
    return await persist_spot_order(session, [*ordered, *remainder])


def build_geometry_json(from_spot: SpotNode, to_spot: SpotNode) -> str | None:
    if None in (from_spot.lng, from_spot.lat, to_spot.lng, to_spot.lat):
        return None
    return json.dumps(
        {
            "type": "LineString",
            "coordinates": [
                [from_spot.lng, from_spot.lat],
                [to_spot.lng, to_spot.lat],
            ],
        },
        ensure_ascii=False,
    )


async def rebuild_route_segments(
    session: AsyncSession,
    itinerary_id: int,
    day_plan: DayPlan,
    sort_source: str,
) -> list[RouteSegment]:
    spots = await list_day_spots(session, day_plan.id)
    await session.execute(delete(RouteSegment).where(RouteSegment.day_plan_id == day_plan.id))
    await session.flush()

    segments: list[RouteSegment] = []
    for index, (from_spot, to_spot) in enumerate(zip(spots, spots[1:]), start=1):
        geometry_json = build_geometry_json(from_spot, to_spot)
        segment = RouteSegment(
            itinerary_id=itinerary_id,
            day_plan_id=day_plan.id,
            from_node_id=from_spot.id,
            to_node_id=to_spot.id,
            sequence_index=index,
            sort_source=sort_source,
            status=RouteStatus.ready if geometry_json else RouteStatus.pending,
            geometry_json=geometry_json,
        )
        session.add(segment)
        segments.append(segment)

    await session.flush()
    return segments


async def list_route_segments(session: AsyncSession, day_plan_id: int) -> list[RouteSegment]:
    result = await session.execute(
        select(RouteSegment)
        .where(RouteSegment.day_plan_id == day_plan_id)
        .order_by(RouteSegment.sequence_index.asc(), RouteSegment.id.asc())
    )
    return list(result.scalars())


def spot_to_response(spot: SpotNode, itinerary_id: int, day_index: int) -> SpotResponse:
    return SpotResponse(
        id=spot.id,
        itinerary_id=itinerary_id,
        day_index=day_index,
        name=spot.name,
        category=spot.category,
        kind=spot.kind,
        address=spot.address,
        search_keyword=spot.search_keyword,
        lng=spot.lng,
        lat=spot.lat,
        order_index=spot.order_index,
        short_description=spot.short_description,
        description=spot.description,
    )


def segment_to_response(segment: RouteSegment) -> RouteSegmentResponse:
    return RouteSegmentResponse(
        sequence_index=segment.sequence_index,
        from_ref=segment.from_node_id,
        to_ref=segment.to_node_id,
        status=segment.status,
        sort_source=segment.sort_source,
        geometry_json=segment.geometry_json,
        distance_meters=segment.distance_meters,
        duration_seconds=segment.duration_seconds,
    )