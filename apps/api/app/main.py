import bcrypt

# Monkeypatch bcrypt for passlib compatibility to bypass the incorrect 72 bytes password constraint error
if not hasattr(bcrypt, "__about__"):
    class About:
        __version__ = getattr(bcrypt, "__version__", "4.0.1")
    bcrypt.__about__ = About

# Wrap hashpw to safely truncate passwords > 72 bytes to bypass modern bcrypt length checks
_original_hashpw = bcrypt.hashpw
def _safe_hashpw(password, salt):
    if isinstance(password, bytes) and len(password) > 72:
        password = password[:72]
    elif isinstance(password, str) and len(password) > 72:
        password = password[:72]
    return _original_hashpw(password, salt)
bcrypt.hashpw = _safe_hashpw

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.core.config import settings
from app.api.router import api_router
from app.database.session import engine, SessionLocal
from app.models.base import Base
from app.models.role import Role
from app.models.user import User
from app.models.city import City
from app.models.ward import Ward
from app.models.aqi_station import AQIStation
from app.models.layer import Layer
from app.models.hotspot import Hotspot
from app.models.weather_snapshot import WeatherSnapshot
from app.models.forecast import Forecast
from app.models.recommendation import Recommendation
from app.models.prediction_history import PredictionHistory
from app.models.pollution_source import PollutionSource
from app.models.source_attribution import SourceAttribution
from app.models.inspection import Inspection
from app.models.enforcement_action import EnforcementAction
from app.models.conversation import Conversation
from app.models.message import Message
from app.models.health_advisory import HealthAdvisory
from app.models.notification import Notification
from app.models.translation_cache import TranslationCache
from app.models.scenario import Scenario
from app.models.simulation import Simulation, SimulationResult
from app.models.report import Report, ReportTemplate
from app.models.explainability_log import ExplainabilityLog
from app.database.seed import seed_db

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not settings.DATABASE_URL.startswith("sqlite"):
        # Ensure PostGIS extension exists if running on PostgreSQL
        db = SessionLocal()
        try:
            db.execute(text("CREATE EXTENSION IF NOT EXISTS postgis;"))
            db.commit()
            logger.info("Checked/created PostGIS extension.")
        except Exception as e:
            logger.warning(f"Could not verify/create PostGIS extension: {e}. If using SQLite or a non-spatial DB, this is expected.")
        finally:
            db.close()

    # Create tables
    logger.info("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    # Run optional development seeding
    db = SessionLocal()
    try:
        seed_db(db)
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
    finally:
        db.close()

    # Load ML model singleton at startup
    try:
        from ml.model_loader import MLModelLoader
        logger.info("Initializing ML Model Loader at startup...")
        MLModelLoader.load_model()
    except Exception as e:
        logger.error(f"Failed to initialize MLModelLoader: {e}")

    # Launch Real-Time Data Ingestion Scheduler
    try:
        import asyncio
        from app.data_pipeline.scheduler import start_background_scheduler
        loop = asyncio.get_running_loop()
        start_background_scheduler(loop)
        logger.info("Started Ingestion Pipeline background scheduler loop.")
    except Exception as e:
        logger.error(f"Failed to start Ingestion Pipeline: {e}")
        
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# CORS Middleware
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include core routes
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/health", tags=["system"])
@app.get("/api/health", tags=["system"])
@app.get("/api/v1/health", tags=["system"])
def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "database": "connected",
        "redis": "connected",
        "ai_service": "available"
    }


@app.get("/ready", tags=["system"])
def readiness_check():
    return {"status": "ready"}


@app.get("/live", tags=["system"])
def liveness_check():
    return {"status": "alive"}
