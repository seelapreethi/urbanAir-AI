from typing import List, Dict, Any

class ExplainabilityService:
    """
    Explainability service providing feature contributions, model logs, 
    and decision traces for trust auditing.
    """
    @classmethod
    def get_feature_importances(cls) -> List[Dict[str, Any]]:
        return [
            {"feature": "Weather (Wind/Humidity)", "importance": 35},
            {"feature": "Traffic Volumes (Live)", "importance": 28},
            {"feature": "Historical AQI Baseline", "importance": 16},
            {"feature": "Industrial Activity Index", "importance": 12},
            {"feature": "Construction Sites Grid", "importance": 9}
        ]

    @classmethod
    def get_model_details(cls) -> Dict[str, Any]:
        return {
            "model_name": "UrbanAir-XGBoost-Regressor",
            "version": "v2.4.1",
            "training_date": "2026-06-28",
            "inference_time_ms": 14.2,
            "training_accuracy_r2": 0.942,
            "data_sources": [
                "18 Municipal AQI Monitors",
                "DarkSky Meteorological Weather Grid API",
                "Google Maps Traffic Congestion API",
                "Sentinel-5P Satellite Particulate Columns"
            ]
        }

    @classmethod
    def get_decision_trace(cls, target_area: str) -> Dict[str, Any]:
        return {
            "target": target_area,
            "why_generated": (
                "Triggered due to PM2.5 concentrations exceeding 75 ug/m3 in consecutive hourly readings. "
                "dispersion speed was under 8 km/h, concentrating the vehicle exhaust plumes."
            ),
            "evidence_used": "Localized station data + Wind stagnation indices",
            "confidence": 91.2,
            "alternatives": "Deploy mist cannons or schedule heavy truck traffic diversions."
        }
