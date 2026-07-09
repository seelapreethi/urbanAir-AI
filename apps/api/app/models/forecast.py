import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey
from app.models.base import Base

class Forecast(Base):
    __tablename__ = "aqi_forecasts"

    forecast_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    city_id = Column(String(36), ForeignKey("cities.city_id"), nullable=False)
    ward_id = Column(String(36), ForeignKey("wards.ward_id"), nullable=True)
    target_timestamp = Column(DateTime, nullable=False)
    predicted_aqi = Column(Integer, nullable=False)
    dominant_pollutant = Column(String(50), nullable=True)
    risk_category = Column(String(20), nullable=True)
    confidence_score = Column(Float, nullable=True)
    model_used = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
