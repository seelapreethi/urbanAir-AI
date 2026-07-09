from fastapi import APIRouter, Query
from typing import List, Dict, Any
from app.services.health_service import HealthService

router = APIRouter()

# City AQI parameters
CITY_AQIS = {
    "Vijayawada": 142,
    "Hyderabad": 195,
    "Bengaluru": 85,
    "Chennai": 110,
    "Delhi": 280
}

@router.get("", tags=["advisory"])
def get_health_advisory_summary(city: str = Query("Vijayawada"), user_group: str = Query("General Public")):
    aqi = CITY_AQIS.get(city, CITY_AQIS["Vijayawada"])
    risk = HealthService.classify_risk(aqi)
    advisory = HealthService.get_group_advisory(user_group, risk["risk_level"])
    
    return {
        "city": city,
        "current_aqi": aqi,
        "risk_classification": risk,
        "advisory": advisory,
        "dominant_pollutant": "PM2.5" if aqi > 100 else "PM10",
        "emergency_active": aqi > 250
    }

@router.get("/risk", tags=["advisory"])
def get_health_risk_breakdown(city: str = Query("Vijayawada")):
    aqi = CITY_AQIS.get(city, CITY_AQIS["Vijayawada"])
    
    # Classify overall risk
    risk = HealthService.classify_risk(aqi)
    
    # Formulate demographic distributions (affected populations percentages)
    return {
        "aqi": aqi,
        "risk_level": risk["risk_level"],
        "affected_population_pct": risk["affected_population_pct"],
        "confidence_score": risk["confidence_score"],
        "population_demographics": [
            {"group": "Senior Citizens", "risk": "High" if aqi > 150 else "Moderate"},
            {"group": "Children", "risk": "High" if aqi > 150 else "Moderate"},
            {"group": "Asthma Patients", "risk": "Critical" if aqi > 150 else "High"},
            {"group": "Outdoor Workers", "risk": "Critical" if aqi > 200 else "High"}
        ]
    }

@router.get("/notifications", tags=["advisory"])
def get_health_notifications(city: str = Query("Vijayawada")):
    aqi = CITY_AQIS.get(city, CITY_AQIS["Vijayawada"])
    alerts = []
    
    if aqi > 200:
        alerts.append({
            "id": "n1",
            "alert_title": "Severe Stagnation Alert",
            "alert_content": "Extremely high PM2.5 levels registered. Senior citizens and children must remain indoors.",
            "severity": "High",
            "created_at": "5 mins ago"
        })
    elif aqi > 100:
        alerts.append({
            "id": "n2",
            "alert_title": "Moderate Particulate warning",
            "alert_content": "AQI levels have exceeded safe limits. Sensitive groups should wear N95 protective masks outdoors.",
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
