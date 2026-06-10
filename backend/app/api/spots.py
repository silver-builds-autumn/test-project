from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.schemas.spot import (
    SpotCreateRequest,
    SpotListResponse,
    SpotReorderRequest,
    SpotReorderResponse,
    SpotResponse,
    SpotUpdateRequest,
)
from app.services.spots import create_spot, list_spots, reorder_spots, update_spot

router = APIRouter(tags=["spots"])


@router.post("/spots", response_model=SpotResponse)
async def create_spot_endpoint(payload: SpotCreateRequest, session: AsyncSession = Depends(get_db_session)) -> SpotResponse:
    return await create_spot(payload, session)


@router.get("/spots", response_model=SpotListResponse)
async def list_spots_endpoint(
    itineraryId: int,
    dayIndex: int | None = None,
    session: AsyncSession = Depends(get_db_session),
) -> SpotListResponse:
    return await list_spots(itineraryId, dayIndex, session)


@router.patch("/spots/reorder", response_model=SpotReorderResponse)
async def reorder_spots_endpoint(
    payload: SpotReorderRequest,
    session: AsyncSession = Depends(get_db_session),
) -> SpotReorderResponse:
    return await reorder_spots(payload, session)


@router.patch("/spots/{spot_id}", response_model=SpotResponse)
async def update_spot_endpoint(
    spot_id: int,
    payload: SpotUpdateRequest,
    session: AsyncSession = Depends(get_db_session),
) -> SpotResponse:
    return await update_spot(spot_id, payload, session)