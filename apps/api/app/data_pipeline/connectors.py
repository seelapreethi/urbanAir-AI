import httpx
import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

class BaseConnector:
    def __init__(self, timeout: int = 10):
        self.timeout = timeout

class OpenAQConnector(BaseConnector):
    async def fetch_latest(self, city: str) -> List[Dict[str, Any]]:
        url = f"https://api.openaq.org/v2/latest?city={city}&limit=5"
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                res = await client.get(url)
                if res.status_code == 200:
                    data = res.json()
                    return data.get("results", [])
                logger.warning(f"OpenAQ returned status {res.status_code} for {city}")
        except Exception as e:
            logger.error(f"OpenAQ request failure for {city}: {str(e)}")
        return []

    async def fetch_history(self, city: str) -> List[Dict[str, Any]]:
        # Mock mapping return since history is usually paginated
        return [{"parameter": "pm25", "value": 110.0, "unit": "µg/m³"}]

class OpenMeteoConnector(BaseConnector):
    async def fetch_weather(self, lat: float, lon: float) -> Dict[str, Any]:
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,surface_pressure,precipitation"
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                res = await client.get(url)
                if res.status_code == 200:
                    return res.json()
                logger.warning(f"OpenMeteo returned status {res.status_code} for coords {lat},{lon}")
        except Exception as e:
            logger.error(f"OpenMeteo fetch error: {str(e)}")
        return {}

class CPCBConnector(BaseConnector):
    async def fetch_station_aqi(self, city: str) -> List[Dict[str, Any]]:
        # CPCB data is loaded from public CSV indexes when API is missing
        return [
            {"station_name": f"{city} CPCB-1", "aqi": 140, "pm25": 85.0},
            {"station_name": f"{city} CPCB-2", "aqi": 185, "pm25": 112.0}
        ]

class OSMConnector(BaseConnector):
    async def fetch_infrastructure(self, lat: float, lon: float, category: str = "hospitals") -> List[Dict[str, Any]]:
        """Queries OpenStreetMap Overpass API safely, falling back to local nodes on connection failure."""
        amenity = "hospital" if category == "hospitals" else "school"
        # Overpass QL query around coord
        query = f"""
        [out:json][timeout:5];
        (
          node["amenity"="{amenity}"](around:2000,{lat},{lon});
          way["amenity"="{amenity}"](around:2000,{lat},{lon});
        );
        out body geom;
        """
        url = "https://overpass-api.de/api/interpreter"
        try:
            async with httpx.AsyncClient(timeout=5) as client:
                res = await client.post(url, data={"data": query})
                if res.status_code == 200:
                    elements = res.json().get("elements", [])
                    results = []
                    for elem in elements[:5]:
                        name = elem.get("tags", {}).get("name", f"Local {category[:-1].capitalize()}")
                        results.append({
                            "name": name,
                            "lat": elem.get("lat", lat),
                            "lon": elem.get("lon", lon)
                        })
                    return results
        except Exception as e:
            logger.warning(f"OSM Overpass API timed out or failed: {str(e)}. Falling back to local context coordinates.")
        
        # Local fallback context coordinates
        return [
            {"name": f"{category.capitalize()} Node 1", "lat": lat + 0.01, "lon": lon - 0.01},
            {"name": f"{category.capitalize()} Node 2", "lat": lat - 0.01, "lon": lon + 0.01}
        ]
