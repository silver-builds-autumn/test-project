from pydantic import BaseModel, Field


class GeoResolveRequest(BaseModel):
    keyword: str | None = Field(default=None, description="POI 搜索关键词")
    address: str | None = Field(default=None, description="原始地址文本")


class GeoCandidate(BaseModel):
    provider: str = Field(default="placeholder")
    title: str
    address: str | None = None
    lng: float | None = None
    lat: float | None = None
    confidence: float = 0.0
    note: str | None = None


class GeoResolveResponse(BaseModel):
    resolved: bool
    strategy: str
    candidates: list[GeoCandidate] = Field(default_factory=list)
    message: str | None = None
    fallback_action: str | None = None
    retriable: bool = False