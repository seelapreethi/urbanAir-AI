import time
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

class PipelineCacheLayer:
    """Caching layer that stores latest fetched data frames with configurable TTLs."""
    _store: Dict[str, Dict[str, Any]] = {}
    
    @classmethod
    def set(cls, key: str, value: Any, ttl: int = 1800):
        cls._store[key] = {
            "data": value,
            "expiry": time.time() + ttl
        }
        logger.info(f"Cached data for key: {key} with TTL: {ttl}s")
        
    @classmethod
    def get(cls, key: str) -> Optional[Any]:
        if key not in cls._store:
            return None
            
        entry = cls._store[key]
        if time.time() > entry["expiry"]:
            logger.info(f"Cache key: {key} has expired.")
            return None
            
        return entry["data"]

    @classmethod
    def get_fallback(cls, key: str) -> Optional[Any]:
        """Ignores expiry limits to prevent API failures when downstream endpoints are down."""
        if key in cls._store:
            logger.warning(f"Downstream source down. Serving expired cache fallback for key: {key}")
            return cls._store[key]["data"]
        return None

    @classmethod
    def clear(cls):
        cls._store.clear()
        
    @classmethod
    def get_status(cls) -> Dict[str, Any]:
        return {
            "cached_keys_count": len(cls._store),
            "keys": list(cls._store.keys())
        }
