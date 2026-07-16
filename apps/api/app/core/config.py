import os
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    PROJECT_NAME: str = "UrbanAir AI"
    API_V1_STR: str = "/api/v1"

    # JWT Settings
    JWT_SECRET: str = "CHANGE-ME-set-a-real-secret-in-env"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # SQLite Connection for development fallback
    DATABASE_URL: str = "sqlite:///./urbanair.db"

    # Redis Connection
    REDIS_URL: str = "redis://localhost:6379/0"

    # ML Forecasting Configurations
    USE_REAL_MODEL: bool = True
    USE_DEMO_MODEL: bool = False

    # Real-Time Data Ingestion Pipeline Configurations
    ENABLE_REAL_DATA: bool = True
    ENABLE_CACHE: bool = True
    CACHE_TTL: int = 1800
    DATA_FETCH_INTERVAL: int = 3600

    # MLOps Configurations
    ENABLE_AUTO_RETRAIN: bool = True
    MIN_NEW_RECORDS: int = 500
    RETRAIN_INTERVAL_DAYS: int = 7
    ENABLE_MODEL_PROMOTION: bool = True
    ENABLE_DRIFT_DETECTION: bool = True
    ENABLE_ROLLBACK: bool = True

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8000",
        "https://urbanair.ai",
    ]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()

# Post-process to sanitize database URL
import urllib.parse
if settings.DATABASE_URL and not settings.DATABASE_URL.startswith("sqlite"):
    # Translate legacy postgres:// scheme to postgresql://
    if settings.DATABASE_URL.startswith("postgres://"):
        settings.DATABASE_URL = settings.DATABASE_URL.replace("postgres://", "postgresql://", 1)
        
    try:
        if "://" in settings.DATABASE_URL:
            scheme_split = settings.DATABASE_URL.split("://", 1)
            scheme = scheme_split[0]
            remainder = scheme_split[1]
            
            if "@" in remainder:
                last_at_idx = remainder.rfind("@")
                user_pass_section = remainder[:last_at_idx]
                host_db_section = remainder[last_at_idx + 1:]
                
                if ":" in user_pass_section:
                    user, password = user_pass_section.split(":", 1)
                    encoded_password = urllib.parse.quote_plus(password)
                    settings.DATABASE_URL = f"{scheme}://{user}:{encoded_password}@{host_db_section}"
    except Exception as e:
        print(f"Error sanitizing Settings DATABASE_URL: {e}")
