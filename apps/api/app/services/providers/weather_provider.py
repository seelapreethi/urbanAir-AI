import httpx
from typing import Dict, Any
from app.services.providers.base_provider import BaseProvider
from app.core.cities_config import get_city_config
from app.core.cache import ttl_cache

class WeatherProvider(BaseProvider):
    
    @ttl_cache(ttl=1800)  # Cache for 30 minutes
    async def fetch_current_weather(self) -> Dict[str, Any]:
        config = get_city_config(self.city_name)
        lat = config["lat"]
        lon = config["lon"]
        
        url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m"
        
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.get(url, timeout=10.0)
                if resp.status_code == 200:
                    data = resp.json()
                    current = data.get("current", {})
                    return {
                        "temperature": current.get("temperature_2m", 25.0),
                        "humidity": current.get("relative_humidity_2m", 50.0),
                        "wind_speed": current.get("wind_speed_10m", 5.0),
                        "precipitation": current.get("precipitation", 0.0)
                    }
        except Exception as e:
            print(f"WeatherProvider fallback for {self.city_name} due to: {e}")
            
        # Deterministic fallback if API fails
        return {
            "temperature": 28.5,
            "humidity": 65.0,
            "wind_speed": 8.0,
            "precipitation": 0.0
        }
    
    async def fetch_data(self, **kwargs) -> Any:
        return await self.fetch_current_weather()
