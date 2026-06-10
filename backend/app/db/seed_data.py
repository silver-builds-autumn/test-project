from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import DayPlan, Itinerary, RouteSegment, RouteStatus, SpotNode, SpotNodeKind
from app.services.db_support import build_geometry_json

SEED_ITINERARY = {
    "title": "2026端午广州看龙舟 + 珠海三日地图攻略",
    "date_range_label": "2026-06-19 至 2026-06-21",
    "principle": "广州看龙舟后转珠海，围绕吉大、情侣路与城市阳台减少折返。",
    "center_lng": 113.46,
    "center_lat": 22.72,
    "zoom": 9,
}

SEED_DAYS = [
    {
        "day_index": 1,
        "title": "Day 1｜广州龙舟观赛 + 傍晚进珠海",
        "color": "#c43d2b",
        "summary": "上午广州看龙舟，傍晚优先广州东或广州南转珠海站。",
        "spots": [
            {
                "name": "五羊邨地铁站",
                "category": "station",
                "kind": SpotNodeKind.poi,
                "lng": 113.3149,
                "lat": 23.1192,
                "short_description": "广州龙舟主线入口",
                "description": "作为广州端午龙舟主线集合点，便于切入寺右和二沙涌观赛带。",
            },
            {
                "name": "二沙涌 / 寺右龙舟观赛带",
                "category": "dragon",
                "kind": SpotNodeKind.poi,
                "lng": 113.3048,
                "lat": 23.1162,
                "short_description": "端午上午主看点",
                "description": "当前静态版主路线中的核心观赛点，强调上午提前到位。",
            },
            {
                "name": "广州东站",
                "category": "station",
                "kind": SpotNodeKind.poi,
                "lng": 113.3249,
                "lat": 23.1506,
                "short_description": "傍晚优先进珠海的转场站",
                "description": "第一天从广州撤离后优先转入珠海站的跨城交通锚点。",
            },
            {
                "name": "珠海站",
                "category": "station",
                "kind": SpotNodeKind.poi,
                "lng": 113.5493,
                "lat": 22.2153,
                "short_description": "珠海到站与返程站",
                "description": "全程跨城锚点，第一晚到站与第三天下午返程都围绕这里。",
            },
        ],
    },
    {
        "day_index": 2,
        "title": "Day 2｜珠海园林、北山与海岸线",
        "color": "#206fba",
        "summary": "围绕园林、商圈、情侣路海岸线串联，减少来回折返。",
        "spots": [
            {
                "name": "圆明新园",
                "category": "sight",
                "kind": SpotNodeKind.poi,
                "lng": 113.5335,
                "lat": 22.2472,
                "short_description": "第二天上午园林主点",
                "description": "第二天上午轻量游园与拍照的起点。",
            },
            {
                "name": "富华里",
                "category": "food",
                "kind": SpotNodeKind.poi,
                "lng": 113.5452,
                "lat": 22.2392,
                "short_description": "商圈午餐与降温点",
                "description": "连接园林与海岸线之间的室内休整和午餐节点。",
            },
            {
                "name": "珠海渔女",
                "category": "sight",
                "kind": SpotNodeKind.poi,
                "lng": 113.5875,
                "lat": 22.2715,
                "short_description": "情侣路海岸线代表点",
                "description": "第二天下午海岸线串联中的标志性节点。",
            },
            {
                "name": "珠海大剧院（日月贝）",
                "category": "sight",
                "kind": SpotNodeKind.poi,
                "lng": 113.5867,
                "lat": 22.2763,
                "short_description": "夜间亮灯收尾点",
                "description": "第二天晚间海边收尾与亮灯观景点。",
            },
        ],
    },
    {
        "day_index": 3,
        "title": "Day 3｜景山/海滨公园 + 午餐后返广州",
        "color": "#1f9a6d",
        "summary": "第三天控制体力与返程时间，围绕城市阳台和珠海站收束动线。",
        "spots": [
            {
                "name": "景山公园",
                "category": "sight",
                "kind": SpotNodeKind.poi,
                "lng": 113.5758,
                "lat": 22.2626,
                "short_description": "第三天上午轻量看海点",
                "description": "第三天控制体力和时间的轻量登高节点。",
            },
            {
                "name": "城市阳台",
                "category": "sight",
                "kind": SpotNodeKind.poi,
                "lng": 113.5809,
                "lat": 22.2558,
                "short_description": "返程前的近程补逛点",
                "description": "靠近主住宿圈和返程动线，适合作为第三天补逛缓冲。",
            },
            {
                "name": "珠海站",
                "category": "station",
                "kind": SpotNodeKind.poi,
                "lng": 113.5493,
                "lat": 22.2153,
                "short_description": "第三天下午返程站",
                "description": "第三天下午返广州前的最终交通锚点。",
            },
        ],
    },
]


async def seed_database(session: AsyncSession) -> None:
    itinerary_count = await session.scalar(select(func.count(Itinerary.id)))
    if itinerary_count:
        return

    itinerary = Itinerary(
        title=SEED_ITINERARY["title"],
        date_range_label=SEED_ITINERARY["date_range_label"],
        principle=SEED_ITINERARY["principle"],
        view_mode="map",
        center_lng=SEED_ITINERARY["center_lng"],
        center_lat=SEED_ITINERARY["center_lat"],
        zoom=SEED_ITINERARY["zoom"],
    )
    session.add(itinerary)
    await session.flush()

    for day in SEED_DAYS:
        day_plan = DayPlan(
            itinerary_id=itinerary.id,
            day_index=day["day_index"],
            title=day["title"],
            color=day["color"],
            summary=day["summary"],
        )
        session.add(day_plan)
        await session.flush()

        day_spots: list[SpotNode] = []
        for index, spot in enumerate(day["spots"], start=1):
            spot_node = SpotNode(
                day_plan_id=day_plan.id,
                name=spot["name"],
                category=spot["category"],
                kind=spot["kind"],
                lng=spot["lng"],
                lat=spot["lat"],
                order_index=index,
                short_description=spot["short_description"],
                description=spot["description"],
            )
            session.add(spot_node)
            day_spots.append(spot_node)

        await session.flush()

        for index, (from_spot, to_spot) in enumerate(zip(day_spots, day_spots[1:]), start=1):
            geometry_json = build_geometry_json(from_spot, to_spot)
            session.add(
                RouteSegment(
                    itinerary_id=itinerary.id,
                    day_plan_id=day_plan.id,
                    from_node_id=from_spot.id,
                    to_node_id=to_spot.id,
                    sequence_index=index,
                    sort_source="seed",
                    status=RouteStatus.ready if geometry_json else RouteStatus.pending,
                    geometry_json=geometry_json,
                )
            )

    await session.commit()