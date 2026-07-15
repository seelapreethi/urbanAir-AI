import pandas as pd
import numpy as np

def create_features(df: pd.DataFrame) -> pd.DataFrame:
    """Calculates rolling averages, lag features, dates, and binned climate metadata."""
    # Ensure ordered by city and timestamp to prevent offset bleeding
    df = df.sort_values(by=["city", "timestamp"]).reset_index(drop=True)
    
    # Lags (Grouped by City)
    df["aqi_lag_1"] = df.groupby("city")["aqi"].shift(1)
    df["aqi_lag_24"] = df.groupby("city")["aqi"].shift(24)
    
    # Rolling averages (Grouped by City)
    df["aqi_roll_mean_24"] = df.groupby("city")["aqi"].transform(lambda x: x.rolling(24, min_periods=1).mean())
    df["aqi_roll_mean_168"] = df.groupby("city")["aqi"].transform(lambda x: x.rolling(168, min_periods=1).mean())
    
    # DateTime decomposition
    df["hour"] = df["timestamp"].dt.hour
    df["weekday"] = df["timestamp"].dt.weekday
    df["month"] = df["timestamp"].dt.month
    df["weekend"] = (df["weekday"] >= 5).astype(int)
    
    # Binned Weather categories
    # 1. Wind Category: Low (< 5 km/h), Moderate (5 - 15), High (> 15)
    df["wind_category"] = pd.cut(
        df["wind_speed"],
        bins=[-np.inf, 5.0, 15.0, np.inf],
        labels=["low", "moderate", "high"]
    ).astype(str)
    
    # 2. Temperature Category: Cold (< 18), Mild (18 - 28), Warm (> 28)
    df["temp_category"] = pd.cut(
        df["temperature"],
        bins=[-np.inf, 18.0, 28.0, np.inf],
        labels=["cold", "mild", "warm"]
    ).astype(str)
    
    # 3. Humidity Category: Dry (< 40%), Normal (40% - 70%), Wet (> 70%)
    df["humidity_category"] = pd.cut(
        df["humidity"],
        bins=[-np.inf, 40.0, 70.0, np.inf],
        labels=["dry", "normal", "wet"]
    ).astype(str)
    
    # Pollution trend indicator: compare lag 1 and roll mean 24
    df["pollution_trend"] = np.where(
        df["aqi_lag_1"] > df["aqi_roll_mean_24"] * 1.05, "increasing",
        np.where(df["aqi_lag_1"] < df["aqi_roll_mean_24"] * 0.95, "decreasing", "stable")
    )
    
    # Festival indicator placeholder
    # Setting true for late October/early November (standard Diwali window placeholder)
    df["is_festival"] = ((df["month"] == 10) & (df["timestamp"].dt.day >= 20) | (df["month"] == 11) & (df["timestamp"].dt.day <= 15)).astype(int)
    
    # Impute first items (which get NaN from lag shifts) with local forward-fill
    df = df.ffill().bfill()
    
    return df
