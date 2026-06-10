from __future__ import annotations

from pathlib import Path

from app.core.settings import settings
from app.db.seed_data import seed_database
from app.db.session import AsyncSessionLocal, engine
from app.models import Base


def _ensure_sqlite_parent_dir() -> None:
    if not settings.database_url.startswith("sqlite"):
        return

    raw_path = settings.database_url.split("///", 1)[-1]
    if raw_path in {":memory:", ""}:
        return

    Path(raw_path).expanduser().parent.mkdir(parents=True, exist_ok=True)


async def init_database() -> None:
    _ensure_sqlite_parent_dir()
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        await seed_database(session)