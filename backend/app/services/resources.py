from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import ResourceProxy
from app.schemas.resource import RealSceneItem, RealSceneListResponse


async def list_real_scenes(spot_id: int | None, session: AsyncSession) -> RealSceneListResponse:
    query = select(ResourceProxy)
    if spot_id is not None:
        query = query.where(ResourceProxy.spot_node_id == spot_id)

    result = await session.execute(query.order_by(ResourceProxy.created_at.desc(), ResourceProxy.id.desc()))
    items = list(result.scalars())

    return RealSceneListResponse(
        spot_id=spot_id,
        items=[
            RealSceneItem(
                provider=item.provider,
                url=item.url,
                license_status=item.license_status,
                note=item.source_page,
            )
            for item in items
        ],
        message="已返回数据库中的实景资源。" if items else "当前无可用实景图资源，前端应降级为基础详情展示。",
        fallback_action=None if items else "hide-real-scene-section",
    )