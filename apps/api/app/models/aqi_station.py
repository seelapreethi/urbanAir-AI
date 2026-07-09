import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey
from app.models.base import Base

class AQIStation(Base):
    __tablename__ = "aqi_stations"

    station_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    city_id = Column(String(36), ForeignKey("cities.city_id"), nullable=False)
    station_name = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    aqi = Column(Integer, nullable=True)
    dominant_pollutant = Column(String(50), nullable=True)
    temp = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    wind_speed = Column(Float, nullable=True)
    last_updated = Column(DateTime, default=datetime.utcnow, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
