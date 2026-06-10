from __future__ import annotations

from datetime import date, datetime
from enum import Enum

from sqlalchemy import Date, DateTime, Enum as SqlEnum, Float, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class SpotNodeKind(str, Enum):
    poi = "poi"
    text = "text"
    manual = "manual"


class RouteStatus(str, Enum):
    pending = "pending"
    ready = "ready"
    failed = "failed"
    stale = "stale"


class TransportMode(str, Enum):
    walking = "walking"
    driving = "driving"
    transit = "transit"
    taxi = "taxi"
    custom = "custom"


class Itinerary(Base):
    __tablename__ = "itineraries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    start_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    date_range_label: Mapped[str | None] = mapped_column(String(120), nullable=True)
    principle: Mapped[str | None] = mapped_column(Text, nullable=True)
    view_mode: Mapped[str] = mapped_column(String(40), nullable=False, default="map")
    center_lng: Mapped[float | None] = mapped_column(Float, nullable=True)
    center_lat: Mapped[float | None] = mapped_column(Float, nullable=True)
    zoom: Mapped[int | None] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    day_plans: Mapped[list[DayPlan]] = relationship(back_populates="itinerary", cascade="all, delete-orphan")


class DayPlan(Base):
    __tablename__ = "day_plans"
    __table_args__ = (UniqueConstraint("itinerary_id", "day_index", name="uq_day_plans_itinerary_day_index"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    itinerary_id: Mapped[int] = mapped_column(ForeignKey("itineraries.id", ondelete="CASCADE"), nullable=False)
    day_index: Mapped[int] = mapped_column(Integer, nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    date: Mapped[date | None] = mapped_column(Date, nullable=True)
    color: Mapped[str | None] = mapped_column(String(20), nullable=True)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    itinerary: Mapped[Itinerary] = relationship(back_populates="day_plans")
    spots: Mapped[list[SpotNode]] = relationship(back_populates="day_plan", cascade="all, delete-orphan")


class SpotNode(Base):
    __tablename__ = "spot_nodes"
    __table_args__ = (UniqueConstraint("day_plan_id", "order_index", name="uq_spot_nodes_day_plan_order_index"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    day_plan_id: Mapped[int] = mapped_column(ForeignKey("day_plans.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    category: Mapped[str | None] = mapped_column(String(40), nullable=True)
    kind: Mapped[SpotNodeKind] = mapped_column(SqlEnum(SpotNodeKind), nullable=False, default=SpotNodeKind.poi)
    address: Mapped[str | None] = mapped_column(String(255), nullable=True)
    search_keyword: Mapped[str | None] = mapped_column(String(255), nullable=True)
    poi_id: Mapped[str | None] = mapped_column(String(120), nullable=True)
    lng: Mapped[float | None] = mapped_column(Float, nullable=True)
    lat: Mapped[float | None] = mapped_column(Float, nullable=True)
    order_index: Mapped[int] = mapped_column(Integer, nullable=False)
    short_description: Mapped[str | None] = mapped_column(String(255), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    cost_note: Mapped[str | None] = mapped_column(String(120), nullable=True)
    time_note: Mapped[str | None] = mapped_column(String(120), nullable=True)
    dwell_note: Mapped[str | None] = mapped_column(String(120), nullable=True)
    transport_note: Mapped[str | None] = mapped_column(Text, nullable=True)
    walking_note: Mapped[str | None] = mapped_column(Text, nullable=True)
    risk_note: Mapped[str | None] = mapped_column(Text, nullable=True)
    tags_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    day_plan: Mapped[DayPlan] = relationship(back_populates="spots")


class RouteSegment(Base):
    __tablename__ = "route_segments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    itinerary_id: Mapped[int] = mapped_column(ForeignKey("itineraries.id", ondelete="CASCADE"), nullable=False)
    day_plan_id: Mapped[int] = mapped_column(ForeignKey("day_plans.id", ondelete="CASCADE"), nullable=False)
    from_node_id: Mapped[int | None] = mapped_column(ForeignKey("spot_nodes.id", ondelete="SET NULL"), nullable=True)
    to_node_id: Mapped[int | None] = mapped_column(ForeignKey("spot_nodes.id", ondelete="SET NULL"), nullable=True)
    sort_source: Mapped[str] = mapped_column(String(40), nullable=False, default="system")
    status: Mapped[RouteStatus] = mapped_column(SqlEnum(RouteStatus), nullable=False, default=RouteStatus.pending)
    geometry_json: Mapped[str | None] = mapped_column(Text, nullable=True)
    distance_meters: Mapped[int | None] = mapped_column(Integer, nullable=True)
    duration_seconds: Mapped[int | None] = mapped_column(Integer, nullable=True)
    sequence_index: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)


class TransportConfig(Base):
    __tablename__ = "transport_configs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    itinerary_id: Mapped[int] = mapped_column(ForeignKey("itineraries.id", ondelete="CASCADE"), nullable=False)
    day_plan_id: Mapped[int | None] = mapped_column(ForeignKey("day_plans.id", ondelete="CASCADE"), nullable=True)
    from_ref: Mapped[str] = mapped_column(String(120), nullable=False)
    to_ref: Mapped[str] = mapped_column(String(120), nullable=False)
    mode: Mapped[TransportMode] = mapped_column(SqlEnum(TransportMode), nullable=False, default=TransportMode.transit)
    custom_note: Mapped[str | None] = mapped_column(Text, nullable=True)
    duration_seconds: Mapped[int | None] = mapped_column(Integer, nullable=True)
    distance_meters: Mapped[int | None] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)


class ManualLocation(Base):
    __tablename__ = "manual_locations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    itinerary_id: Mapped[int] = mapped_column(ForeignKey("itineraries.id", ondelete="CASCADE"), nullable=False)
    day_plan_id: Mapped[int | None] = mapped_column(ForeignKey("day_plans.id", ondelete="CASCADE"), nullable=True)
    label: Mapped[str] = mapped_column(String(120), nullable=False)
    source: Mapped[str] = mapped_column(String(40), nullable=False, default="map-select")
    lng: Mapped[float] = mapped_column(Float, nullable=False)
    lat: Mapped[float] = mapped_column(Float, nullable=False)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)


class RouteCache(Base):
    __tablename__ = "route_cache"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    itinerary_id: Mapped[int] = mapped_column(ForeignKey("itineraries.id", ondelete="CASCADE"), nullable=False)
    day_index: Mapped[int] = mapped_column(Integer, nullable=False)
    input_hash: Mapped[str] = mapped_column(String(128), nullable=False)
    result_json: Mapped[str] = mapped_column(Text, nullable=False)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)


class ResourceProxy(Base):
    __tablename__ = "resource_proxies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    spot_node_id: Mapped[int | None] = mapped_column(ForeignKey("spot_nodes.id", ondelete="CASCADE"), nullable=True)
    provider: Mapped[str] = mapped_column(String(80), nullable=False)
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    license_status: Mapped[str | None] = mapped_column(String(80), nullable=True)
    source_page: Mapped[str | None] = mapped_column(String(500), nullable=True)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.utcnow)