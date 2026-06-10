from pydantic import BaseModel, Field


class TransportConfigRequest(BaseModel):
    itinerary_id: int
    day_index: int | None = None
    from_ref: str
    to_ref: str
    mode: str = "transit"
    custom_note: str | None = None


class TransportConfigResponse(BaseModel):
    itinerary_id: int
    day_index: int | None = None
    from_ref: str
    to_ref: str
    mode: str
    custom_note: str | None = None
    message: str
    fallback_action: str | None = None