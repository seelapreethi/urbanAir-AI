import os
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def create_ml_directories():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    dirs = [
        "datasets",
        "training",
        "models",
        "features",
        "saved_models",
        "evaluation",
        "utils",
        "training_logs"
    ]
    for d in dirs:
        path = os.path.join(base_dir, d)
        os.makedirs(path, exist_ok=True)
    return base_dir

def generate_historical_data(filepath: str):
    """Generates 30 days of hourly historical air quality data across 10 cities."""
    cities = [
        "Vijayawada", "Hyderabad", "Bengaluru", "Chennai", "Delhi", 
        "Mumbai", "Kolkata", "Pune", "Ahmedabad", "Visakhapatnam"
    ]
    
    # 30 days of hourly data = 720 hours
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30)
    date_range = [start_date + timedelta(hours=i) for i in range(720)]
    
    records = []
    
    np.random.seed(42)
    
    for city in cities:
        # Base pollution profiles
        base_aqi = 310 if city == "Delhi" else 190 if city in ["Mumbai", "Kolkata"] else 120
        
        for dt in date_range:
            # Diurnal traffic variation (two peak congestion spikes)
            hour = dt.hour
            traffic_spike = 1.6 if (8 <= hour <= 10 or 17 <= hour <= 20) else 1.0
            
            # Weather patterns
            temp = 25.0 + 8.0 * np.sin((hour - 6) / 24 * 2 * np.pi) + np.random.normal(0, 1.5)
            humidity = 60.0 - 20.0 * np.sin((hour - 6) / 24 * 2 * np.pi) + np.random.normal(0, 5)
            humidity = max(10.0, min(100.0, humidity))
            
            wind_speed = max(2.0, 12.0 - 4.0 * traffic_spike + np.random.normal(0, 2.0))
            rainfall = max(0.0, np.random.normal(0, 0.5)) if np.random.rand() > 0.9 else 0.0
            
            # AQI model formula
            dispersion = -1.2 * wind_speed
            traffic_load = (traffic_spike - 1.0) * 45.0
            weather_inversion = 20.0 if (temp < 18.0 and humidity > 80.0) else 0.0
            washout = -15.0 if rainfall > 2.0 else 0.0
            
            aqi = int(base_aqi + dispersion + traffic_load + weather_inversion + washout + np.random.normal(0, 15))
            aqi = max(15, min(500, aqi))
            
            # Break down into individual pollutant indicators
            pm2_5 = max(5.0, aqi * 0.6 + np.random.normal(0, 5))
            pm10 = max(10.0, aqi * 0.9 + np.random.normal(0, 8))
            no2 = max(2.0, 15.0 + traffic_spike * 12.0 + np.random.normal(0, 3))
            so2 = max(1.0, 8.0 + (35.0 if base_aqi > 200 else 8.0) * np.random.rand())
            co = max(0.1, 0.4 + traffic_spike * 0.5 + np.random.normal(0, 0.1))
            ozone = max(2.0, 20.0 + (temp - 25.0) * 1.5 + np.random.normal(0, 4))
            
            records.append({
                "timestamp": dt.strftime("%Y-%m-%d %H:%M:%S"),
                "city": city,
                "aqi": aqi,
                "pm2_5": round(pm2_5, 1),
                "pm10": round(pm10, 1),
                "no2": round(no2, 1),
                "so2": round(so2, 1),
                "co": round(co, 2),
                "ozone": round(ozone, 1),
                "temperature": round(temp, 1),
                "humidity": round(humidity, 1),
                "wind_speed": round(wind_speed, 1),
                "rainfall": round(rainfall, 2),
                "traffic_index": round(traffic_spike, 2)
            })
            
    df = pd.DataFrame(records)
    df.to_csv(filepath, index=False)
    print(f"Generated {len(df)} historical rows inside {filepath}")

def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    """Standardizes dataset, handles duplicates, drops missing inputs."""
    # Convert timestamp
    df["timestamp"] = pd.to_datetime(df["timestamp"])
    
    # Remove duplicates
    df = df.drop_duplicates().reset_index(drop=True)
    
    # Fill any empty inputs safely
    df = df.ffill().bfill()
    
    # Ensure AQI limits are standard
    df["aqi"] = df["aqi"].clip(1, 500)
    
    return df
