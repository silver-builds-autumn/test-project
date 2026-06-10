from fastapi import APIRouter

from app.schemas.geo import GeoResolveRequest, GeoResolveResponse
from app.services.geo import resolve_geo

router = APIRouter(tags=["geo"])


@router.post("/geo/resolve", response_model=GeoResolveResponse)
async def resolve_geo_endpoint(payload: GeoResolveRequest) -> GeoResolveResponse:
    return resolve_geo(payload)