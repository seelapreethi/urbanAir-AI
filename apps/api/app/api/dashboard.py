from fastapi import APIRouter, Query
from typing import Optional, List, Dict, Any

router = APIRouter()

# Mock data mapping for different cities to support dynamic global switching
MOCK_DASHBOARD_DATA: Dict[str, Dict[str, Any]] = {
    "Vijayawada": {
        "summary": {
            "city": "Vijayawada",
            "health_score": 78,
            "ai_summary": "Air quality is expected to deteriorate between 2 PM and 6 PM due to increased traffic and low wind speed. Consider restricting heavy vehicle movement in Ward 8.",
            "dominant_pollutant": "PM2.5",
            "aqi_category": "Moderate",
            "confidence_score": 91
        },
        "stats": {
            "current_aqi": 142,
            "forecast_aqi": 165,
            "high_risk_zones": 3,
            "critical_hotspots": 1,
            "population_at_risk": 45000,
            "inspection_priority": "High",
            "citizen_alerts": 2,
            "pollution_trend": "+12%",
            "improvement_pct": "+5.4%",
            "prediction_confidence": "91%"
        },
        "weather": {
            "temp": 32.5,
            "humidity": 68,
            "wind_speed": 12.4,
            "visibility": 8.0,
            "pressure": 1008
        },
        "alerts": [
            {
                "id": "a1",
                "severity": "high",
                "category": "Industrial Emission",
                "time": "10:30 AM",
                "location": "Kondapalli Industrial Area",
                "status": "Active"
            },
            {
                "id": "a2",
                "severity": "medium",
                "category": "Traffic Congestion",
                "time": "12:15 PM",
                "location": "Benz Circle Crossing",
                "status": "Investigating"
            }
        ],
        "recommendations": [
            {
                "id": "r1",
                "action": "Restrict heavy trucks routing in Benz Circle corridor",
                "impact": "15-20 AQI Reduction",
                "confidence": 88,
                "priority": "High"
            },
            {
                "id": "r2",
                "action": "Initiate automated water mist spraying at Kondapalli construction grid",
                "impact": "10-12 AQI Reduction",
                "confidence": 92,
                "priority": "Medium"
            }
        ],
        "activity": [
            {
                "time": "10 Mins Ago",
                "title": "AQI Updated",
                "desc": "Station sensor KV-04 reported PM2.5 rise to 142."
            },
            {
                "time": "1 Hour Ago",
                "title": "Inspection Recommended",
                "desc": "AI flagged industrial zone abnormal emissions alert."
            },
            {
                "time": "3 Hours Ago",
                "title": "Forecast Pipeline Complete",
                "desc": "72-hour air quality predictive grid recalculation finished."
            }
        ]
    },
    "Hyderabad": {
        "summary": {
            "city": "Hyderabad",
            "health_score": 62,
            "ai_summary": "Dust suspension from major infrastructure projects is driving PM10 elevation. Consider enforcing water mist spraying in central corridors.",
            "dominant_pollutant": "PM10",
            "aqi_category": "Unhealthy",
            "confidence_score": 88
        },
        "stats": {
            "current_aqi": 188,
            "forecast_aqi": 210,
            "high_risk_zones": 6,
            "critical_hotspots": 3,
            "population_at_risk": 120000,
            "inspection_priority": "Critical",
            "citizen_alerts": 5,
            "pollution_trend": "+18%",
            "improvement_pct": "-2.1%",
            "prediction_confidence": "88%"
        },
        "weather": {
            "temp": 34.0,
            "humidity": 55,
            "wind_speed": 9.2,
            "visibility": 6.5,
            "pressure": 1010
        },
        "alerts": [
            {
                "id": "h1",
                "severity": "critical",
                "category": "Particulate Spike",
                "time": "09:00 AM",
                "location": "Gachibowli Construction Ring",
                "status": "Active"
            },
            {
                "id": "h2",
                "severity": "high",
                "category": "Biomass Burning",
                "time": "11:40 AM",
                "location": "Patancheru Ward 4 Outer Belt",
                "status": "Dispatched"
            }
        ],
        "recommendations": [
            {
                "id": "hr1",
                "action": "Halt brick kiln operations inPatancheru sector",
                "impact": "25-30 AQI Reduction",
                "confidence": 85,
                "priority": "Critical"
            },
            {
                "id": "hr2",
                "action": "Enforce odd-even transport lanes in Hitec City during peak commute",
                "impact": "15 AQI Reduction",
                "confidence": 80,
                "priority": "High"
            }
        ],
        "activity": [
            {
                "time": "5 Mins Ago",
                "title": "Citizen Alert Issued",
                "desc": "Air quality advisory push sent to Gachibowli sector."
            },
            {
                "time": "40 Mins Ago",
                "title": "AQI Updated",
                "desc": "Sensor Patancheru-03 recorded AQI levels of 192."
            }
        ]
    }
}

def get_city_data(city: str) -> Dict[str, Any]:
    # Fallback to Vijayawada default if city not found
    normalized_city = "Vijayawada"
    if city and city.strip().lower() == "hyderabad":
        normalized_city = "Hyderabad"
    return MOCK_DASHBOARD_DATA[normalized_city]

@router.get("/summary")
async def get_dashboard_summary(city: Optional[str] = Query(None)):
    data = get_city_data(city)
    return {
        "success": True,
        "message": "Dashboard summary retrieved successfully",
        "data": data["summary"]
    }

@router.get("/stats")
async def get_dashboard_stats(city: Optional[str] = Query(None)):
    data = get_city_data(city)
    return {
        "success": True,
        "message": "Dashboard statistics retrieved successfully",
        "data": data["stats"]
    }

@router.get("/activity")
async def get_dashboard_activity(city: Optional[str] = Query(None)):
    data = get_city_data(city)
    return {
        "success": True,
        "message": "Dashboard activity timeline retrieved successfully",
        "data": data["activity"]
    }

@router.get("/alerts")
async def get_dashboard_alerts(city: Optional[str] = Query(None)):
    data = get_city_data(city)
    return {
        "success": True,
        "message": "Dashboard alerts retrieved successfully",
        "data": data["alerts"]
    }

@router.get("/recommendations")
async def get_dashboard_recommendations(city: Optional[str] = Query(None)):
    data = get_city_data(city)
    return {
        "success": True,
        "message": "Dashboard recommendations retrieved successfully",
        "data": data["recommendations"]
    }

@router.get("/weather")
async def get_dashboard_weather(city: Optional[str] = Query(None)):
    data = get_city_data(city)
    return {
        "success": True,
        "message": "Dashboard weather retrieved successfully",
        "data": data["weather"]
    }

@router.get("/health")
async def get_dashboard_health(city: Optional[str] = Query(None)):
    data = get_city_data(city)
    return {
        "success": True,
        "message": "Dashboard health score retrieved successfully",
        "data": {
            "health_score": data["summary"]["health_score"],
            "dominant_pollutant": data["summary"]["dominant_pollutant"],
            "aqi_category": data["summary"]["aqi_category"]
        }
    }

@router.get("")
async def get_full_dashboard(city: Optional[str] = Query(None)):
    data = get_city_data(city)
    return {
        "success": True,
        "message": "Full dashboard payload retrieved successfully",
        "data": data
    }
