import os
import sys
import logging
import pandas as pd

# Add current path to import local modules
base_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, base_dir)

from preprocessing import create_ml_directories, generate_historical_data, clean_data
from feature_engineering import create_features
from train import train_models
from evaluate import evaluate_and_report

def run_pipeline():
    # 1. Setup folders
    base_dir = create_ml_directories()
    
    # 2. Setup logging
    log_file = os.path.join(base_dir, "training_logs", "training.log")
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(message)s",
        handlers=[
            logging.FileHandler(log_file),
            logging.StreamHandler(sys.stdout)
        ]
    )
    logger = logging.getLogger("training_pipeline")
    logger.info("Initializing ML Forecasting Training Pipeline...")
    
    # 3. Generate datasets
    data_path = os.path.join(base_dir, "datasets", "historical_aqi.csv")
    if not os.path.exists(data_path):
        logger.info("Generating mock CPCB historical dataset...")
        generate_historical_data(data_path)
        
    # 4. Load & preprocess
    logger.info("Loading and cleaning datasets...")
    df = pd.read_csv(data_path)
    df_clean = clean_data(df)
    
    # 5. Feature engineering
    logger.info("Creating lag and rolling averages features...")
    df_features = create_features(df_clean)
    
    # 6. Train models
    logger.info("Training comparison models (Linear Regression, Random Forest, Gradient Boosting)...")
    X_test, y_test, payload = train_models(df_features, base_dir)
    
    # 7. Evaluate
    logger.info("Evaluating selected model and writing report...")
    report = evaluate_and_report(X_test, y_test, payload, base_dir)
    
    logger.info("Training pipeline completed successfully.")
    logger.info(f"Model selected: {report['model_architecture']}")
    logger.info(f"R2 Performance Score: {report['evaluation_metrics']['r2_coefficient_of_determination']:.3f}")

if __name__ == "__main__":
    run_pipeline()
