from fastapi import APIRouter

from app.api import geo, manual_locations, resources, routes, spots, transport_configs

api_router = APIRouter()
api_router.include_router(spots.router)
api_router.include_router(geo.router)
api_router.include_router(routes.router)
api_router.include_router(transport_configs.router)
api_router.include_router(manual_locations.router)
api_router.include_router(resources.router)