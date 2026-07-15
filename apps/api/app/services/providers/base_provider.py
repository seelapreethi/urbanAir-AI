from typing import Any, Dict, Optional

class BaseProvider:
    """Base class for all UrbanAir AI external data providers."""
    
    def __init__(self, city_name: str, config: Optional[Dict[str, Any]] = None):
        self.city_name = city_name
        self.config = config or {}
    
    async def fetch_data(self, **kwargs) -> Any:
        raise NotImplementedError("Subclasses must implement fetch_data")
