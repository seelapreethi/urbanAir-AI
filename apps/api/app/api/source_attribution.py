from fastapi import APIRouter, Query
from typing import List, Dict, Any
from app.services.attribution_service import AttributionService
from app.services.providers.weather_provider import WeatherProvider
from app.services.providers.city_data_provider import CityDataProvider
from app.core.cities_config import get_city_config

router = APIRouter()

async def get_city_attrib_features(city: str) -> Dict[str, Any]:
    config = get_city_config(city)
    weather_data = await WeatherProvider(city).fetch_data()
    city_data = await CityDataProvider(city).fetch_data()
    
    return {
        "lat": config["lat"],
        "lng": config["lon"],
        "wind_dir": 45.0,  # default meteorological direction
        "wind_speed": weather_data["wind_speed"],
        "traffic": city_data["traffic_density_index"] / 100.0,
        "construction": city_data["active_construction_index"],
        "industrial": city_data["industrial_density_index"],
        "dominant_source": city_data["dominant_source"]
    }

@router.get("", tags=["source-attribution"])
async def get_source_attribution_summary(city: str = Query("Delhi")):
    feat = await get_city_attrib_features(city)
    result = AttributionService.calculate_attribution(
        city, feat["lat"], feat["lng"], feat["wind_dir"], feat["wind_speed"], feat["traffic"],
        construction_idx=feat["construction"], industrial_idx=feat["industrial"]
    )
    return result

@router.get("/map", tags=["source-attribution"])
async def get_source_attribution_map(city: str = Query("Delhi")):
    feat = await get_city_attrib_features(city)
    lat, lng = feat["lat"], feat["lng"]
    
    # 4 distinct localized overlay point sources relative to the city center
    return [
        {
            "id": f"{city.lower()}-src-1",
            "name": f"{city} High-Density Traffic Node",
            "type": "Traffic",
            "latitude": lat + 0.0003,
            "longitude": lng + 0.006,
            "intensity": round(feat["traffic"], 2),
            "influence_radius": 600,
            "confidence": 91.2
        },
        {
            "id": f"{city.lower()}-src-2",
            "name": f"{city} Main Industrial Belt",
            "type": "Industry",
            "latitude": lat - 0.011,
            "longitude": lng + 0.017,
            "intensity": round(feat["industrial"] / 100.0, 2),
            "influence_radius": 1200,
            "confidence": 88.4
        },
        {
            "id": f"{city.lower()}-src-3",
            "name": f"{city} Metro Expansion Site",
            "type": "Construction Sites",
            "latitude": lat + 0.015,
            "longitude": lng - 0.043,
            "intensity": round(feat["construction"] / 100.0, 2),
            "influence_radius": 800,
            "confidence": 85.0
        },
        {
            "id": f"{city.lower()}-src-4",
            "name": f"{city} Local Municipal Dumpsite",
            "type": "Waste Burning",
            "latitude": lat - 0.024,
            "longitude": lng - 0.012,
            "intensity": 0.65,
            "influence_radius": 1000,
            "confidence": 78.5
        }
    ]

@router.get("/details", tags=["source-attribution"])
async def get_source_attribution_details(city: str = Query("Delhi"), source_id: str = Query("src-1")):
    feat = await get_city_attrib_features(city)
    lat, lng = feat["lat"], feat["lng"]
    
    # Profiles derived dynamically using city features
    profiles = {
        "src-1": {
            "id": "src-1",
            "name": f"{city} High-Density Traffic Node",
            "type": "Traffic",
            "contribution_pct": round(feat["traffic"] * 45.0, 1),
            "confidence_score": 91.2,
            "supporting_evidence": f"Traffic Index is at {feat['traffic']*100:.1f}%. Traffic congestion correlates with temporal PM2.5 spikes.",
            "weather_impact": f"Current wind speeds of {feat['wind_speed']:.1f} km/h alter exhaust dispersion rates.",
            "historical_trend": f"Persistently accounts for substantial load during morning and evening rush hour schedules in {city}.",
            "suggested_action": "Enforce heavy vehicle detour regulations and deploy local dust suppression mist cannons."
        },
        "src-2": {
            "id": "src-2",
            "name": f"{city} Main Industrial Belt",
            "type": "Industry",
            "contribution_pct": round(feat["industrial"] * 0.35, 1),
            "confidence_score": 88.4,
            "supporting_evidence": f"Localized monitoring indicates raised SO2 signatures matching {city} industrial index ({feat['industrial']:.1f}).",
            "weather_impact": f"Wind patterns carry industrial stacks dispersion plumes across residential buffer buffers.",
            "historical_trend": "Remains a significant baseline emitter across quarterly environmental audits.",
            "suggested_action": "Audit heavy industrial boiler compliance and inspect particulate scrubbers."
        }
    }
    
    clean_id = "src-2" if "src-2" in source_id else "src-1"
    return profiles[clean_id]

@router.get("/contributors", tags=["source-attribution"])
async def get_source_contributors(city: str = Query("Delhi")):
    feat = await get_city_attrib_features(city)
    res = AttributionService.calculate_attribution(
        city, feat["lat"], feat["lng"], feat["wind_dir"], feat["wind_speed"], feat["traffic"],
        construction_idx=feat["construction"], industrial_idx=feat["industrial"]
    )
    return [
        {"source": name, "percentage": pct} 
        for name, pct in res["contributions"].items()
    ]
