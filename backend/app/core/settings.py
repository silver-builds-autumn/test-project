from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[2]
DEFAULT_SQLITE_PATH = BASE_DIR / "data" / "dragon_boat_guide.db"
DEFAULT_DATABASE_URL = f"sqlite+aiosqlite:///{DEFAULT_SQLITE_PATH.as_posix()}"
DEFAULT_CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
]


class Settings(BaseSettings):
    app_name: str = "dragon-boat-guide-backend"
    environment: str = "development"
    database_url: str = DEFAULT_DATABASE_URL
    cors_origins: list[str] = DEFAULT_CORS_ORIGINS

    model_config = SettingsConfigDict(
        env_prefix="DBG_",
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()