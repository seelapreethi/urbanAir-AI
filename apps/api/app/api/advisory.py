from fastapi import APIRouter, Query
from typing import List, Dict, Any
from app.services.health_service import HealthService
from app.services.providers.weather_provider import WeatherProvider
from app.services.providers.aqi_provider import AQIProvider

router = APIRouter()

async def get_city_health_features(city: str) -> Dict[str, Any]:
    weather_data = await WeatherProvider(city).fetch_data()
    aqi_data = await AQIProvider(city).fetch_data()
    return {
        "aqi": aqi_data["aqi"],
        "pm2_5": aqi_data["pm2_5"],
        "pm10": aqi_data["pm10"],
        "temp": weather_data["temperature"],
        "humidity": weather_data["humidity"],
        "wind": weather_data["wind_speed"]
    }

@router.get("", tags=["advisory"])
async def get_health_advisory_summary(city: str = Query("Delhi"), user_group: str = Query("General Public")):
    feat = await get_city_health_features(city)
    risk = HealthService.classify_risk(feat["aqi"])
    advisory = HealthService.get_dynamic_advisory(
        user_group, feat["aqi"], feat["pm2_5"], feat["pm10"], feat["temp"], feat["humidity"], feat["wind"]
    )
    
    return {
        "city": city,
        "current_aqi": feat["aqi"],
        "risk_classification": risk,
        "advisory": advisory,
        "dominant_pollutant": "PM2.5" if feat["aqi"] > 100 else "PM10",
        "emergency_active": feat["aqi"] > 300
    }

@router.get("/risk", tags=["advisory"])
async def get_health_risk_breakdown(city: str = Query("Delhi")):
    feat = await get_city_health_features(city)
    risk = HealthService.classify_risk(feat["aqi"])
    
    return {
        "aqi": feat["aqi"],
        "risk_level": risk["risk_level"],
        "affected_population_pct": risk["affected_population_pct"],
        "confidence_score": risk["confidence_score"],
        "population_demographics": [
            {"group": "Senior Citizens", "risk": "High" if feat["aqi"] > 200 else "Moderate" if feat["aqi"] > 100 else "Low"},
            {"group": "Children", "risk": "High" if feat["aqi"] > 200 else "Moderate" if feat["aqi"] > 100 else "Low"},
            {"group": "Asthma Patients", "risk": "Critical" if feat["aqi"] > 200 else "High" if feat["aqi"] > 100 else "Moderate"},
            {"group": "Outdoor Workers", "risk": "Critical" if feat["aqi"] > 300 else "High" if feat["aqi"] > 200 else "Moderate"}
        ]
    }

@router.get("/notifications", tags=["advisory"])
async def get_health_notifications(city: str = Query("Delhi")):
    feat = await get_city_health_features(city)
    aqi = feat["aqi"]
    alerts = []
    
    if aqi > 300:
        alerts.append({
            "id": "n1",
            "alert_title": "Severe Stagnation Alert",
            "alert_content": f"Extremely high particulate levels registered (AQI: {aqi}). Senior citizens and children must remain indoors.",
            "severity": "Critical",
            "created_at": "5 mins ago"
        })
    elif aqi > 200:
        alerts.append({
            "id": "n1",
            "alert_title": "Poor Air Quality Alert",
            "alert_content": f"AQI has crossed very poor threshold (AQI: {aqi}). Please restrict outdoor exertion.",
            "severity": "High",
            "created_at": "10 mins ago"
        })
    elif aqi > 100:
        alerts.append({
            "id": "n2",
            "alert_title": "Moderate Particulate warning",
            "alert_content": f"AQI levels (AQI: {aqi}) have exceeded safe limits. Sensitive groups should wear N95 masks outdoors.",
            "severity": "Medium",
            "created_at": "12 mins ago"
        })
        
    alerts.append({
        "id": "n3",
        "alert_title": "Mist Cannon Dispatches",
        "alert_content": "Automated mist sprinklers deployed along high-traffic routes.",
        "severity": "Low",
        "created_at": "1 hour ago"
    })
    
    return alerts
