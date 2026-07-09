from fastapi import APIRouter, Query
from typing import List, Dict, Any
from app.services.attribution_service import AttributionService

router = APIRouter()

# City coordinate bases
CITY_COORDS: Dict[str, Dict[str, Any]] = {
    "Vijayawada": {"lat": 16.5062, "lng": 80.6480, "traffic": 1.35, "wind_dir": 45, "wind_speed": 12.0},
    "Hyderabad": {"lat": 17.3850, "lng": 78.4867, "traffic": 1.62, "wind_dir": 120, "wind_speed": 14.0},
    "Bengaluru": {"lat": 12.9716, "lng": 77.5946, "traffic": 1.75, "wind_dir": 240, "wind_speed": 18.0},
    "Chennai": {"lat": 13.0827, "lng": 80.2707, "traffic": 1.45, "wind_dir": 90, "wind_speed": 15.0},
    "Delhi": {"lat": 28.6139, "lng": 77.2090, "traffic": 1.90, "wind_dir": 315, "wind_speed": 8.0}
}

@router.get("", tags=["source-attribution"])
def get_source_attribution_summary(city: str = Query("Vijayawada")):
    coords = CITY_COORDS.get(city, CITY_COORDS["Vijayawada"])
    result = AttributionService.calculate_attribution(
        city, coords["lat"], coords["lng"], coords["wind_dir"], coords["wind_speed"], coords["traffic"]
    )
    return result

@router.get("/map", tags=["source-attribution"])
def get_source_attribution_map(city: str = Query("Vijayawada")):
    # Returns point source list with active overlay markers
    coords = CITY_COORDS.get(city, CITY_COORDS["Vijayawada"])
    lat, lng = coords["lat"], coords["lng"]
    
    return [
        {
            "id": "src-1",
            "name": "Benz Circle Heavy Intersection",
            "type": "Traffic",
            "latitude": lat + 0.0003,
            "longitude": lng + 0.006,
            "intensity": 0.85,
            "influence_radius": 600,
            "confidence": 91.2
        },
        {
            "id": "src-2",
            "name": "Patamata Foundry Zone",
            "type": "Industry",
            "latitude": lat - 0.011,
            "longitude": lng + 0.017,
            "intensity": 0.92,
            "influence_radius": 1200,
            "confidence": 88.4
        },
        {
            "id": "src-3",
            "name": "One Town Metro Construction Stage 3",
            "type": "Construction Sites",
            "latitude": lat + 0.015,
            "longitude": lng - 0.043,
            "intensity": 0.78,
            "influence_radius": 800,
            "confidence": 85.0
        },
        {
            "id": "src-4",
            "name": "Municipal Garbage Landfill Dump",
            "type": "Waste Burning",
            "latitude": lat - 0.024,
            "longitude": lng - 0.012,
            "intensity": 0.65,
            "influence_radius": 1000,
            "confidence": 78.5
        }
    ]

@router.get("/details", tags=["source-attribution"])
def get_source_attribution_details(city: str = Query("Vijayawada"), source_id: str = Query("src-1")):
    coords = CITY_COORDS.get(city, CITY_COORDS["Vijayawada"])
    lat, lng = coords["lat"], coords["lng"]
    
    # Mock profiles by source ID
    profiles = {
        "src-1": {
            "id": "src-1",
            "name": "Benz Circle Heavy Intersection",
            "type": "Traffic",
            "contribution_pct": 42.0,
            "confidence_score": 91.2,
            "supporting_evidence": "Traffic Index is 35% higher than standard city baseline. Multi-lane congestion peaks match hourly PM2.5 concentrations.",
            "weather_impact": "Stagnant winds under 8 km/h prevent vehicle exhaust dispersion, concentrating emission plumes.",
            "historical_trend": "Consistently accounts for 40%+ of localized pollution during morning and evening rush hour schedules.",
            "suggested_action": "Implement heavy-duty vehicle detours and schedule mist cannons deployment."
        },
        "src-2": {
            "id": "src-2",
            "name": "Patamata Foundry Zone",
            "type": "Industries",
            "contribution_pct": 27.5,
            "confidence_score": 88.4,
            "supporting_evidence": "Spatially correlated with elevated SO2 and PM10 metrics. Upwind dispersion vector aligns with receptor sensors.",
            "weather_impact": "Monsoon wind patterns carry factory stack plumes south-eastward across residential buffers.",
            "historical_trend": "Slight reduction following boiler stack upgrades, but remains a major baseline emitter.",
            "suggested_action": "Audit particulate filter compliance and issue corrective action notifications."
        }
    }
    
    return profiles.get(source_id, profiles["src-1"])

@router.get("/contributors", tags=["source-attribution"])
def get_source_contributors(city: str = Query("Vijayawada")):
    coords = CITY_COORDS.get(city, CITY_COORDS["Vijayawada"])
    res = AttributionService.calculate_attribution(
        city, coords["lat"], coords["lng"], coords["wind_dir"], coords["wind_speed"], coords["traffic"]
    )
    # Formulate contributors arrays for charts
    return [
        {"source": name, "percentage": pct} 
        for name, pct in res["contributions"].items()
    ]
