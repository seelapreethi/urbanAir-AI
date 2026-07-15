import hashlib
from typing import Dict, Any
from app.services.providers.base_provider import BaseProvider
from app.core.cities_config import get_city_config

class SatelliteProvider(BaseProvider):
    """
    Pipeline mock for Sentinel satellite imagery processing.
    Returns deterministic aerosol optical depth (AOD) and structural insights based on the city.
    """
    
    async def fetch_data(self, **kwargs) -> Dict[str, Any]:
        config = get_city_config(self.city_name)
        
        # Generate deterministic values based on city name hash
        h = int(hashlib.md5(self.city_name.encode()).hexdigest(), 16)
        
        # Pseudo-random but deterministic AOD (Aerosol Optical Depth)
        aod_base = 0.3 + ((h % 50) / 100.0) 
        if config["dominant_source"] == "Traffic":
            aod_base += 0.2
        elif config["dominant_source"] == "Industry":
            aod_base += 0.35
            
        return {
            "satellite": "Sentinel-5P",
            "aod_index": round(aod_base, 2),
            "vegetation_health_index": config["green_cover_pct"] / 100.0,
            "hotspot_count_detected": (h % 15) + 3,
            "cloud_cover": (h % 30)
        }
