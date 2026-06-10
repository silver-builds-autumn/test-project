from pydantic import BaseModel, Field

from app.models import SpotNodeKind


class SpotCreateRequest(BaseModel):
    itinerary_id: int
    day_index: int
    name: str
    address: str | None = None
    category: str | None = None
    kind: SpotNodeKind = SpotNodeKind.poi
    search_keyword: str | None = None
    lng: float | None = None
    lat: float | None = None
    order_index: int = 0
    short_description: str | None = None
    description: str | None = None


class SpotUpdateRequest(BaseModel):
    day_index: int | None = None
    name: str | None = None
    address: str | None = None
    category: str | None = None
    search_keyword: str | None = None
    lng: float | None = None
    lat: float | None = None
    order_index: int | None = None
    short_description: str | None = None
    description: str | None = None


class SpotResponse(BaseModel):
    id: int
    itinerary_id: int
    day_index: int
    name: str
    category: str | None = None
    kind: SpotNodeKind
    address: str | None = None
    search_keyword: str | None = None
    lng: float | None = None
    lat: float | None = None
    order_index: int
    short_description: str | None = None
    description: str | None = None


class SpotListResponse(BaseModel):
    itinerary_id: int
    day_index: int | None = None
    items: list[SpotResponse] = Field(default_factory=list)


class SpotReorderRequest(BaseModel):
    itinerary_id: int
    day_index: int
    ordered_node_ids: list[int] = Field(default_factory=list)
    sort_source: str = "manual"


class SpotReorderResponse(BaseModel):
    itinerary_id: int
    day_index: int
    ordered_node_ids: list[int]
    sort_source: str
    route_status: str
    message: str