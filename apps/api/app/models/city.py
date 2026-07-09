import uuid
from datetime import datetime
from sqlalchemy import Column, String, BigInteger, Numeric, Boolean, DateTime
from geoalchemy2 import Geometry
from app.models.base import Base


class City(Base):
    __tablename__ = "cities"

    city_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    city_name = Column(String(100), nullable=False)
    state_name = Column(String(100), nullable=False)
    country_name = Column(String(100), nullable=False)
    population = Column(BigInteger, nullable=True)
    area_sq_km = Column(Numeric, nullable=True)
    climate_zone = Column(String(50), nullable=True)
    timezone = Column(String(50), nullable=False, default="UTC")
    boundary = Column(Geometry(geometry_type="MULTIPOLYGON", srid=4326), nullable=True)
    centroid = Column(Geometry(geometry_type="POINT", srid=4326), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
