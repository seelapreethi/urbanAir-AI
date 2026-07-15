import unittest
import os
from mlops.registry import ModelRegistryManager
from mlops.promotion import evaluate_model_promotion
from mlops.rollback import rollback_production_model
from mlops.monitoring import check_data_drift

class TestMLOpsPipeline(unittest.TestCase):
    def setUp(self):
        # Access internals to reset testing index state
        reg = ModelRegistryManager._load_registry()
        reg["versions"] = []
        reg["production_version"] = None
        reg["rollback_version"] = None
        ModelRegistryManager._save_registry(reg)

    def test_model_registration(self):
        entry = ModelRegistryManager.register_model(
            version="v_test_1",
            algorithm="XGBRegressor",
            rmse=15.5,
            mae=12.0,
            r2=0.93
        )
        self.assertEqual(entry["version"], "v_test_1")
        self.assertEqual(entry["status"], "Staging")
        
        history = ModelRegistryManager.get_history()
        self.assertEqual(len(history), 1)

    def test_model_promotion_rules(self):
        # 1. Baseline promotion (first model always promoted)
        ModelRegistryManager.register_model("v_baseline", "XGBRegressor", 18.0, 14.0, 0.91)
        promoted, msg = evaluate_model_promotion("v_baseline")
        self.assertTrue(promoted)
        self.assertEqual(ModelRegistryManager.get_production_version_details()["version"], "v_baseline")
        
        # 2. Rejected promotion (metrics do not improve)
        ModelRegistryManager.register_model("v_worse", "XGBRegressor", 19.5, 15.0, 0.90)
        promoted, msg = evaluate_model_promotion("v_worse")
        self.assertFalse(promoted)
        self.assertEqual(ModelRegistryManager.get_production_version_details()["version"], "v_baseline")
        
        # 3. Successful promotion (metrics are strictly improved)
        ModelRegistryManager.register_model("v_better", "XGBRegressor", 16.0, 12.5, 0.93)
        promoted, msg = evaluate_model_promotion("v_better")
        self.assertTrue(promoted)
        self.assertEqual(ModelRegistryManager.get_production_version_details()["version"], "v_better")

    def test_safe_rollback_swaps(self):
        # Setup history sequence
        ModelRegistryManager.register_model("v_old", "XGBRegressor", 18.0, 14.0, 0.91)
        evaluate_model_promotion("v_old")
        
        ModelRegistryManager.register_model("v_new", "XGBRegressor", 15.0, 11.0, 0.94)
        evaluate_model_promotion("v_new")
        
        # Verify rollback setup
        self.assertEqual(ModelRegistryManager.get_rollback_version(), "v_old")
        
        # Trigger rollback
        success, msg = rollback_production_model()
        self.assertTrue(success)
        self.assertEqual(ModelRegistryManager.get_production_version_details()["version"], "v_old")

    def test_drift_indicators(self):
        # Normal bounds
        self.assertFalse(check_data_drift(100.0, 110.0))
        # Exceeds 20% shift limits
        self.assertTrue(check_data_drift(100.0, 125.0))

if __name__ == "__main__":
    unittest.main()
