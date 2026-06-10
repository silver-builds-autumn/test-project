from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.schemas.manual_location import ManualLocationRequest, ManualLocationResponse
from app.services.manual_locations import create_manual_location

router = APIRouter(tags=["manual-locations"])


@router.post("/manual-locations", response_model=ManualLocationResponse)
async def create_manual_location_endpoint(
    payload: ManualLocationRequest,
    session: AsyncSession = Depends(get_db_session),
) -> ManualLocationResponse:
    return await create_manual_location(payload, session)