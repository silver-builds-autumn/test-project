from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.schemas.resource import RealSceneListResponse
from app.services.resources import list_real_scenes

router = APIRouter(tags=["resources"])


@router.get("/resources/real-scenes", response_model=RealSceneListResponse)
async def list_real_scenes_endpoint(
    spotId: int | None = None,
    session: AsyncSession = Depends(get_db_session),
) -> RealSceneListResponse:
    return await list_real_scenes(spotId, session)