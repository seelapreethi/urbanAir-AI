import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from app.models.base import Base

class HealthAdvisory(Base):
    __tablename__ = "health_advisories"

    advisory_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    city_id = Column(String(36), ForeignKey("cities.city_id"), nullable=False)
    user_group = Column(String(50), nullable=False) # Asthma Patients, Senior Citizens, etc.
    risk_level = Column(String(30), nullable=False) # Low Risk, Moderate Risk, etc.
    recommendations_text = Column(String(1000), nullable=False)
    confidence_score = Column(Float, default=95.0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
