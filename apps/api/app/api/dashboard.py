from fastapi import APIRouter, Query
from typing import Optional, List, Dict, Any
from app.services.providers.weather_provider import WeatherProvider
from app.services.providers.aqi_provider import AQIProvider
from app.services.providers.city_data_provider import CityDataProvider
from app.services.health_service import HealthService

router = APIRouter()

async def compile_dashboard_data(city: str) -> Dict[str, Any]:
    weather = await WeatherProvider(city).fetch_data()
    aqi = await AQIProvider(city).fetch_data()
    city_data = await CityDataProvider(city).fetch_data()
    risk = HealthService.classify_risk(aqi["aqi"])
    
    # Calculate health score dynamically (inverted AQI scale score)
    health_score = max(5, min(100, int(100 - (aqi["aqi"] * 0.25))))
    
    # Dynamic summary text
    ai_summary = (
        f"Air quality in {city} is currently {risk['risk_level']}. "
        f"The primary driver is {city_data['dominant_source'].lower()} with a traffic density index of {city_data['traffic_density_index']:.0f}%. "
        f"We suggest prioritizing inspect dispatch towards construction zones (index: {city_data['active_construction_index']:.0f}%)."
    )
    
    # Create alerts dynamically based on actual conditions
    alerts = []
    if aqi["aqi"] > 200:
        alerts.append({
            "id": "a1",
            "severity": "critical",
            "category": "High PM Concentration",
            "time": "Just Now",
            "location": f"{city} Central Zone",
            "status": "Active"
        })
    if city_data["traffic_density_index"] > 75:
        alerts.append({
            "id": "a2",
            "severity": "high",
            "category": "Traffic Congestion",
            "time": "15 Mins Ago",
            "location": f"{city} Main Corridor",
            "status": "Investigating"
        })
        
    # Recommendations
    recs = [
        {
            "id": "r1",
            "action": f"Restrict heavy trucks in {city} central corridor due to high traffic density.",
            "impact": "15-20 AQI Reduction",
            "confidence": 88,
            "priority": "High" if aqi["aqi"] > 150 else "Medium"
        },
        {
            "id": "r2",
            "action": f"Pause unmitigated excavation at construction sites (active index: {city_data['active_construction_index']:.0f}%)",
            "impact": "10-12 AQI Reduction",
            "confidence": 92,
            "priority": "High" if city_data["active_construction_index"] > 70 else "Medium"
        }
    ]
    
    return {
        "summary": {
            "city": city,
            "health_score": health_score,
            "ai_summary": ai_summary,
            "dominant_pollutant": "PM2.5" if aqi["aqi"] > 100 else "PM10",
            "aqi_category": risk["risk_level"],
            "confidence_score": risk["confidence_score"]
        },
        "stats": {
            "current_aqi": aqi["aqi"],
            "forecast_aqi": int(aqi["aqi"] * 1.15),
            "high_risk_zones": 3 if aqi["aqi"] > 150 else 1,
            "critical_hotspots": 2 if aqi["aqi"] > 200 else 1,
            "population_at_risk": int(city_data["population"] * (risk["affected_population_pct"] / 100.0)),
            "inspection_priority": "Critical" if aqi["aqi"] > 300 else "High" if aqi["aqi"] > 150 else "Medium",
            "citizen_alerts": len(alerts),
            "pollution_trend": "+12%" if weather["wind_speed"] < 10 else "-8%",
            "improvement_pct": "+5.4%" if weather["precipitation"] > 5 else "-2.1%",
            "prediction_confidence": f"{risk['confidence_score']}%"
        },
        "weather": {
            "temp": weather["temperature"],
            "humidity": weather["humidity"],
            "wind_speed": weather["wind_speed"],
            "visibility": max(2.0, 10.0 - (aqi["aqi"] * 0.02)),
            "pressure": 1008
        },
        "alerts": alerts,
        "recommendations": recs,
        "activity": [
            {
                "time": "Just Now",
                "title": "AQI Updated",
                "desc": f"Air quality index reported at {aqi['aqi']} dynamically from local monitoring stations."
            },
            {
                "time": "1 Hour Ago",
                "title": "Inspection Recommended",
                "desc": f"Primary target set to local {city_data['dominant_source'].lower()} sites."
            }
        ]
    }

@router.get("/summary")
async def get_dashboard_summary(city: Optional[str] = Query("Delhi")):
    data = await compile_dashboard_data(city)
    return {
        "success": True,
        "message": "Dashboard summary retrieved successfully",
        "data": data["summary"]
    }

@router.get("/stats")
async def get_dashboard_stats(city: Optional[str] = Query("Delhi")):
    data = await compile_dashboard_data(city)
    return {
        "success": True,
        "message": "Dashboard statistics retrieved successfully",
        "data": data["stats"]
    }

@router.get("/activity")
async def get_dashboard_activity(city: Optional[str] = Query("Delhi")):
    data = await compile_dashboard_data(city)
    return {
        "success": True,
        "message": "Dashboard activity timeline retrieved successfully",
        "data": data["activity"]
    }

@router.get("/alerts")
async def get_dashboard_alerts(city: Optional[str] = Query("Delhi")):
    data = await compile_dashboard_data(city)
    return {
        "success": True,
        "message": "Dashboard alerts retrieved successfully",
        "data": data["alerts"]
    }

@router.get("/recommendations")
async def get_dashboard_recommendations(city: Optional[str] = Query("Delhi")):
    data = await compile_dashboard_data(city)
    return {
        "success": True,
        "message": "Dashboard recommendations retrieved successfully",
        "data": data["recommendations"]
    }

@router.get("/weather")
async def get_dashboard_weather(city: Optional[str] = Query("Delhi")):
    data = await compile_dashboard_data(city)
    return {
        "success": True,
        "message": "Dashboard weather retrieved successfully",
        "data": data["weather"]
    }

@router.get("/health")
async def get_dashboard_health(city: Optional[str] = Query("Delhi")):
    data = await compile_dashboard_data(city)
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
async def get_full_dashboard(city: Optional[str] = Query("Delhi")):
    data = await compile_dashboard_data(city)
    return {
        "success": True,
        "message": "Full dashboard payload retrieved successfully",
        "data": data
    }
