from fastapi import APIRouter, Query, BackgroundTasks
from typing import Dict, Any, List
from mlops.registry import ModelRegistryManager
from mlops.promotion import evaluate_model_promotion
from mlops.rollback import rollback_production_model
from mlops.monitoring import check_and_trigger_retraining, MLOPS_METRICS
from ml.model_loader import MLModelLoader

router = APIRouter()

@router.get("", tags=["mlops-admin"])
def get_all_models() -> List[Dict[str, Any]]:
    """Returns all models registered in the registry."""
    return ModelRegistryManager.get_history()

@router.get("/current", tags=["mlops-admin"])
def get_current_model() -> Dict[str, Any]:
    """Returns details of the active production model along with runtime telemetry diagnostics."""
    prod = ModelRegistryManager.get_production_version_details()
    avg_lat = 0.0
    if MLOPS_METRICS["prediction_count"] > 0:
        avg_lat = MLOPS_METRICS["total_latency_ms"] / MLOPS_METRICS["prediction_count"]
        
    return {
        "production_model": prod,
        "runtime_metrics": {
            "prediction_count": MLOPS_METRICS["prediction_count"],
            "average_latency_ms": round(avg_lat, 2),
            "drift_detected": MLOPS_METRICS["drift_detected"],
            "drift_index": MLOPS_METRICS["drift_index"],
            "last_retrain_time": MLOPS_METRICS["last_retrain_time"]
        }
    }

@router.get("/history", tags=["mlops-admin"])
def get_model_history() -> List[Dict[str, Any]]:
    """Alternative endpoint to query version history logs."""
    return ModelRegistryManager.get_history()

@router.post("/promote", tags=["mlops-admin"])
def promote_model_version(version: str = Query(...)) -> Dict[str, Any]:
    """Forces manual promotion of a registered staging model version to production."""
    success, msg = evaluate_model_promotion(version)
    if success:
        # Reload the ML model singleton memory to apply changes immediately
        MLModelLoader.get_model_payload(force_reload=True)
        return {"status": "success", "message": msg}
    return {"status": "rejected", "message": msg}

@router.post("/rollback", tags=["mlops-admin"])
def rollback_model_version() -> Dict[str, Any]:
    """Triggers safe rollback to the designated backup rollback version."""
    success, msg = rollback_production_model()
    if success:
        # Reload memory
        MLModelLoader.get_model_payload(force_reload=True)
        return {"status": "success", "message": msg}
    return {"status": "error", "message": msg}

@router.post("/retrain", tags=["mlops-admin"])
async def trigger_retraining(background_tasks: BackgroundTasks) -> Dict[str, Any]:
    """Queues a non-blocking background task checking dataset criteria to retrain models."""
    def run_job():
        msg = check_and_trigger_retraining()
        print(f"Async retraining completed with status: {msg}")
        
    background_tasks.add_task(run_job)
    return {"status": "queued", "message": "MLOps retraining job scheduled in background."}
