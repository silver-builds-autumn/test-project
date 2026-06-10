from pydantic import BaseModel, Field


class RealSceneItem(BaseModel):
    provider: str
    url: str
    license_status: str | None = None
    note: str | None = None


class RealSceneListResponse(BaseModel):
    spot_id: int | None = None
    items: list[RealSceneItem] = Field(default_factory=list)
    message: str
    fallback_action: str | None = None