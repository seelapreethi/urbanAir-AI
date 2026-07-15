from datetime import datetime
from typing import Dict, Any

def normalize_weather_data(city: str, lat: float, lon: float, raw_meteo: dict) -> dict:
    """Extracts raw Open-Meteo current outputs into our unified weather representation."""
    current = raw_meteo.get("current", {})
    
    return {
        "timestamp": current.get("time", datetime.now().isoformat()),
        "city": city,
        "latitude": lat,
        "longitude": lon,
        "temperature": current.get("temperature_2m", 25.0),
        "humidity": current.get("relative_humidity_2m", 60.0),
        "wind_speed": current.get("wind_speed_10m", 10.0),
        "pressure": current.get("surface_pressure", 1010.0),
        "rainfall": current.get("precipitation", 0.0),
        "source": "Open-Meteo API"
    }

def normalize_openaq_data(city: str, lat: float, lon: float, raw_openaq: list) -> dict:
    """Folds OpenAQ parameters maps into a single unified air quality record."""
    aqi_val = 120
    pm2_5 = 35.0
    pm10 = 50.0
    no2 = 18.0
    so2 = 8.0
    co = 0.5
    ozone = 22.0
    
    # Locate elements from OpenAQ parameters array
    for entry in raw_openaq:
        measurements = entry.get("measurements", [])
        for m in measurements:
            param = m.get("parameter", "").lower()
            val = m.get("value", 0.0)
            if param == "pm25":
                pm2_5 = val
            elif param == "pm10":
                pm10 = val
            elif param == "no2":
                no2 = val
            elif param == "so2":
                so2 = val
            elif param == "co":
                co = val
            elif param == "o3":
                ozone = val

    # Estimate AQI index based on pm25 if index is missing
    aqi_val = int(max(pm2_5 * 2.0, pm10 * 1.0))
    aqi_val = min(500, max(15, aqi_val))

    return {
        "timestamp": datetime.now().isoformat(),
        "city": city,
        "latitude": lat,
        "longitude": lon,
        "aqi": aqi_val,
        "pm2_5": pm2_5,
        "pm10": pm10,
        "no2": no2,
        "so2": so2,
        "co": co,
        "ozone": ozone,
        "source": "OpenAQ API"
    }
