import os
import json
import logging
from datetime import datetime
from typing import Dict, Any, List, Optional

logger = logging.getLogger(__name__)

REGISTRY_FILE = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "ml", "saved_models", "model_registry.json"
)

class ModelRegistryManager:
    @classmethod
    def _load_registry(cls) -> Dict[str, Any]:
        if not os.path.exists(REGISTRY_FILE):
            os.makedirs(os.path.dirname(REGISTRY_FILE), exist_ok=True)
            # Create standard base registry structure
            initial = {
                "versions": [],
                "production_version": None,
                "rollback_version": None
            }
            cls._save_registry(initial)
            return initial
            
        try:
            with open(REGISTRY_FILE, "r") as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Failed to read model registry file: {e}")
            return {"versions": [], "production_version": None, "rollback_version": None}

    @classmethod
    def _save_registry(cls, data: dict):
        try:
            with open(REGISTRY_FILE, "w") as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            logger.error(f"Failed to write model registry: {e}")

    @classmethod
    def register_model(
        cls, 
        version: str, 
        algorithm: str, 
        rmse: float, 
        mae: float, 
        r2: float, 
        dataset_version: str = "v1"
    ) -> Dict[str, Any]:
        """Registers a newly trained model candidate to the registry index."""
        reg = cls._load_registry()
        
        # Check if version already exists
        for v in reg["versions"]:
            if v["version"] == version:
                return v

        entry = {
            "version": version,
            "algorithm": algorithm,
            "training_date": datetime.now().isoformat(),
            "dataset_version": dataset_version,
            "metrics": {
                "rmse": rmse,
                "mae": mae,
                "r2": r2
            },
            "status": "Staging"
        }
        
        reg["versions"].append(entry)
        cls._save_registry(reg)
        logger.info(f"Registered model version {version} to registry.")
        return entry

    @classmethod
    def set_production(cls, version: str) -> bool:
        """Sets the production pointer to the target version, storing rollback states."""
        reg = cls._load_registry()
        
        target = None
        for v in reg["versions"]:
            if v["version"] == version:
                target = v
                break
                
        if not target:
            logger.warning(f"Failed to set production: version {version} not found.")
            return False
            
        # Move previous production to Archived
        prev_prod = reg["production_version"]
        if prev_prod:
            reg["rollback_version"] = prev_prod
            for v in reg["versions"]:
                if v["version"] == prev_prod:
                    v["status"] = "Archived"
                    
        # Promote target
        target["status"] = "Production"
        reg["production_version"] = version
        
        cls._save_registry(reg)
        logger.info(f"Promoted version {version} to active Production model.")
        return True

    @classmethod
    def get_production_version_details(cls) -> Optional[Dict[str, Any]]:
        reg = cls._load_registry()
        prod = reg["production_version"]
        if not prod:
            return None
        for v in reg["versions"]:
            if v["version"] == prod:
                return v
        return None

    @classmethod
    def get_history(cls) -> List[Dict[str, Any]]:
        reg = cls._load_registry()
        return reg["versions"]

    @classmethod
    def get_rollback_version(cls) -> Optional[str]:
        reg = cls._load_registry()
        return reg.get("rollback_version")
