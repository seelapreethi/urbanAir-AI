import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey
from app.models.base import Base

class Recommendation(Base):
    __tablename__ = "forecast_recommendations"

    recommendation_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    city_id = Column(String(36), ForeignKey("cities.city_id"), nullable=False)
    action_text = Column(String(255), nullable=False)
    priority = Column(String(20), nullable=True) # High, Medium, Low
    expected_aqi_improvement = Column(Integer, nullable=True)
    confidence_score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
