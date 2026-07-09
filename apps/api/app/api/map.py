from fastapi import APIRouter, Query
from typing import List, Dict, Any

router = APIRouter()

# Mock definitions for Map API
MOCK_CITIES = [
    {"city_name": "Vijayawada", "state_name": "Andhra Pradesh", "country_name": "India", "latitude": 16.5062, "longitude": 80.6480, "population": 1200000},
    {"city_name": "Hyderabad", "state_name": "Telangana", "country_name": "India", "latitude": 17.3850, "longitude": 78.4867, "population": 10000000},
    {"city_name": "Bengaluru", "state_name": "Karnataka", "country_name": "India", "latitude": 12.9716, "longitude": 77.5946, "population": 12000000},
    {"city_name": "Chennai", "state_name": "Tamil Nadu", "country_name": "India", "latitude": 13.0827, "longitude": 80.2707, "population": 8000000},
    {"city_name": "Delhi", "state_name": "Delhi NCR", "country_name": "India", "latitude": 28.6139, "longitude": 77.2090, "population": 30000000}
]

MOCK_LAYERS = [
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
    {"layer_key": "road_network", "layer_name": "Major Road Network Outlines", "category": "base", "is_default": False}
]

MOCK_STATIONS: Dict[str, List[Dict[str, Any]]] = {
    "Vijayawada": [
        {"station_id": "s1", "station_name": "Benz Circle Main Crossing", "latitude": 16.5065, "longitude": 80.6540, "aqi": 142, "dominant_pollutant": "PM2.5", "temp": 32.4, "humidity": 64, "wind_speed": 8.5, "last_updated": "10 mins ago", "is_active": True},
        {"station_id": "s2", "station_name": "Police Control Room Station", "latitude": 16.5140, "longitude": 80.6200, "aqi": 88, "dominant_pollutant": "PM10", "temp": 31.8, "humidity": 67, "wind_speed": 10.2, "last_updated": "15 mins ago", "is_active": True},
        {"station_id": "s3", "station_name": "One Town Commercial Area", "latitude": 16.5210, "longitude": 80.6050, "aqi": 185, "dominant_pollutant": "PM2.5", "temp": 33.1, "humidity": 60, "wind_speed": 6.8, "last_updated": "5 mins ago", "is_active": True},
        {"station_id": "s4", "station_name": "Kanaka Durga Hill slope", "latitude": 16.5160, "longitude": 80.6010, "aqi": 45, "dominant_pollutant": "SO2", "temp": 30.5, "humidity": 69, "wind_speed": 12.0, "last_updated": "1 hour ago", "is_active": True},
        {"station_id": "s5", "station_name": "Patamata Industrial Border", "latitude": 16.4950, "longitude": 80.6650, "aqi": 260, "dominant_pollutant": "PM2.5", "temp": 33.5, "humidity": 55, "wind_speed": 4.5, "last_updated": "2 mins ago", "is_active": True}
    ],
    "Hyderabad": [
        {"station_id": "s6", "station_name": "Gachibowli IT Corridor", "latitude": 17.4400, "longitude": 78.3480, "aqi": 72, "dominant_pollutant": "PM2.5", "temp": 28.5, "humidity": 70, "wind_speed": 14.5, "last_updated": "12 mins ago", "is_active": True},
        {"station_id": "s7", "station_name": "Charminar Heritage Center", "latitude": 17.3616, "longitude": 78.4747, "aqi": 198, "dominant_pollutant": "PM10", "temp": 30.2, "humidity": 65, "wind_speed": 9.4, "last_updated": "8 mins ago", "is_active": True},
        {"station_id": "s8", "station_name": "KPHB Colony Station", "latitude": 17.4830, "longitude": 78.3880, "aqi": 145, "dominant_pollutant": "PM2.5", "temp": 29.8, "humidity": 68, "wind_speed": 11.1, "last_updated": "22 mins ago", "is_active": True},
        {"station_id": "s9", "station_name": "Jeedimetla Industrial Area", "latitude": 17.5180, "longitude": 78.4350, "aqi": 310, "dominant_pollutant": "PM2.5", "temp": 31.4, "humidity": 52, "wind_speed": 5.2, "last_updated": "1 min ago", "is_active": True},
        {"station_id": "s10", "station_name": "Begumpet Observatory", "latitude": 17.4520, "longitude": 78.4680, "aqi": 95, "dominant_pollutant": "NO2", "temp": 29.0, "humidity": 66, "wind_speed": 12.8, "last_updated": "30 mins ago", "is_active": True}
    ]
}

MOCK_HOTSPOTS: Dict[str, List[Dict[str, Any]]] = {
    "Vijayawada": [
        {"hotspot_id": "h1", "latitude": 16.5065, "longitude": 80.6540, "risk_level": "Critical", "severity": 0.95, "estimated_source": "Vehicular Traffic Exhaust", "confidence_score": 89.4, "radius": 800},
        {"hotspot_id": "h2", "latitude": 16.4950, "longitude": 80.6650, "risk_level": "High", "severity": 0.82, "estimated_source": "Brick Kilns & Small Scale Casts", "confidence_score": 81.5, "radius": 1100}
    ],
    "Hyderabad": [
        {"hotspot_id": "h3", "latitude": 17.5180, "longitude": 78.4350, "risk_level": "Critical", "severity": 0.98, "estimated_source": "Chemical Manufacturing Plants", "confidence_score": 93.8, "radius": 1400},
        {"hotspot_id": "h4", "latitude": 17.3616, "longitude": 78.4747, "risk_level": "High", "severity": 0.86, "estimated_source": "Heavy Transit Traffic Corridor", "confidence_score": 85.0, "radius": 900}
    ]
}

MOCK_WEATHER: Dict[str, Dict[str, Any]] = {
    "Vijayawada": {"temp": 32.5, "humidity": 68, "wind_speed": 12.4, "visibility": 8.0, "pressure": 1008},
    "Hyderabad": {"temp": 29.4, "humidity": 72, "wind_speed": 14.8, "visibility": 9.5, "pressure": 1010}
}

@router.get("/cities", tags=["map"])
def get_cities():
    return MOCK_CITIES

@router.get("/layers", tags=["map"])
def get_layers():
    return MOCK_LAYERS

@router.get("/stations", tags=["map"])
def get_stations(city: str = Query("Vijayawada")):
    return MOCK_STATIONS.get(city, MOCK_STATIONS["Vijayawada"])

@router.get("/hotspots", tags=["map"])
def get_hotspots(city: str = Query("Vijayawada")):
    return MOCK_HOTSPOTS.get(city, MOCK_HOTSPOTS["Vijayawada"])

@router.get("/weather", tags=["map"])
def get_weather(city: str = Query("Vijayawada")):
    return MOCK_WEATHER.get(city, MOCK_WEATHER["Vijayawada"])

@router.get("/heatmap", tags=["map"])
def get_heatmap(city: str = Query("Vijayawada")):
    stations = MOCK_STATIONS.get(city, MOCK_STATIONS["Vijayawada"])
    # Generate weighted coordinates for heatmap points
    return [[st["latitude"], st["longitude"], min(st["aqi"] / 100.0, 3.0)] for st in stations]

@router.get("/wards", tags=["map"])
def get_wards(city: str = Query("Vijayawada")):
    # Return mock wards geometries (GeoJSON features list)
    stations = MOCK_STATIONS.get(city, MOCK_STATIONS["Vijayawada"])
    features = []
    
    for idx, st in enumerate(stations):
        lat, lng = st["latitude"], st["longitude"]
        # Generate simple square polygon around station as a mock boundary representation
        features.append({
            "type": "Feature",
            "properties": {
                "ward_id": f"w-{idx}",
                "ward_name": f"Municipal Ward {idx + 1}",
                "ward_code": f"VJA-W{idx + 1:02d}",
                "population": 12000 + idx * 4500,
                "area_sq_km": 2.5 + idx * 0.5,
                "current_aqi": st["aqi"]
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[
                    [lng - 0.01, lat - 0.01],
                    [lng + 0.01, lat - 0.01],
                    [lng + 0.01, lat + 0.01],
                    [lng - 0.01, lat + 0.01],
                    [lng - 0.01, lat - 0.01]
                ]]
            }
        })
        
    return {
        "type": "FeatureCollection",
        "features": features
    }
