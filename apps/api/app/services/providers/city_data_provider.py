from typing import Dict, Any
from app.services.providers.base_provider import BaseProvider
from app.core.cities_config import get_city_config

class CityDataProvider(BaseProvider):
    """
    Deterministic provider for population, land-use, construction, and traffic density.
    Based on static public demographic and census datasets for Indian cities.
    """
    
    async def fetch_data(self, **kwargs) -> Dict[str, Any]:
        config = get_city_config(self.city_name)
        
        return {
            "population": config["population"],
            "traffic_density_index": config["traffic_multiplier"] * 100,  # 0-100 scale
            "industrial_density_index": config["industrial_multiplier"] * 100,
            "green_cover_percentage": config["green_cover_pct"],
            "active_construction_index": config["construction_multiplier"] * 100,
            "dominant_source": config["dominant_source"]
        }
