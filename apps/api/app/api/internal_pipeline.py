from fastapi import APIRouter, Query, BackgroundTasks
from typing import Dict, Any
from app.core.cities_config import CITIES_CONFIG
from app.data_pipeline.scheduler import PIPELINE_HEALTH, run_data_ingestion_for_city
from app.data_pipeline.cache import PipelineCacheLayer

router = APIRouter()

@router.post("/update-data", tags=["internal-pipeline"])
async def trigger_manual_update(
    background_tasks: BackgroundTasks,
    city: str = Query("Delhi")
):
    """Triggers a manual database sync for the specified city in the background."""
    if city not in CITIES_CONFIG:
        return {"status": "error", "message": f"City {city} not configured."}
        
    background_tasks.add_task(run_data_ingestion_for_city, city)
    return {"status": "queued", "message": f"Sync task queued for {city}."}

@router.post("/sync-weather", tags=["internal-pipeline"])
async def trigger_weather_sync(
    background_tasks: BackgroundTasks
):
    """Queues a weather fetch sync task for all active cities."""
    for city in CITIES_CONFIG.keys():
        background_tasks.add_task(run_data_ingestion_for_city, city)
    return {"status": "queued", "message": "Weather sync queued for all cities."}

@router.get("/cache-status", tags=["internal-pipeline"])
def get_cache_status() -> Dict[str, Any]:
    """Returns the key lists currently stored in the pipeline fallback cache."""
    return PipelineCacheLayer.get_status()

@router.get("/data-health", tags=["internal-pipeline"])
def get_data_health() -> Dict[str, Any]:
    """Returns the records validation count and latency profile metrics."""
    latencies = PIPELINE_HEALTH["fetch_latencies_ms"]
    avg_latency = sum(latencies) / len(latencies) if latencies else 0.0
    
    return {
        "last_successful_fetch": PIPELINE_HEALTH["last_successful_fetch"],
        "last_failed_fetch": PIPELINE_HEALTH["last_failed_fetch"],
        "records_imported": PIPELINE_HEALTH["records_imported"],
        "records_rejected": PIPELINE_HEALTH["records_rejected"],
        "average_latency_ms": round(avg_latency, 1),
        "pipeline_active": True
    }
