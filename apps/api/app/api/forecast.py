from fastapi import APIRouter, Query
from typing import List, Dict, Any
from datetime import datetime, timedelta
from app.services.forecast_service import InferenceService
import random
router = APIRouter()

# Base parameters mapping for cities
CITY_BASES: Dict[str, Dict[str, Any]] = {
    "Vijayawada": {"aqi": 142, "temp": 32.5, "humidity": 68, "wind": 12.4, "traffic": 1.35},
    "Hyderabad": {"aqi": 195, "temp": 29.4, "humidity": 72, "wind": 14.8, "traffic": 1.62},
    "Bengaluru": {"aqi": 85, "temp": 24.2, "humidity": 60, "wind": 18.2, "traffic": 1.75},
    "Chennai": {"aqi": 110, "temp": 31.0, "humidity": 78, "wind": 15.0, "traffic": 1.45},
    "Delhi": {"aqi": 280, "temp": 34.5, "humidity": 55, "wind": 8.0, "traffic": 1.90}
}

@router.get("", tags=["forecast"])
def get_forecast_summary(city: str = Query("Vijayawada"), model: str = Query("xgboost")):
    base = CITY_BASES.get(city, CITY_BASES["Vijayawada"])
    
    # Generate predictions for 24h, 48h, and 72h
    pred_24 = InferenceService.run_prediction(city, base["aqi"], base["temp"], base["humidity"], base["wind"], base["traffic"], model, 24)
    pred_48 = InferenceService.run_prediction(city, base["aqi"], base["temp"] + 1, base["humidity"] - 2, base["wind"] - 2, base["traffic"] + 0.1, model, 48)
    pred_72 = InferenceService.run_prediction(city, base["aqi"], base["temp"] + 2, base["humidity"] - 5, base["wind"] - 4, base["traffic"] + 0.2, model, 72)
    
    return {
        "city": city,
        "current_aqi": base["aqi"],
        "model_selected": pred_24["model_used"],
        "predictions": {
            "24h": {
                "aqi": pred_24["predicted_aqi"],
                "risk": pred_24["risk_category"],
                "pollutant": pred_24["dominant_pollutant"],
                "confidence": pred_24["confidence_score"],
                "interval": [max(20, pred_24["predicted_aqi"] - 15), pred_24["predicted_aqi"] + 15]
            },
            "48h": {
                "aqi": pred_48["predicted_aqi"],
                "risk": pred_48["risk_category"],
                "pollutant": pred_48["dominant_pollutant"],
                "confidence": pred_48["confidence_score"],
                "interval": [max(20, pred_48["predicted_aqi"] - 22), pred_48["predicted_aqi"] + 22]
            },
            "72h": {
                "aqi": pred_72["predicted_aqi"],
                "risk": pred_72["risk_category"],
                "pollutant": pred_72["dominant_pollutant"],
                "confidence": pred_72["confidence_score"],
                "interval": [max(20, pred_72["predicted_aqi"] - 28), pred_72["predicted_aqi"] + 28]
            }
        },
        "ai_explanation": (
            f"Air quality in {city} is expected to deteriorate from AQI {base['aqi']} to "
            f"AQI {pred_24['predicted_aqi']} over the next 24 hours. The primary driver is "
            f"increased traffic congestion (index {base['traffic']}) interacting with stagnant "
            f"wind speeds ({base['wind']} km/h). Stagnation risks will compound into "
            f"a {pred_72['risk_category']} risk rating within 72 hours."
        )
    }

@router.get("/hourly", tags=["forecast"])
def get_hourly_forecast(city: str = Query("Vijayawada"), model: str = Query("xgboost")):
    base = CITY_BASES.get(city, CITY_BASES["Vijayawada"])
    hourly = []
    
    current_time = datetime.utcnow()
    for hour in range(24):
        target_time = current_time + timedelta(hours=hour)
        # Mock factors fluctuating hourly
        traffic_wave = base["traffic"] + 0.3 * (hour % 6 == 0 or hour % 8 == 0) - 0.2 * (hour % 12 == 0)
        temp_wave = base["temp"] + 2.0 * (12 - abs(hour - 12)) / 12.0
        
        pred = InferenceService.run_prediction(city, base["aqi"], temp_wave, base["humidity"], base["wind"], traffic_wave, model, hour)
        
        # Add dynamic fluctuations to mock hourly shapes
        aqi_adj = pred["predicted_aqi"] + int(10 * (hour % 4 - 2))
        
        hourly.append({
            "timestamp": target_time.strftime("%I:00 %p"),
            "hour_index": hour,
            "predicted_aqi": max(20, aqi_adj),
            "pm25": int(aqi_adj * 0.65),
            "pm10": int(aqi_adj * 0.95),
            "no2": int(aqi_adj * 0.22),
            "so2": int(aqi_adj * 0.05),
            "co": round(aqi_adj * 0.01, 2),
            "o3": int(aqi_adj * 0.15),
        })
    return hourly

@router.get("/daily", tags=["forecast"])
def get_daily_forecast(city: str = Query("Vijayawada"), model: str = Query("xgboost")):
    base = CITY_BASES.get(city, CITY_BASES["Vijayawada"])
    daily = []
    
    current_time = datetime.utcnow()
    for day in range(7):
        target_time = current_time + timedelta(days=day)
        
        # Accumulate dispersion over days
        wind_offset = -0.5 * day
        pred = InferenceService.run_prediction(city, base["aqi"], base["temp"], base["humidity"], max(3.0, base["wind"] + wind_offset), base["traffic"], model, day * 24)
        
        daily.append({
            "date": target_time.strftime("%a %d %b"),
            "day_index": day,
            "mean_aqi": pred["predicted_aqi"],
            "min_aqi": max(20, pred["predicted_aqi"] - 12 - 2 * day),
            "max_aqi": pred["predicted_aqi"] + 15 + 2 * day,
            "dominant_pollutant": pred["dominant_pollutant"],
            "confidence_score": max(50.0, pred["confidence_score"] - day * 2.5),
            "risk_level": pred["risk_category"]
        })
    return daily

@router.get("/wards", tags=["forecast"])
def get_ward_forecasts(city: str = Query("Vijayawada"), model: str = Query("xgboost")):
    base = CITY_BASES.get(city, CITY_BASES["Vijayawada"])
    wards = []
    
    # 5 wards representing city zones
    ward_names = ["Benz Circle Crossing", "Patamata Industrial", "One Town Commercial", "Durga Temple Hills", "Gunadala Residential"]
    for idx, w_name in enumerate(ward_names):
        # Apply different weights per ward
        ward_aqi = base["aqi"] + (idx * 20 - 40)
        ward_traffic = base["traffic"] * (1.2 if idx % 2 == 0 else 0.8)
        
        pred_24 = InferenceService.run_prediction(city, ward_aqi, base["temp"], base["humidity"], base["wind"], ward_traffic, model, 24)
        pred_48 = InferenceService.run_prediction(city, ward_aqi, base["temp"], base["humidity"], base["wind"] - 1, ward_traffic, model, 48)
        pred_72 = InferenceService.run_prediction(city, ward_aqi, base["temp"], base["humidity"], base["wind"] - 2, ward_traffic, model, 72)
        
        wards.append({
            "ward_id": f"w-f-{idx}",
            "ward_name": w_name,
            "current_aqi": ward_aqi,
            "forecast_24h": pred_24["predicted_aqi"],
            "forecast_48h": pred_48["predicted_aqi"],
            "forecast_72h": pred_72["predicted_aqi"],
            "risk_level": pred_72["risk_category"],
            "confidence_score": pred_24["confidence_score"],
            "trend": "Worsening" if pred_72["predicted_aqi"] > ward_aqi else "Improving"
        })
    return wards

@router.get("/weather", tags=["forecast"])
def get_weather_forecast(city: str = Query("Vijayawada")):
    base = CITY_BASES.get(city, CITY_BASES["Vijayawada"])
    weather = []
    
    current_time = datetime.utcnow()
    for day in range(5):
        target_time = current_time + timedelta(days=day)
        # Mock weather patterns
        weather.append({
            "date": target_time.strftime("%a %d %b"),
            "temp": round(base["temp"] + random.uniform(-2, 2), 1),
            "humidity": int(base["humidity"] + random.uniform(-5, 5)),
            "wind_speed": round(base["wind"] + random.uniform(-3, 3), 1),
            "pressure": 1008 + day,
            "visibility": max(2.0, 9.0 - day * 0.8),
            "rain_probability": int(15 + day * 10) % 100
        })
    return weather

@router.get("/recommendations", tags=["forecast"])
def get_recommendations(city: str = Query("Vijayawada")):
    return [
        {
            "recommendation_id": "r1",
            "action_text": "Restrict heavy-duty transit transport routing inside high-stagnation wards between 2 PM and 7 PM.",
            "priority": "High",
            "expected_aqi_improvement": 18,
            "confidence_score": 88.5
        },
        {
            "recommendation_id": "r2",
            "action_text": "Initiate automated water mist sprinkler sprays along commercial roads and high-traffic nodes.",
            "priority": "High",
            "expected_aqi_improvement": 12,
            "confidence_score": 82.4
        },
        {
            "recommendation_id": "r3",
            "action_text": "Enforce dust barriers and pause structural construction activities inside Patamata industrial borders.",
            "priority": "Medium",
            "expected_aqi_improvement": 8,
            "confidence_score": 78.9
        },
        {
            "recommendation_id": "r4",
            "action_text": "Deploy environmental inspectors to audit emissions compliance in small-scale localized casting units.",
            "priority": "Low",
            "expected_aqi_improvement": 5,
            "confidence_score": 65.0
        }
    ]

@router.get("/confidence", tags=["forecast"])
def get_confidence_metrics(city: str = Query("Vijayawada"), model: str = Query("xgboost")):
    # Features weights matching chosen model
    pred = InferenceService.run_prediction(city, 120, 30, 60, 10, 1.2, model, 24)
    
    return {
        "model_name": pred["model_used"],
        "reliability_percentage": 94.2 if model == "xgboost" else 89.6,
        "historical_accuracy": [
            {"date": "10 Jun", "predicted": 115, "actual": 112},
            {"date": "15 Jun", "predicted": 140, "actual": 138},
            {"date": "20 Jun", "predicted": 160, "actual": 165},
            {"date": "25 Jun", "predicted": 95, "actual": 98},
            {"date": "30 Jun", "predicted": 130, "actual": 128}
        ],
        "feature_importances": [
            {"name": "Wind Dispersion (Stagnation)", "value": pred["features_importance"].get("wind_speed", 0.32)},
            {"name": "Traffic Volume Index", "value": pred["features_importance"].get("traffic_index", 0.38)},
            {"name": "Historical AQI trends", "value": pred["features_importance"].get("historical_aqi", 0.12)},
            {"name": "Local Humidity Levels", "value": pred["features_importance"].get("humidity", 0.18)}
        ]
    }
