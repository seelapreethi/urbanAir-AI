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
