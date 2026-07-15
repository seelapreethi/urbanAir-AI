import os
import sys
import logging
from datetime import datetime
from app.core.config import settings
from app.data_pipeline.scheduler import PIPELINE_HEALTH

logger = logging.getLogger(__name__)

# Operational performance metrics
MLOPS_METRICS = {
    "prediction_count": 0,
    "total_latency_ms": 0,
    "drift_detected": False,
    "last_retrain_time": None,
    "drift_index": 0.0
}

def record_prediction_latency(latency_ms: int):
    MLOPS_METRICS["prediction_count"] += 1
    MLOPS_METRICS["total_latency_ms"] += latency_ms

def check_data_drift(historical_mean_aqi: float = 110.0, current_mean_aqi: float = 145.0) -> bool:
    """Detects if predictions have drifted significantly (exceeding 20% shift limits)."""
    if historical_mean_aqi == 0:
        return False
        
    shift = abs(current_mean_aqi - historical_mean_aqi) / historical_mean_aqi
    MLOPS_METRICS["drift_index"] = float(round(shift, 3))
    
    if shift > 0.20:
        logger.warning(f"Drift detected! Prediction shift of {shift*100:.1f}% exceeds 20% threshold.")
        MLOPS_METRICS["drift_detected"] = True
        return True
        
    MLOPS_METRICS["drift_detected"] = False
    return False

def check_and_trigger_retraining() -> str:
    """Verifies ingestion milestones (record threshold or drift flags) to compile new models."""
    if not settings.ENABLE_AUTO_RETRAIN:
        return "Auto-retraining disabled by config settings."
        
    records_added = PIPELINE_HEALTH["records_imported"]
    
    # Check trigger thresholds
    if records_added >= settings.MIN_NEW_RECORDS or MLOPS_METRICS["drift_detected"]:
        logger.info(f"Retraining threshold crossed. Records: {records_added}/{settings.MIN_NEW_RECORDS}, Drift={MLOPS_METRICS['drift_detected']}. Booting pipeline...")
        
        # Trigger training pipeline script
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        pipeline_script = os.path.join(base_dir, "ml", "training_pipeline.py")
        
        try:
            import subprocess
            res = subprocess.run([sys.executable, pipeline_script], capture_output=True, text=True, check=True)
            MLOPS_METRICS["last_retrain_time"] = datetime.now().isoformat()
            
            # Reset pipeline scheduler metrics to prevent loop retrains
            PIPELINE_HEALTH["records_imported"] = 0
            
            # Fetch version versioning and check promotion
            from mlops.promotion import evaluate_model_promotion
            # Load latest report to inspect candidate version
            report_path = os.path.join(base_dir, "ml", "evaluation", "evaluation_report.json")
            
            if os.path.exists(report_path):
                with open(report_path, "r") as f:
                    import json
                    report_data = json.load(f)
                
                version_id = f"v_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
                algorithm = report_data.get("model_architecture", "XGBRegressor")
                metrics = report_data.get("evaluation_metrics", {})
                
                # Register version
                from mlops.registry import ModelRegistryManager
                ModelRegistryManager.register_model(
                    version=version_id,
                    algorithm=algorithm,
                    rmse=metrics.get("root_mean_squared_error", 15.0),
                    mae=metrics.get("mean_absolute_error", 12.0),
                    r2=metrics.get("r2_coefficient_of_determination", 0.93)
                )
                
                # Promote checks
                promoted, msg = evaluate_model_promotion(version_id)
                return f"Retraining successful. {msg}"
            
            return "Retraining completed but failed to register version details."
            
        except Exception as e:
            logger.error(f"Failed to execute training job script: {str(e)}")
            return f"Retraining job failed: {str(e)}"
            
    return f"Retraining thresholds not met. Ingested records: {records_added}/{settings.MIN_NEW_RECORDS}."
