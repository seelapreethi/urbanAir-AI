# Machine Learning Forecasting Pipeline

This module houses the training datasets, preprocessing pipelines, feature engineering, and serialization models for the UrbanAir AI Forecasting engine.

## Directory Structure

```text
ml/
├── datasets/           # Historical training datasets CSVs
├── evaluation/         # Evaluation reports and diagnostics JSONs
├── saved_models/       # Serialized joblib trained models
├── training_logs/      # Training pipeline logs
├── preprocessing.py    # Standardizes and cleans datasets
├── feature_engineering.py # Generates rolling average, lags, and category bins
├── train.py            # Compares regression models
├── evaluate.py         # Generates RMSE, MAE, R2, MAPE logs
├── predict.py          # Real-time inference parser with fallback hooks
├── model_loader.py     # Singleton memory loader
└── training_pipeline.py # Orchestrator script
```

## Running the Training Pipeline

To trigger mock dataset generation, preprocessing, feature extraction, training, and model serialization:

```bash
cd apps/api
python ml/training_pipeline.py
```

This compiles a versioned `forecast_model_v1.joblib` and symlinks it to `forecast_model_latest.joblib` inside `saved_models/`.

## Fail-Safe Fallback Mechanics

The loader features a singleton `MLModelLoader` class:
1. At application startup, the API attempts to retrieve the model using the serialized joblib file.
2. If `USE_REAL_MODEL` is `False` in config, the file is missing, or python packages are not loaded, it falls back to the deterministic demo simulation and prints `Running in Demo Mode` to the logs.
3. The platform will never throw compile exceptions or crash due to missing machine learning models.
