import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

try:
    from xgboost import XGBRegressor
except ImportError:
    XGBRegressor = None

# Deterministic mappings to avoid shape variation on single row queries
CITY_MAP = {
    "Vijayawada": 0, "Hyderabad": 1, "Bengaluru": 2, "Chennai": 3, "Delhi": 4, 
    "Mumbai": 5, "Kolkata": 6, "Pune": 7, "Ahmedabad": 8, "Visakhapatnam": 9
}
WIND_MAP = {"low": 0, "moderate": 1, "high": 2}
TEMP_MAP = {"cold": 0, "mild": 1, "warm": 2}
HUMID_MAP = {"dry": 0, "normal": 1, "wet": 2}
TREND_MAP = {"decreasing": 0, "stable": 1, "increasing": 2}

def encode_categorical_features(df: pd.DataFrame) -> pd.DataFrame:
    df_enc = df.copy()
    df_enc["city_code"] = df_enc["city"].map(CITY_MAP).fillna(-1)
    df_enc["wind_code"] = df_enc["wind_category"].map(WIND_MAP).fillna(1)
    df_enc["temp_code"] = df_enc["temp_category"].map(TEMP_MAP).fillna(1)
    df_enc["humid_code"] = df_enc["humidity_category"].map(HUMID_MAP).fillna(1)
    df_enc["trend_code"] = df_enc["pollution_trend"].map(TREND_MAP).fillna(1)
    return df_enc

def train_models(df: pd.DataFrame, base_dir: str):
    """Trains multiple modeling options, selecting the optimal configuration."""
    df_enc = encode_categorical_features(df)
    
    # Feature columns
    feature_cols = [
        "city_code", "temperature", "humidity", "wind_speed", 
        "traffic_index", "aqi_lag_1", "aqi_lag_24", 
        "hour", "weekday", "month", "weekend", "is_festival",
        "wind_code", "temp_code", "humid_code", "trend_code"
    ]
    
    X = df_enc[feature_cols]
    y = df_enc["aqi"]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    models = {
        "Linear Regression": LinearRegression(),
        "Random Forest": RandomForestRegressor(n_estimators=50, max_depth=10, random_state=42),
        "Gradient Boosting": GradientBoostingRegressor(n_estimators=50, max_depth=6, random_state=42)
    }
    if XGBRegressor is not None:
        models["XGBoost"] = XGBRegressor(n_estimators=50, max_depth=6, learning_rate=0.1, random_state=42)
    
    best_model_name = ""
    best_r2 = -float("inf")
    best_model = None
    best_metrics = {}
    
    print("\n--- Training Evaluator ---")
    for name, model in models.items():
        model.fit(X_train, y_train)
        preds = model.predict(X_test)
        
        mse = mean_squared_error(y_test, preds)
        rmse = np.sqrt(mse)
        mae = mean_absolute_error(y_test, preds)
        r2 = r2_score(y_test, preds)
        
        print(f"{name}: RMSE={rmse:.2f}, MAE={mae:.2f}, R2={r2:.3f}")
        
        if r2 > best_r2:
            best_r2 = r2
            best_model_name = name
            best_model = model
            best_metrics = {
                "model_name": name,
                "rmse": rmse,
                "mae": mae,
                "r2": r2
            }
            
    print(f"Optimal Model Selected: {best_model_name} (R2={best_r2:.3f})")
    
    # Save best model
    from datetime import datetime
    ver_name = f"v_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    models_dir = os.path.join(base_dir, "saved_models")
    model_path_ver = os.path.join(models_dir, f"forecast_model_{ver_name}.joblib")
    model_path_latest = os.path.join(models_dir, "forecast_model_latest.joblib")
    
    # Save mappings metadata along with model payload
    payload = {
        "model": best_model,
        "feature_cols": feature_cols,
        "metrics": best_metrics,
        "mappings": {
            "city": CITY_MAP,
            "wind": WIND_MAP,
            "temp": TEMP_MAP,
            "humid": HUMID_MAP,
            "trend": TREND_MAP
        }
    }
    
    joblib.dump(payload, model_path_ver)
    joblib.dump(payload, model_path_latest)
    
    print(f"Saved best model payload to {model_path_latest}")
    return X_test, y_test, payload
