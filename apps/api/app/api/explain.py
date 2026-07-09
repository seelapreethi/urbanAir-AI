from fastapi import APIRouter, Query
from typing import List, Dict, Any
from app.services.explainability_service import ExplainabilityService

router = APIRouter()

@router.get("", tags=["explain"])
def get_explainability_summary(area: str = Query("Vijayawada")):
    importances = ExplainabilityService.get_feature_importances()
    trace = ExplainabilityService.get_decision_trace(area)
    
    return {
        "feature_importances": importances,
        "decision_trace": trace,
        "accuracy_score_r2": 0.942,
        "last_calibration": "2 hours ago"
    }

@router.get("/model", tags=["explain"])
def get_model_health_details():
    return ExplainabilityService.get_model_details()
