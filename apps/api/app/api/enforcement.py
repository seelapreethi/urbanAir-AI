from fastapi import APIRouter, Query
from typing import List, Dict, Any
from app.services.enforcement_service import EnforcementService

router = APIRouter()

# City coordinates mapping
CITY_CENTERS: Dict[str, Dict[str, Any]] = {
    "Vijayawada": {"lat": 16.5062, "lng": 80.6480},
    "Hyderabad": {"lat": 17.3850, "lng": 78.4867},
    "Bengaluru": {"lat": 12.9716, "lng": 77.5946},
    "Chennai": {"lat": 13.0827, "lng": 80.2707},
    "Delhi": {"lat": 28.6139, "lng": 77.2090}
}

# Base hotspots to perform priorities ranking on
MOCK_BASE_HOTSPOTS: Dict[str, List[Dict[str, Any]]] = {
    "Vijayawada": [
        {"hotspot_id": "h1", "latitude": 16.5065, "longitude": 80.6540, "severity": 0.95, "estimated_source": "Traffic Congestion Exhaust", "radius": 800, "confidence_score": 89.4},
        {"hotspot_id": "h2", "latitude": 16.4950, "longitude": 80.6650, "severity": 0.82, "estimated_source": "Patamata Boiler Foundry", "radius": 1100, "confidence_score": 81.5},
        {"hotspot_id": "h3", "latitude": 16.5210, "longitude": 80.6050, "severity": 0.64, "estimated_source": "One Town Metro Excavations", "radius": 900, "confidence_score": 75.0}
    ],
    "Hyderabad": [
        {"hotspot_id": "h4", "latitude": 17.5180, "longitude": 78.4350, "severity": 0.98, "estimated_source": "Jeedimetla Boiler Factory Stack", "radius": 1400, "confidence_score": 93.8},
        {"hotspot_id": "h5", "latitude": 17.3616, "longitude": 78.4747, "severity": 0.86, "estimated_source": "Charminar Commuter Gridlock", "radius": 900, "confidence_score": 85.0},
        {"hotspot_id": "h6", "latitude": 17.4400, "longitude": 78.3480, "severity": 0.55, "estimated_source": "Gachibowli IT construction", "radius": 600, "confidence_score": 70.0}
    ]
}

@router.get("", tags=["enforcement"])
def get_enforcement_summary(city: str = Query("Vijayawada")):
    hotspots = MOCK_BASE_HOTSPOTS.get(city, MOCK_BASE_HOTSPOTS["Vijayawada"])
    ranked = EnforcementService.rank_hotspots(hotspots)
    
    critical_count = sum(1 for h in ranked if h["priority_level"] == "Critical")
    high_count = sum(1 for h in ranked if h["priority_level"] == "High")
    
    return {
        "city": city,
        "critical_hotspots_count": critical_count,
        "high_priority_hotspots_count": high_count,
        "total_active_hotspots": len(ranked),
        "priority_alerts": [
            f"Alert: Critical industrial plume dispersion identified near coordinate [{h['latitude']}, {h['longitude']}]"
            for h in ranked if h["priority_level"] == "Critical"
        ]
    }

@router.get("/hotspots", tags=["enforcement"])
def get_enforcement_hotspots(city: str = Query("Vijayawada")):
    hotspots = MOCK_BASE_HOTSPOTS.get(city, MOCK_BASE_HOTSPOTS["Vijayawada"])
    return EnforcementService.rank_hotspots(hotspots)

@router.get("/recommendations", tags=["enforcement"])
def get_enforcement_recommendations(city: str = Query("Vijayawada")):
    hotspots = MOCK_BASE_HOTSPOTS.get(city, MOCK_BASE_HOTSPOTS["Vijayawada"])
    ranked = EnforcementService.rank_hotspots(hotspots)
    return EnforcementService.generate_recommendations(ranked)

@router.get("/routes", tags=["enforcement"])
def get_enforcement_dispatch_routes(city: str = Query("Vijayawada")):
    center = CITY_CENTERS.get(city, CITY_CENTERS["Vijayawada"])
    hotspots = MOCK_BASE_HOTSPOTS.get(city, MOCK_BASE_HOTSPOTS["Vijayawada"])
    return EnforcementService.suggest_route(center["lat"], center["lng"], hotspots)

@router.get("/evidence", tags=["enforcement"])
def get_enforcement_evidence(city: str = Query("Vijayawada"), hotspot_id: str = Query("h1")):
    hotspots = MOCK_BASE_HOTSPOTS.get(city, MOCK_BASE_HOTSPOTS["Vijayawada"])
    matched = [h for h in hotspots if h["hotspot_id"] == hotspot_id]
    
    if not matched:
        hp = hotspots[0]
    else:
        hp = matched[0]

    return {
        "hotspot_id": hp["hotspot_id"],
        "severity": hp["severity"],
        "estimated_source": hp["estimated_source"],
        "aqi_trend": [110, 125, 140, 155, 142], # last 5 hours
        "wind_dispersion": "North-East flow carrying industrial particulate matter downstream.",
        "traffic_levels": "Congestion metrics index is 1.45x standard baseline.",
        "historical_events": "Recurrent violations recorded at this cluster location during weekends."
    }
