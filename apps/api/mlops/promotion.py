import logging
from typing import Dict, Any, Tuple
from mlops.registry import ModelRegistryManager

logger = logging.getLogger(__name__)

def evaluate_model_promotion(new_model_version: str) -> Tuple[bool, str]:
    """Compares candidate model against production. Promotes if RMSE and MAE are improved."""
    history = ModelRegistryManager.get_history()
    
    candidate = None
    for item in history:
        if item["version"] == new_model_version:
            candidate = item
            break
            
    if not candidate:
        return False, f"Candidate model {new_model_version} not found in registry."
        
    current_prod = ModelRegistryManager.get_production_version_details()
    
    # If no active model exists, automatically promote as baseline
    if not current_prod:
        ModelRegistryManager.set_production(new_model_version)
        return True, "No prior model in production. Promoted as baseline model."
        
    c_metrics = candidate["metrics"]
    p_metrics = current_prod["metrics"]
    
    improved_rmse = c_metrics["rmse"] < p_metrics["rmse"]
    improved_mae = c_metrics["mae"] < p_metrics["mae"]
    
    if improved_rmse and improved_mae:
        # Promote the model!
        ModelRegistryManager.set_production(new_model_version)
        msg = (
            f"Successfully promoted model {new_model_version}. "
            f"RMSE: {p_metrics['rmse']} -> {c_metrics['rmse']}. "
            f"MAE: {p_metrics['mae']} -> {c_metrics['mae']}."
        )
        logger.info(msg)
        return True, msg
    else:
        msg = (
            f"Promotion rejected for {new_model_version}. Metrics did not surpass production. "
            f"Candidate: RMSE={c_metrics['rmse']}, MAE={c_metrics['mae']}. "
            f"Production: RMSE={p_metrics['rmse']}, MAE={p_metrics['mae']}."
        )
        logger.warning(msg)
        return False, msg
