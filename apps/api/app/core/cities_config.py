from typing import Dict, Any

CITIES_CONFIG: Dict[str, Dict[str, Any]] = {
    "Delhi": {
        "lat": 28.6139,
        "lon": 77.2090,
        "population": 32000000,
        "traffic_multiplier": 0.95,
        "industrial_multiplier": 0.8,
        "green_cover_pct": 12,
        "construction_multiplier": 0.85,
        "base_aqi_offset": 200,
        "dominant_source": "Traffic"
    },
    "Mumbai": {
        "lat": 19.0760,
        "lon": 72.8777,
        "population": 21000000,
        "traffic_multiplier": 0.90,
        "industrial_multiplier": 0.75,
        "green_cover_pct": 15,
        "construction_multiplier": 0.8,
        "base_aqi_offset": 120,
        "dominant_source": "Traffic"
    },
    "Hyderabad": {
        "lat": 17.3850,
        "lon": 78.4867,
        "population": 10500000,
        "traffic_multiplier": 0.80,
        "industrial_multiplier": 0.70,
        "green_cover_pct": 20,
        "construction_multiplier": 0.90,
        "base_aqi_offset": 90,
        "dominant_source": "Construction Sites"
    },
    "Bengaluru": {
        "lat": 12.9716,
        "lon": 77.5946,
        "population": 13000000,
        "traffic_multiplier": 0.95,
        "industrial_multiplier": 0.50,
        "green_cover_pct": 25,
        "construction_multiplier": 0.85,
        "base_aqi_offset": 80,
        "dominant_source": "Traffic"
    },
    "Chennai": {
        "lat": 13.0827,
        "lon": 80.2707,
        "population": 11500000,
        "traffic_multiplier": 0.80,
        "industrial_multiplier": 0.85,
        "green_cover_pct": 18,
        "construction_multiplier": 0.70,
        "base_aqi_offset": 95,
        "dominant_source": "Industry"
    },
    "Kolkata": {
        "lat": 22.5726,
        "lon": 88.3639,
        "population": 15000000,
        "traffic_multiplier": 0.85,
        "industrial_multiplier": 0.60,
        "green_cover_pct": 10,
        "construction_multiplier": 0.60,
        "base_aqi_offset": 130,
        "dominant_source": "Traffic"
    },
    "Pune": {
        "lat": 18.5204,
        "lon": 73.8567,
        "population": 7000000,
        "traffic_multiplier": 0.85,
        "industrial_multiplier": 0.70,
        "green_cover_pct": 22,
        "construction_multiplier": 0.75,
        "base_aqi_offset": 85,
        "dominant_source": "Traffic"
    },
    "Ahmedabad": {
        "lat": 23.0225,
        "lon": 72.5714,
        "population": 8500000,
        "traffic_multiplier": 0.75,
        "industrial_multiplier": 0.90,
        "green_cover_pct": 14,
        "construction_multiplier": 0.80,
        "base_aqi_offset": 140,
        "dominant_source": "Industry"
    },
    "Vijayawada": {
        "lat": 16.5062,
        "lon": 80.6480,
        "population": 2000000,
        "traffic_multiplier": 0.60,
        "industrial_multiplier": 0.50,
        "green_cover_pct": 30,
        "construction_multiplier": 0.60,
        "base_aqi_offset": 60,
        "dominant_source": "Traffic"
    },
    "Visakhapatnam": {
        "lat": 17.6868,
        "lon": 83.2185,
        "population": 2300000,
        "traffic_multiplier": 0.55,
        "industrial_multiplier": 0.95,
        "green_cover_pct": 28,
        "construction_multiplier": 0.50,
        "base_aqi_offset": 75,
        "dominant_source": "Industry"
    }
}

def get_city_config(city_name: str) -> Dict[str, Any]:
    return CITIES_CONFIG.get(city_name, CITIES_CONFIG["Delhi"])
