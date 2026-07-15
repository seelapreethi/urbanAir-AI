import asyncio
import logging
import time
from datetime import datetime
from app.core.config import settings
from app.core.cities_config import CITIES_CONFIG
from app.data_pipeline.connectors import OpenAQConnector, OpenMeteoConnector, OSMConnector
from app.data_pipeline.normalizers import normalize_weather_data, normalize_openaq_data
from app.data_pipeline.validators import validate_record
from app.data_pipeline.cache import PipelineCacheLayer

logger = logging.getLogger(__name__)

# Global health metrics dictionary
PIPELINE_HEALTH = {
    "last_successful_fetch": None,
    "last_failed_fetch": None,
    "records_imported": 0,
    "records_rejected": 0,
    "fetch_latencies_ms": []
}

async def run_data_ingestion_for_city(city: str):
    cfg = CITIES_CONFIG.get(city)
    if not cfg:
        return
        
    lat, lon = cfg["lat"], cfg["lon"]
    t0 = time.time()
    
    openaq = OpenAQConnector()
    meteo = OpenMeteoConnector()
    osm = OSMConnector()
    
    # 1. Fetch Air Quality
    aqi_data = None
    if settings.ENABLE_REAL_DATA:
        raw_aqi = await openaq.fetch_latest(city)
        if raw_aqi:
            aqi_data = normalize_openaq_data(city, lat, lon, raw_aqi)
            if validate_record(aqi_data):
                PipelineCacheLayer.set(f"aqi_{city}", aqi_data, settings.CACHE_TTL)
                PIPELINE_HEALTH["records_imported"] += 1
            else:
                PIPELINE_HEALTH["records_rejected"] += 1
                
    # Fallback to cache if disabled or query fails
    if not aqi_data:
        aqi_data = PipelineCacheLayer.get(f"aqi_{city}") or PipelineCacheLayer.get_fallback(f"aqi_{city}")
        
    # 2. Fetch Weather
    weather_data = None
    if settings.ENABLE_REAL_DATA:
        raw_weather = await meteo.fetch_weather(lat, lon)
        if raw_weather:
            weather_data = normalize_weather_data(city, lat, lon, raw_weather)
            if validate_record(weather_data):
                PipelineCacheLayer.set(f"weather_{city}", weather_data, settings.CACHE_TTL)
                PIPELINE_HEALTH["records_imported"] += 1
            else:
                PIPELINE_HEALTH["records_rejected"] += 1
                
    # Fallback to cache
    if not weather_data:
        weather_data = PipelineCacheLayer.get(f"weather_{city}") or PipelineCacheLayer.get_fallback(f"weather_{city}")
        
    # Log latency
    duration_ms = int((time.time() - t0) * 1000)
    PIPELINE_HEALTH["fetch_latencies_ms"].append(duration_ms)
    # Keep last 50 latency records
    if len(PIPELINE_HEALTH["fetch_latencies_ms"]) > 50:
        PIPELINE_HEALTH["fetch_latencies_ms"].pop(0)

    if aqi_data or weather_data:
        PIPELINE_HEALTH["last_successful_fetch"] = datetime.now().isoformat()
    else:
        PIPELINE_HEALTH["last_failed_fetch"] = datetime.now().isoformat()

async def pipeline_scheduler_loop():
    """Asynchronous background loop task designed to refresh inputs at intervals."""
    logger.info("Initializing Real-Time Data Ingestion Pipeline Scheduler...")
    
    # Run initial sync on startup
    for city in CITIES_CONFIG.keys():
        try:
            await run_data_ingestion_for_city(city)
        except Exception as e:
            logger.error(f"Startup pipeline fetch failed for {city}: {str(e)}")
            
    while True:
        try:
            logger.info("Scheduler loop checking: Triggering live telemetry fetch cycle...")
            for city in CITIES_CONFIG.keys():
                await run_data_ingestion_for_city(city)
        except Exception as e:
            logger.error(f"Ingestion scheduler cycle failed: {str(e)}")
            PIPELINE_HEALTH["last_failed_fetch"] = datetime.now().isoformat()
            
        # Wait for configured interval
        await asyncio.sleep(settings.DATA_FETCH_INTERVAL)

def start_background_scheduler(loop: asyncio.AbstractEventLoop):
    """Starts the pipeline scheduler as an independent task within the event loop."""
    loop.create_task(pipeline_scheduler_loop())
