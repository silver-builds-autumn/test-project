from app.schemas.geo import GeoCandidate, GeoResolveRequest, GeoResolveResponse


def resolve_geo(payload: GeoResolveRequest) -> GeoResolveResponse:
    keyword = payload.keyword or payload.address or "未命名地点"
    candidate = GeoCandidate(
        provider="placeholder",
        title=keyword,
        address=payload.address,
        lng=None,
        lat=None,
        confidence=0.35,
        note="当前为占位解析结果，后续会接入真实 POI / 地理编码服务。",
    )
    return GeoResolveResponse(
        resolved=False,
        strategy="candidate-only",
        candidates=[candidate],
        message="当前返回候选结果占位，后续接入真实地址解析。",
        fallback_action="allow-manual-location-or-text-node",
        retriable=True,
    )