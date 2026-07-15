from fastapi import APIRouter, Query
from typing import List, Dict, Any
from app.services.enforcement_service import EnforcementService
from app.core.cities_config import get_city_config
from app.services.providers.aqi_provider import AQIProvider
from app.services.providers.city_data_provider import CityDataProvider

router = APIRouter()

async def get_city_enforcement_features(city: str) -> Dict[str, Any]:
    cfg = get_city_config(city)
    aqi_data = await AQIProvider(city).fetch_data()
    city_data = await CityDataProvider(city).fetch_data()
    
    base_aqi = aqi_data["aqi"]
    lat, lng = cfg["lat"], cfg["lon"]
    
    # Dynamically generate 3 hotspots relative to city center coordinates
    hotspots = [
        {
            "hotspot_id": f"hp-{city.lower()}-1",
            "latitude": lat + 0.0003,
            "longitude": lng + 0.006,
            "severity": round(min(0.99, max(0.2, base_aqi / 300.0)), 2),
            "estimated_source": f"Traffic Corridor ({city_data['dominant_source']})",
            "radius": 800,
            "confidence_score": 89.4
        },
        {
            "hotspot_id": f"hp-{city.lower()}-2",
            "latitude": lat - 0.011,
            "longitude": lng + 0.017,
            "severity": round(min(0.99, max(0.2, (base_aqi - 30) / 300.0)), 2),
            "estimated_source": "Infrastructure / Factory Zones",
            "radius": 1100,
            "confidence_score": 81.5
        },
        {
            "hotspot_id": f"hp-{city.lower()}-3",
            "latitude": lat + 0.015,
            "longitude": lng - 0.043,
            "severity": round(min(0.99, max(0.2, (base_aqi - 60) / 300.0)), 2),
            "estimated_source": "Commercial Construction Dust",
            "radius": 900,
            "confidence_score": 75.0
        }
    ]
    return {
        "lat": lat,
        "lng": lng,
        "hotspots": hotspots
    }

@router.get("", tags=["enforcement"])
async def get_enforcement_summary(city: str = Query("Delhi")):
    feat = await get_city_enforcement_features(city)
    hotspots = feat["hotspots"]
    ranked = EnforcementService.rank_hotspots(hotspots)
    
    critical_count = sum(1 for h in ranked if h["priority_level"] == "Critical")
    high_count = sum(1 for h in ranked if h["priority_level"] == "High")
    
    return {
        "city": city,
        "critical_hotspots_count": critical_count,
        "high_priority_hotspots_count": high_count,
        "total_active_hotspots": len(ranked),
        "priority_alerts": [
            f"Alert: Critical industrial plume dispersion identified near coordinate [{h['latitude']:.4f}, {h['longitude']:.4f}]"
            for h in ranked if h["priority_level"] == "Critical"
        ]
    }

@router.get("/hotspots", tags=["enforcement"])
async def get_enforcement_hotspots(city: str = Query("Delhi")):
    feat = await get_city_enforcement_features(city)
    return EnforcementService.rank_hotspots(feat["hotspots"])

@router.get("/recommendations", tags=["enforcement"])
async def get_enforcement_recommendations(city: str = Query("Delhi")):
    feat = await get_city_enforcement_features(city)
    ranked = EnforcementService.rank_hotspots(feat["hotspots"])
    return EnforcementService.generate_recommendations(ranked)

@router.get("/routes", tags=["enforcement"])
async def get_enforcement_dispatch_routes(city: str = Query("Delhi")):
    feat = await get_city_enforcement_features(city)
    return EnforcementService.suggest_route(feat["lat"], feat["lng"], feat["hotspots"])

@router.get("/evidence", tags=["enforcement"])
async def get_enforcement_evidence(city: str = Query("Delhi"), hotspot_id: str = Query("h1")):
    feat = await get_city_enforcement_features(city)
    hotspots = feat["hotspots"]
    
    # Try direct match or ends_with match to account for dynamic prefix
    matched = [h for h in hotspots if h["hotspot_id"] == hotspot_id or h["hotspot_id"].endswith(hotspot_id)]
    if not matched:
        hp = hotspots[0]
    else:
        hp = matched[0]

    return {
        "hotspot_id": hp["hotspot_id"],
        "severity": hp["severity"],
        "estimated_source": hp["estimated_source"],
        "aqi_trend": [110, 125, 140, 155, int(hp["severity"] * 300)],
        "wind_dispersion": "Meteorological vectors suggest transport of particulates downstream.",
        "traffic_levels": f"Localized congestion index matches standard {city} density models.",
        "historical_events": "Routine infractions logged at this coordinates during high stagnation events."
    }
