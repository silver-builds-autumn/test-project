from pydantic import BaseModel


class ManualLocationRequest(BaseModel):
    itinerary_id: int
    day_index: int | None = None
    label: str
    lng: float
    lat: float
    source: str = "map-select"


class ManualLocationResponse(BaseModel):
    itinerary_id: int
    day_index: int | None = None
    label: str
    lng: float
    lat: float
    source: str
    message: str