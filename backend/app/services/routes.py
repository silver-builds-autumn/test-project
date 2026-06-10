from __future__ import annotations

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import DayPlan, RouteStatus
from app.schemas.route import (
    RouteDayResponse,
    RouteListResponse,
    RouteOperationResponse,
    RouteOptimizeRequest,
    RouteRecalculateRequest,
)
from app.services.db_support import (
    get_day_plan,
    list_day_spots,
    list_route_segments,
    rebuild_route_segments,
    reorder_day_spots,
    segment_to_response,
)


def _status_from_segments(segments_count: int) -> RouteStatus:
    return RouteStatus.ready if segments_count > 0 else RouteStatus.pending


def _fallback_action(segments_count: int) -> str:
    return "keep-current-order" if segments_count > 0 else "skip-route-generation"


async def list_routes(itinerary_id: int, day_index: int | None, session: AsyncSession) -> RouteListResponse:
    query = select(DayPlan).where(DayPlan.itinerary_id == itinerary_id)
    if day_index is not None:
        query = query.where(DayPlan.day_index == day_index)
    query = query.order_by(DayPlan.day_index.asc(), DayPlan.id.asc())

    result = await session.execute(query)
    day_plans = list(result.scalars())

    items: list[RouteDayResponse] = []
    for day_plan in day_plans:
        segments = await list_route_segments(session, day_plan.id)
        spots = await list_day_spots(session, day_plan.id)
        segments_count = len(segments)
        items.append(
            RouteDayResponse(
                itinerary_id=itinerary_id,
                day_index=day_plan.day_index,
                sort_source=segments[-1].sort_source if segments else "seed",
                status=_status_from_segments(segments_count),
                segments=[segment_to_response(item) for item in segments],
                message="已返回当前数据库中的路线段。" if segments else "当前节点不足 2 个，未生成路线段。",
                fallback_action=None if len(spots) >= 2 else "skip-route-generation",
            )
        )

    return RouteListResponse(itinerary_id=itinerary_id, day_index=day_index, items=items)


async def optimize_route(payload: RouteOptimizeRequest, session: AsyncSession) -> RouteOperationResponse:
    day_plan = await get_day_plan(session, payload.itinerary_id, payload.day_index)
    if day_plan is None:
        raise HTTPException(status_code=404, detail="day-plan-not-found")

    if payload.node_ids:
        try:
            await reorder_day_spots(session, day_plan.id, payload.node_ids)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc

    segments = await rebuild_route_segments(session, payload.itinerary_id, day_plan, "system")
    await session.commit()

    return RouteOperationResponse(
        itinerary_id=payload.itinerary_id,
        day_index=payload.day_index,
        sort_source="system",
        status=_status_from_segments(len(segments)),
        segments=[segment_to_response(item) for item in segments],
        message="已按数据库当前顺序生成路线段。" if segments else "当前节点不足 2 个，跳过路线生成。",
        fallback_action=_fallback_action(len(segments)),
        retriable=False,
    )


async def recalculate_route(payload: RouteRecalculateRequest, session: AsyncSession) -> RouteOperationResponse:
    day_plan = await get_day_plan(session, payload.itinerary_id, payload.day_index)
    if day_plan is None:
        raise HTTPException(status_code=404, detail="day-plan-not-found")

    if payload.ordered_node_ids:
        try:
            await reorder_day_spots(session, day_plan.id, payload.ordered_node_ids)
        except ValueError as exc:
            raise HTTPException(status_code=400, detail=str(exc)) from exc

    segments = await rebuild_route_segments(session, payload.itinerary_id, day_plan, payload.sort_source)
    await session.commit()

    return RouteOperationResponse(
        itinerary_id=payload.itinerary_id,
        day_index=payload.day_index,
        sort_source=payload.sort_source,
        status=_status_from_segments(len(segments)),
        segments=[segment_to_response(item) for item in segments],
        message="已根据用户顺序重算路线段。" if segments else "当前节点不足 2 个，保留用户顺序。",
        fallback_action=_fallback_action(len(segments)),
        retriable=False,
    )