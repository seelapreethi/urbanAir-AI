import logging
from typing import Tuple
from mlops.registry import ModelRegistryManager

logger = logging.getLogger(__name__)

def rollback_production_model() -> Tuple[bool, str]:
    """Rolls back the current production model to the designated rollback version."""
    rollback_ver = ModelRegistryManager.get_rollback_version()
    if not rollback_ver:
        return False, "No rollback target model version found in registry."
        
    # Promote rollback version to production
    reg = ModelRegistryManager._load_registry()
    
    # Locate rollback entry
    target_entry = None
    for v in reg["versions"]:
        if v["version"] == rollback_ver:
            target_entry = v
            break
            
    if not target_entry:
        return False, f"Rollback target {rollback_ver} not found in registry versions list."
        
    # Apply swap
    current_prod = reg["production_version"]
    reg["production_version"] = rollback_ver
    target_entry["status"] = "Production"
    
    # Mark old production as Archived
    for v in reg["versions"]:
        if v["version"] == current_prod:
            v["status"] = "Archived"
            
    reg["rollback_version"] = None # clear single step rollback history pointer
    
    ModelRegistryManager._save_registry(reg)
    msg = f"Successfully rolled back production model from {current_prod} to {rollback_ver}."
    logger.info(msg)
    return True, msg
