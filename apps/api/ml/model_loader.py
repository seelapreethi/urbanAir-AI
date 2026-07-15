import os
import logging
import joblib
from app.core.config import settings

logger = logging.getLogger(__name__)

class MLModelLoader:
    _payload = None
    _loaded = False

    @classmethod
    def load_model(cls) -> bool:
        """Attempts to load the model payload from saved_models. Safe fallback on missing files."""
        if not settings.USE_REAL_MODEL:
            logger.info("ML forecasting model disabled by config. Running in Demo Mode.")
            cls._payload = None
            cls._loaded = True
            return False
            
        base_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(base_dir, "saved_models", "forecast_model_latest.joblib")
        
        # MLOps Registry-Aware Loading Check
        try:
            from mlops.registry import ModelRegistryManager
            prod_details = ModelRegistryManager.get_production_version_details()
            if prod_details:
                ver_name = prod_details["version"]
                ver_file = os.path.join(base_dir, "saved_models", f"forecast_model_{ver_name}.joblib")
                if os.path.exists(ver_file):
                    model_path = ver_file
                    logger.info(f"MLOps Loader directing to registered production model: {ver_name}")
        except Exception as e:
            logger.warning(f"Could not check MLOps registry for production model: {e}. Falling back to default latest.")
        
        if not os.path.exists(model_path):
            logger.warning(f"ML model file not found at {model_path}. Running in Demo Mode.")
            cls._payload = None
            cls._loaded = True
            return False
            
        try:
            cls._payload = joblib.load(model_path)
            cls._loaded = True
            logger.info(f"Loaded trained ML forecasting model successfully from {model_path}.")
            return True
        except Exception as e:
            logger.error(f"Error loading forecasting model joblib: {str(e)}. Running in Demo Mode.")
            cls._payload = None
            cls._loaded = True
            return False

    @classmethod
    def get_model_payload(cls, force_reload: bool = False):
        if not cls._loaded or force_reload:
            cls.load_model()
        return cls._payload
