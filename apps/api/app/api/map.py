from fastapi import APIRouter, Query
from typing import List, Dict, Any
from app.services.providers.weather_provider import WeatherProvider
from app.services.providers.aqi_provider import AQIProvider
from app.services.providers.city_data_provider import CityDataProvider
from app.core.cities_config import get_city_config, CITIES_CONFIG

router = APIRouter()

def get_time_multiplier(time_param: str) -> float:
    t = time_param.lower().strip()
    if "past" in t:
        return 0.88
    elif "24h" in t:
        return 1.06
    elif "48h" in t:
        return 1.12
    elif "72h" in t:
        return 1.22
    return 1.0

@router.get("/cities", tags=["map"])
def get_cities():
    cities = []
    for city_name, cfg in CITIES_CONFIG.items():
        cities.append({
            "city_name": city_name,
            "state_name": "State",
            "country_name": "India",
            "latitude": cfg["lat"],
            "longitude": cfg["lon"],
            "population": cfg["population"]
        })
    return cities

@router.get("/layers", tags=["map"])
def get_layers():
    return [
        {"layer_key": "aqi_stations", "layer_name": "AQI Monitoring Stations", "category": "environmental", "is_default": True},
        {"layer_key": "heatmap", "layer_name": "AQI Pollution Heatmap", "category": "environmental", "is_default": False},
        {"layer_key": "traffic", "layer_name": "Traffic Flow Density", "category": "infrastructure", "is_default": False},
        {"layer_key": "industries", "layer_name": "Industrial Emission Outlets", "category": "infrastructure", "is_default": False},
        {"layer_key": "construction_sites", "layer_name": "Construction & Dust Areas", "category": "infrastructure", "is_default": False},
        {"layer_key": "green_cover", "layer_name": "Urban Green Canopy Cover", "category": "environmental", "is_default": False},
        {"layer_key": "hospitals", "layer_name": "Hospitals (Sensitive Zones)", "category": "social", "is_default": False},
        {"layer_key": "schools", "layer_name": "Schools (Vulnerable Zones)", "category": "social", "is_default": False},
        {"layer_key": "population_density", "layer_name": "Population Grid Density", "category": "social", "is_default": False},
        {"layer_key": "weather", "layer_name": "Local Climate Weather Markers", "category": "environmental", "is_default": False},
        {"layer_key": "ward_boundaries", "layer_name": "Municipal Ward Boundaries", "category": "base", "is_default": True},
        {"layer_key": "road_network", "layer_name": "Major Road Network Outlines", "category": "base", "is_default": False},
        {"layer_key": "inspections", "layer_name": "Enforcement Actions Log", "category": "base", "is_default": False}
    ]

@router.get("/stations", tags=["map"])
async def get_stations(city: str = Query("Delhi"), time: str = Query("current")):
    aqi_data = await AQIProvider(city).fetch_data()
    weather_data = await WeatherProvider(city).fetch_data()
    cfg = get_city_config(city)
    lat, lng = cfg["lat"], cfg["lon"]
    base_aqi = aqi_data["aqi"]
    mult = get_time_multiplier(time)
    
    stations = []
    offsets = [
        (0.0003, 0.006, "Central Business District"),
        (-0.0075, -0.028, "Western Residential Sector"),
        (0.0085, -0.043, "Northern Commercial Corridor"),
        (-0.0195, 0.012, "Southern Suburban Sector"),
        (-0.011, 0.017, "Eastern Industrial Belt")
    ]
    for idx, (lat_off, lng_off, name) in enumerate(offsets):
        stat_aqi = max(20, int((base_aqi + (idx * 25 - 50)) * mult))
        stations.append({
            "station_id": f"s-{city.lower()}-{idx}",
            "station_name": f"{city} {name} Station",
            "latitude": lat + lat_off,
            "longitude": lng + lng_off,
            "aqi": stat_aqi,
            "dominant_pollutant": "PM2.5" if stat_aqi > 100 else "PM10",
            "temp": weather_data["temperature"] + (idx % 3 - 1),
            "humidity": int(weather_data["humidity"] + (idx % 2 - 0.5) * 6),
            "wind_speed": weather_data["wind_speed"] + (idx % 3 - 1.5),
            "last_updated": "5 mins ago",
            "is_active": True
        })
    return stations

@router.get("/hotspots", tags=["map"])
async def get_hotspots(city: str = Query("Delhi"), time: str = Query("current")):
    aqi_data = await AQIProvider(city).fetch_data()
    city_data = await CityDataProvider(city).fetch_data()
    cfg = get_city_config(city)
    lat, lng = cfg["lat"], cfg["lon"]
    mult = get_time_multiplier(time)
    base_aqi = int(aqi_data["aqi"] * mult)
    
    return [
        {
            "hotspot_id": f"hp-{city.lower()}-1",
            "latitude": lat + 0.0003,
            "longitude": lng + 0.006,
            "risk_level": "Critical" if base_aqi > 250 else "High" if base_aqi > 120 else "Moderate",
            "severity": round(min(0.99, max(0.2, base_aqi / 300.0)), 2),
            "estimated_source": f"Heavy Transit Corridor ({city_data['dominant_source']})",
            "confidence_score": 89.4,
            "radius": 800
        },
        {
            "hotspot_id": f"hp-{city.lower()}-2",
            "latitude": lat - 0.011,
            "longitude": lng + 0.017,
            "risk_level": "High" if base_aqi > 180 else "Moderate",
            "severity": round(min(0.99, max(0.2, (base_aqi - 30) / 300.0)), 2),
            "estimated_source": "Infrastructure / Factory Zones",
            "confidence_score": 81.5,
            "radius": 1100
        }
    ]

@router.get("/weather", tags=["map"])
async def get_weather(city: str = Query("Delhi"), time: str = Query("current")):
    weather_data = await WeatherProvider(city).fetch_data()
    mult = get_time_multiplier(time)
    
    return {
        "temp": round(weather_data["temperature"] * (1 + (mult - 1) * 0.2), 1),
        "humidity": int(weather_data["humidity"] * (1 - (mult - 1) * 0.1)),
        "wind_speed": round(weather_data["wind_speed"] * (2 - mult), 1), # low wind speed on high forecast
        "visibility": max(1.5, round(8.0 / mult, 1)),
        "pressure": 1008
    }

@router.get("/heatmap", tags=["map"])
async def get_heatmap(city: str = Query("Delhi"), time: str = Query("current")):
    stations = await get_stations(city, time=time)
    return [[st["latitude"], st["longitude"], min(st["aqi"] / 100.0, 3.0)] for st in stations]

@router.get("/wards", tags=["map"])
async def get_wards(city: str = Query("Delhi"), time: str = Query("current")):
    stations = await get_stations(city, time=time)
    features = []
    
    for idx, st in enumerate(stations):
        lat, lng = st["latitude"], st["longitude"]
        features.append({
            "type": "Feature",
            "properties": {
                "ward_id": f"w-{city.lower()}-{idx}",
                "ward_name": f"{city} Ward {idx + 1}",
                "ward_code": f"{city[:3].upper()}-W{idx + 1:02d}",
                "population": 12000 + idx * 4500,
                "area_sq_km": 2.5 + idx * 0.5,
                "current_aqi": st["aqi"]
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [lng - 0.015, lat - 0.015],
                    [lng + 0.015, lat - 0.015],
                    [lng + 0.015, lat + 0.015],
                    [lng - 0.015, lat + 0.015],
                    [lng - 0.015, lat - 0.015]
                ]]
            }
        })
        
    return {
        "type": "FeatureCollection",
        "features": features
    }

@router.get("/sources", tags=["map"])
async def get_pollution_sources(city: str = Query("Delhi")):
    cfg = get_city_config(city)
    lat, lng = cfg["lat"], cfg["lon"]
    
    return [
        {
            "id": f"src-{city.lower()}-traffic-1",
            "type": "Traffic",
            "name": f"{city} Central Logistics Corridor",
            "latitude": lat + 0.005,
            "longitude": lng - 0.008,
            "contribution": 35.5,
            "confidence": 92.4,
            "evidence": "Heavy vehicle traffic counter data identifies excessive particulate loading peaks.",
            "trend": "Worsening due to peak hours bottlenecks"
        },
        {
            "id": f"src-{city.lower()}-industry-1",
            "type": "Industries",
            "name": f"{city} Power Plant Outlet",
            "latitude": lat - 0.022,
            "longitude": lng + 0.025,
            "contribution": 28.0,
            "confidence": 88.6,
            "evidence": "Continuous stack sensors audit traces matching elevated SO2 columns.",
            "trend": "Stable under standard emissions filters"
        },
        {
            "id": f"src-{city.lower()}-construction-1",
            "type": "Construction",
            "name": f"{city} Metro Excavation Zone",
            "latitude": lat + 0.018,
            "longitude": lng - 0.02,
            "contribution": 16.5,
            "confidence": 81.0,
            "evidence": "High localized PM10 dust particles caught in dispersion path.",
            "trend": "Temporary peaks during active grading"
        },
        {
            "id": f"src-{city.lower()}-waste-1",
            "type": "Waste Burning",
            "name": f"{city} Landfill Perimeter",
            "latitude": lat - 0.015,
            "longitude": lng - 0.018,
            "contribution": 12.0,
            "confidence": 75.0,
            "evidence": "Thermal hotspots visible on Sentinel-5P telemetry.",
            "trend": "Fluctuates depending on nocturnal operations"
        }
    ]

@router.get("/forecast", tags=["map"])
async def get_forecast_grid(city: str = Query("Delhi"), time: str = Query("current")):
    cfg = get_city_config(city)
    lat, lng = cfg["lat"], cfg["lon"]
    mult = get_time_multiplier(time)
    
    # 24h, 48h, 72h forecast zones returning circular overlays
    return [
        {"time_offset": "24h", "latitude": lat + 0.01, "longitude": lng + 0.01, "aqi": int(115 * mult), "color": "#EF4444"},
        {"time_offset": "48h", "latitude": lat - 0.01, "longitude": lng + 0.02, "aqi": int(135 * mult), "color": "#EC4899"},
        {"time_offset": "72h", "latitude": lat + 0.02, "longitude": lng - 0.01, "aqi": int(160 * mult), "color": "#8B5CF6"}
    ]

@router.get("/hospitals", tags=["map"])
async def get_hospitals(city: str = Query("Delhi"), time: str = Query("current")):
    cfg = get_city_config(city)
    lat, lng = cfg["lat"], cfg["lon"]
    mult = get_time_multiplier(time)
    
    return [
        {
            "name": f"{city} General Hospital",
            "latitude": lat + 0.012,
            "longitude": lng - 0.015,
            "current_risk": "High" if mult > 1.1 else "Moderate",
            "forecast_risk": "Critical" if mult > 1.2 else "High",
            "suggested_action": "Verify operation of HEPA filtration and warn pulmonary patients."
        },
        {
            "name": f"{city} Cardiac Specialty Center",
            "latitude": lat - 0.018,
            "longitude": lng + 0.01,
            "current_risk": "Moderate",
            "forecast_risk": "High" if mult > 1.1 else "Moderate",
            "suggested_action": "Ensure ward windows remain sealed during stagnation hours."
        }
    ]

@router.get("/schools", tags=["map"])
async def get_schools(city: str = Query("Delhi"), time: str = Query("current")):
    cfg = get_city_config(city)
    lat, lng = cfg["lat"], cfg["lon"]
    mult = get_time_multiplier(time)
    
    return [
        {
            "name": f"{city} International Academy",
            "latitude": lat - 0.008,
            "longitude": lng - 0.022,
            "current_risk": "High" if mult > 1.1 else "Moderate",
            "forecast_risk": "Critical" if mult > 1.2 else "High",
            "suggested_action": "Suspend all physical outdoor training activities."
        },
        {
            "name": f"{city} Primary School Belt",
            "latitude": lat + 0.022,
            "longitude": lng + 0.015,
            "current_risk": "Moderate",
            "forecast_risk": "High" if mult > 1.1 else "Moderate",
            "suggested_action": "Reschedule outdoor assemblies to virtual classrooms."
        }
    ]

@router.get("/inspection", tags=["map"])
async def get_inspections(city: str = Query("Delhi")):
    cfg = get_city_config(city)
    lat, lng = cfg["lat"], cfg["lon"]
    
    return [
        {"id": "insp-1", "name": f"{city} Core Crossing", "status": "Completed", "priority": "High", "latitude": lat + 0.0003, "longitude": lng + 0.006},
        {"id": "insp-2", "name": f"{city} Boiler Belt", "status": "Inspection Required", "priority": "Critical", "latitude": lat - 0.011, "longitude": lng + 0.017},
        {"id": "insp-3", "name": "Excavation Grid", "status": "Pending Violations", "priority": "Medium", "latitude": lat + 0.015, "longitude": lng - 0.043}
    ]
