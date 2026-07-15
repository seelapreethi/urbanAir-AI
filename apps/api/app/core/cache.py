import time
import asyncio
from typing import Any, Callable, Dict, Tuple
from functools import wraps

# Simple in-memory TTL cache
_cache: Dict[str, Tuple[float, Any]] = {}

def get_cache(key: str) -> Any:
    if key in _cache:
        expiry, data = _cache[key]
        if time.time() < expiry:
            return data
        else:
            del _cache[key]
    return None

def set_cache(key: str, data: Any, ttl_seconds: int = 3600) -> None:
    _cache[key] = (time.time() + ttl_seconds, data)

def ttl_cache(ttl: int = 3600):
    """
    Decorator for caching async and sync function responses with a TTL.
    """
    def decorator(func: Callable):
        if asyncio.iscoroutinefunction(func):
            @wraps(func)
            async def async_wrapper(*args, **kwargs):
                key = f"{func.__name__}:{args}:{kwargs}"
                cached_val = get_cache(key)
                if cached_val is not None:
                    return cached_val
                
                result = await func(*args, **kwargs)
                set_cache(key, result, ttl)
                return result
            return async_wrapper
        else:
            @wraps(func)
            def sync_wrapper(*args, **kwargs):
                key = f"{func.__name__}:{args}:{kwargs}"
                cached_val = get_cache(key)
                if cached_val is not None:
                    return cached_val
                
                result = func(*args, **kwargs)
                set_cache(key, result, ttl)
                return result
            return sync_wrapper
    return decorator
