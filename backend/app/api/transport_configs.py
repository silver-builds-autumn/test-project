from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.schemas.transport import TransportConfigRequest, TransportConfigResponse
from app.services.transport_configs import save_transport_config

router = APIRouter(tags=["transport-configs"])


@router.post("/transport-configs", response_model=TransportConfigResponse)
async def save_transport_config_endpoint(
    payload: TransportConfigRequest,
    session: AsyncSession = Depends(get_db_session),
) -> TransportConfigResponse:
    return await save_transport_config(payload, session)