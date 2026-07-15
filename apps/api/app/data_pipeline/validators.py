import logging
from datetime import datetime

logger = logging.getLogger(__name__)

def validate_coordinates(lat: float, lon: float) -> bool:
    if not (-90.0 <= lat <= 90.0) or not (-180.0 <= lon <= 180.0):
        logger.warning(f"Validation failure: latitude {lat} or longitude {lon} out of standard bounds.")
        return False
    # Check if empty zero default coords
    if abs(lat) < 0.0001 and abs(lon) < 0.0001:
        return False
    return True

def validate_aqi(aqi: int) -> bool:
    if aqi < 0 or aqi > 500:
        logger.warning(f"Validation failure: AQI index {aqi} out of limits (0 - 500).")
        return False
    return True

def validate_record(record: dict) -> bool:
    """Verifies overall record integrity before saving to DB."""
    try:
        if not record.get("city") or not record.get("timestamp"):
            return False
            
        lat = float(record.get("latitude", 0))
        lon = float(record.get("longitude", 0))
        if not validate_coordinates(lat, lon):
            return False
            
        aqi = int(record.get("aqi", -1))
        if aqi != -1 and not validate_aqi(aqi):
            return False
            
        # Verify timestamp can be parsed
        ts = record["timestamp"]
        if isinstance(ts, str):
            datetime.fromisoformat(ts.replace("Z", "+00:00"))
            
        return True
    except Exception as e:
        logger.warning(f"Record validation exception: {str(e)}")
        return False
