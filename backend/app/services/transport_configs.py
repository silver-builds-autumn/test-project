from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import TransportConfig, TransportMode
from app.schemas.transport import TransportConfigRequest, TransportConfigResponse
from app.services.db_support import get_day_plan


async def save_transport_config(payload: TransportConfigRequest, session: AsyncSession) -> TransportConfigResponse:
    day_plan = None
    if payload.day_index is not None:
        day_plan = await get_day_plan(session, payload.itinerary_id, payload.day_index, create=True)

    result = await session.execute(
        select(TransportConfig).where(
            TransportConfig.itinerary_id == payload.itinerary_id,
            TransportConfig.day_plan_id == (day_plan.id if day_plan else None),
            TransportConfig.from_ref == payload.from_ref,
            TransportConfig.to_ref == payload.to_ref,
        )
    )
    entity = result.scalar_one_or_none()
    if entity is None:
        entity = TransportConfig(
            itinerary_id=payload.itinerary_id,
            day_plan_id=day_plan.id if day_plan else None,
            from_ref=payload.from_ref,
            to_ref=payload.to_ref,
        )
        session.add(entity)

    entity.mode = TransportMode(payload.mode)
    entity.custom_note = payload.custom_note
    await session.commit()

    return TransportConfigResponse(
        itinerary_id=payload.itinerary_id,
        day_index=payload.day_index,
        from_ref=payload.from_ref,
        to_ref=payload.to_ref,
        mode=entity.mode.value,
        custom_note=payload.custom_note,
        message="已保存通行方式配置。",
        fallback_action=None,
    )