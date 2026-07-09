import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey
from app.models.base import Base

class PredictionHistory(Base):
    __tablename__ = "prediction_history"

    history_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    city_id = Column(String(36), ForeignKey("cities.city_id"), nullable=False)
    timestamp = Column(DateTime, nullable=False)
    model_name = Column(String(50), nullable=False)
    predicted_aqi = Column(Integer, nullable=False)
    actual_aqi = Column(Integer, nullable=True)
    confidence_score = Column(Float, nullable=True)
    feature_importance_json = Column(String(500), nullable=True) # Serialized JSON string for weights
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
