import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from app.models.base import Base

class SourceAttribution(Base):
    __tablename__ = "source_attributions"

    attribution_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    city_id = Column(String(36), ForeignKey("cities.city_id"), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    traffic_pct = Column(Float, default=0.0, nullable=False)
    industry_pct = Column(Float, default=0.0, nullable=False)
    construction_pct = Column(Float, default=0.0, nullable=False)
    waste_burning_pct = Column(Float, default=0.0, nullable=False)
    road_dust_pct = Column(Float, default=0.0, nullable=False)
    other_pct = Column(Float, default=0.0, nullable=False)
    confidence_score = Column(Float, default=85.0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
