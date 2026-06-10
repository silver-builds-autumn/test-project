from pydantic import BaseModel, Field

from app.models import RouteStatus


class RouteOptimizeRequest(BaseModel):
    itinerary_id: int
    day_index: int
    node_ids: list[int] = Field(default_factory=list)
    transport_constraints: list[str] = Field(default_factory=list)


class RouteRecalculateRequest(BaseModel):
    itinerary_id: int
    day_index: int
    ordered_node_ids: list[int] = Field(default_factory=list)
    sort_source: str = "manual"


class RouteSegmentResponse(BaseModel):
    sequence_index: int
    from_ref: int | None = None
    to_ref: int | None = None
    status: RouteStatus
    sort_source: str
    geometry_json: str | None = None
    distance_meters: int | None = None
    duration_seconds: int | None = None


class RouteOperationResponse(BaseModel):
    itinerary_id: int
    day_index: int
    sort_source: str
    status: RouteStatus
    segments: list[RouteSegmentResponse] = Field(default_factory=list)
    message: str
    fallback_action: str | None = None
    retriable: bool = False


class RouteDayResponse(BaseModel):
    itinerary_id: int
    day_index: int
    sort_source: str
    status: RouteStatus
    segments: list[RouteSegmentResponse] = Field(default_factory=list)
    message: str | None = None
    fallback_action: str | None = None


class RouteListResponse(BaseModel):
    itinerary_id: int
    day_index: int | None = None
    items: list[RouteDayResponse] = Field(default_factory=list)