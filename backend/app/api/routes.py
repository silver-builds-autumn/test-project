from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.schemas.route import RouteListResponse, RouteOperationResponse, RouteOptimizeRequest, RouteRecalculateRequest
from app.services.routes import list_routes, optimize_route, recalculate_route

router = APIRouter(tags=["routes"])


@router.get("/routes", response_model=RouteListResponse)
async def list_routes_endpoint(
    itineraryId: int,
    dayIndex: int | None = None,
    session: AsyncSession = Depends(get_db_session),
) -> RouteListResponse:
    return await list_routes(itineraryId, dayIndex, session)


@router.post("/routes/optimize", response_model=RouteOperationResponse)
async def optimize_route_endpoint(
    payload: RouteOptimizeRequest,
    session: AsyncSession = Depends(get_db_session),
) -> RouteOperationResponse:
    return await optimize_route(payload, session)


@router.post("/routes/recalculate", response_model=RouteOperationResponse)
async def recalculate_route_endpoint(
    payload: RouteRecalculateRequest,
    session: AsyncSession = Depends(get_db_session),
) -> RouteOperationResponse:
    return await recalculate_route(payload, session)