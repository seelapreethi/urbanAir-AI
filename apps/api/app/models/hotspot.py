import uuid
from sqlalchemy import Column, String, Float, ForeignKey
from app.models.base import Base

class Hotspot(Base):
    __tablename__ = "pollution_hotspots"

    hotspot_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    city_id = Column(String(36), ForeignKey("cities.city_id"), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    risk_level = Column(String(20), nullable=False)
    severity = Column(Float, nullable=True)
    estimated_source = Column(String(100), nullable=True)
    confidence_score = Column(Float, nullable=True)
    radius = Column(Float, default=1000.0, nullable=False)
