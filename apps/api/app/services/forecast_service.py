import sys
import os
from abc import ABC, abstractmethod
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)

# Safe imports for the ML module
try:
    from ml.model_loader import MLModelLoader
    from ml.predict import predict_aqi
except ImportError:
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    if base_dir not in sys.path:
        sys.path.insert(0, base_dir)
    from ml.model_loader import MLModelLoader
    from ml.predict import predict_aqi

class PredictionEngineInterface(ABC):
    @abstractmethod
    def predict(self, features: Dict[str, Any]) -> Dict[str, Any]:
        pass

class ProphetForecastModel(PredictionEngineInterface):
    def predict(self, features: Dict[str, Any]) -> Dict[str, Any]:
        base_aqi = features.get("current_aqi", 120)
        traffic_idx = features.get("traffic_index", 1.0)
        wind = features.get("wind_speed", 10.0)
        time_offset = features.get("time_offset", 24)

        trend = base_aqi * 1.02
        traffic_additive = (traffic_idx - 1.0) * 25.0
        dispersion = -1.5 * wind
        seasonality = 10.0 if features.get("season") == "winter" else -5.0

        # Further off in time reduces confidence and slightly scales the output regressively to mean
        predicted_aqi = max(20, int(trend + traffic_additive + dispersion + seasonality))
        predicted_aqi = int(predicted_aqi * (1 - (time_offset * 0.001)))

        confidence = round(88.0 + (wind * 0.1) - (time_offset * 0.1), 1)

        return {
            "predicted_aqi": predicted_aqi,
            "dominant_pollutant": "PM2.5" if predicted_aqi > 100 else "PM10",
            "confidence_score": max(50.0, min(99.9, confidence)),
            "model_used": "Prophet Seasonal",
            "features_importance": {
                "historical_trend": 0.45,
                "wind_dispersion": 0.25,
                "traffic_emissions": 0.20,
                "temperature": 0.10
            }
        }

class XGBoostForecastModel(PredictionEngineInterface):
    def predict(self, features: Dict[str, Any]) -> Dict[str, Any]:
        base_aqi = features.get("current_aqi", 120)
        traffic_idx = features.get("traffic_index", 1.0)
        humidity = features.get("humidity", 60.0)
        wind = features.get("wind_speed", 10.0)
        time_offset = features.get("time_offset", 24)

        factor = 1.0
        if traffic_idx > 1.4:
            factor *= 1.15
        if wind < 6.0:
            factor *= 1.2
        else:
            factor *= 0.85
        
        humidity_factor = 1.05 if humidity > 75.0 else 0.95
        
        predicted_aqi = max(20, int(base_aqi * factor * humidity_factor))
        predicted_aqi = int(predicted_aqi * (1 + (time_offset * 0.002)))

        confidence = round(91.5 - (time_offset * 0.15) + (humidity * 0.05), 1)

        return {
            "predicted_aqi": predicted_aqi,
            "dominant_pollutant": "PM2.5" if predicted_aqi > 120 else "PM10",
            "confidence_score": max(50.0, min(99.9, confidence)),
            "model_used": "XGBoost Regressor",
            "features_importance": {
                "traffic_index": 0.38,
                "wind_speed": 0.32,
                "humidity": 0.18,
                "historical_aqi": 0.12
            }
        }

class RandomForestForecastModel(PredictionEngineInterface):
    def predict(self, features: Dict[str, Any]) -> Dict[str, Any]:
        base_aqi = features.get("current_aqi", 120)
        traffic_idx = features.get("traffic_index", 1.0)
        wind = features.get("wind_speed", 10.0)
        time_offset = features.get("time_offset", 24)

        pred_aqi = base_aqi
        if traffic_idx > 1.2:
            pred_aqi += 18
        if wind > 12.0:
            pred_aqi -= 20
        else:
            pred_aqi += 5

        predicted_aqi = max(20, int(pred_aqi))
        predicted_aqi = int(predicted_aqi * (1 + (time_offset * 0.0015)))

        confidence = round(85.4 - (time_offset * 0.2) + (traffic_idx * 2), 1)

        return {
            "predicted_aqi": predicted_aqi,
            "dominant_pollutant": "PM2.5",
            "confidence_score": max(50.0, min(99.9, confidence)),
            "model_used": "RandomForest Ensemble",
            "features_importance": {
                "historical_aqi": 0.50,
                "wind_speed": 0.25,
                "traffic_index": 0.20,
                "meteorological_other": 0.05
            }
        }

class ModelLoader:
    _models: Dict[str, PredictionEngineInterface] = {
        "prophet": ProphetForecastModel(),
        "xgboost": XGBoostForecastModel(),
        "random_forest": RandomForestForecastModel()
    }

    @classmethod
    def get_model(cls, model_name: str) -> PredictionEngineInterface:
        name = model_name.lower().strip()
        if name in cls._models:
            return cls._models[name]
        logger.warning(f"Forecasting model {model_name} not found. Defaulting to XGBoost.")
        return cls._models["xgboost"]

class InferenceService:
    @classmethod
    def run_prediction(
        cls,
        city_name: str,
        current_aqi: int,
        temp: float,
        humidity: float,
        wind_speed: float,
        traffic_index: float,
        model_name: str = "xgboost",
        time_offset_hours: int = 24
    ) -> Dict[str, Any]:
        
        import time
        t0 = time.time()

        # Load real model payload if configuration is active
        payload = None
        try:
            payload = MLModelLoader.get_model_payload()
        except Exception as e:
            logger.warning(f"Failed to fetch model payload: {str(e)}. Running in Demo Mode.")
            
        # Execute prediction
        prediction = predict_aqi(
            model_payload=payload,
            city_name=city_name,
            current_aqi=current_aqi,
            temp=temp,
            humidity=humidity,
            wind_speed=wind_speed,
            traffic_index=traffic_index,
            time_offset_hours=time_offset_hours
        )
        
        # Log latency
        try:
            from mlops.monitoring import record_prediction_latency
            duration_ms = int((time.time() - t0) * 1000)
            record_prediction_latency(duration_ms)
        except Exception as e:
            pass
        
        aqi = prediction["predicted_aqi"]
        if aqi <= 50:
            risk = "Low"
        elif aqi <= 100:
            risk = "Moderate"
        elif aqi <= 200:
            risk = "High"
        else:
            risk = "Critical"

        prediction["risk_category"] = risk
        prediction["time_offset_hours"] = time_offset_hours
        prediction["city"] = city_name

        return prediction
