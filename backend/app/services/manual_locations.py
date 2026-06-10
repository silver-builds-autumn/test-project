from __future__ import annotations

from sqlalchemy.ext.asyncio import AsyncSession

from app.models import ManualLocation
from app.schemas.manual_location import ManualLocationRequest, ManualLocationResponse
from app.services.db_support import get_day_plan


async def create_manual_location(payload: ManualLocationRequest, session: AsyncSession) -> ManualLocationResponse:
    day_plan = None
    if payload.day_index is not None:
        day_plan = await get_day_plan(session, payload.itinerary_id, payload.day_index, create=True)

    session.add(
        ManualLocation(
            itinerary_id=payload.itinerary_id,
            day_plan_id=day_plan.id if day_plan else None,
            label=payload.label,
            lng=payload.lng,
            lat=payload.lat,
            source=payload.source,
        )
    )
    await session.commit()

    return ManualLocationResponse(
        itinerary_id=payload.itinerary_id,
        day_index=payload.day_index,
        label=payload.label,
        lng=payload.lng,
        lat=payload.lat,
        source=payload.source,
        message="已写入人工点位，可供后续路线或地图修正使用。",
    )