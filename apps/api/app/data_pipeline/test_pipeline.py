import unittest
from datetime import datetime
from app.data_pipeline.validators import validate_coordinates, validate_aqi, validate_record
from app.data_pipeline.normalizers import normalize_weather_data, normalize_openaq_data
from app.data_pipeline.cache import PipelineCacheLayer

class TestDataPipeline(unittest.TestCase):
    def setUp(self):
        PipelineCacheLayer.clear()

    def test_coordinate_validation(self):
        # Valid bounds
        self.assertTrue(validate_coordinates(17.385, 78.486))
        self.assertTrue(validate_coordinates(-90.0, -180.0))
        # Invalid bounds
        self.assertFalse(validate_coordinates(95.0, 78.0))
        self.assertFalse(validate_coordinates(12.0, 200.0))
        self.assertFalse(validate_coordinates(0.0, 0.0)) # zero default check

    def test_aqi_validation(self):
        self.assertTrue(validate_aqi(120))
        self.assertTrue(validate_aqi(0))
        self.assertTrue(validate_aqi(500))
        self.assertFalse(validate_aqi(-10))
        self.assertFalse(validate_aqi(550))

    def test_cache_ttl_and_fallbacks(self):
        # Initial set
        PipelineCacheLayer.set("test_key", "value", ttl=1)
        self.assertEqual(PipelineCacheLayer.get("test_key"), "value")
        
        # Test fallback directly
        self.assertEqual(PipelineCacheLayer.get_fallback("test_key"), "value")

    def test_weather_normalization(self):
        raw = {
            "current": {
                "time": "2026-07-14T20:00:00",
                "temperature_2m": 28.5,
                "relative_humidity_2m": 62,
                "wind_speed_10m": 12.5,
                "surface_pressure": 1008.2,
                "precipitation": 0.5
            }
        }
        res = normalize_weather_data("Delhi", 28.6, 77.2, raw)
        self.assertEqual(res["city"], "Delhi")
        self.assertEqual(res["temperature"], 28.5)
        self.assertEqual(res["humidity"], 62)
        self.assertEqual(res["rainfall"], 0.5)

    def test_openaq_normalization(self):
        raw_openaq = [
            {
                "measurements": [
                    {"parameter": "pm25", "value": 45.0},
                    {"parameter": "pm10", "value": 72.0}
                ]
            }
        ]
        res = normalize_openaq_data("Mumbai", 19.0, 72.8, raw_openaq)
        self.assertEqual(res["city"], "Mumbai")
        self.assertEqual(res["pm2_5"], 45.0)
        self.assertEqual(res["pm10"], 72.0)
        # Expected AQI estimation
        self.assertEqual(res["aqi"], 90) # max(45*2, 72*1)

if __name__ == "__main__":
    unittest.main()
