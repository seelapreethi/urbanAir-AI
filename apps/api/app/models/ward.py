import uuid
from datetime import datetime
from sqlalchemy import Column, String, BigInteger, Numeric, ForeignKey, DateTime
from geoalchemy2 import Geometry
from app.models.base import Base


class Ward(Base):
    __tablename__ = "wards"

    ward_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    city_id = Column(String(36), ForeignKey("cities.city_id"), nullable=False)
    ward_code = Column(String(30), nullable=False)
    ward_name = Column(String(100), nullable=False)
    population = Column(BigInteger, nullable=True)
    area_sq_km = Column(Numeric, nullable=True)
    boundary = Column(Geometry(geometry_type="MULTIPOLYGON", srid=4326), nullable=True)
    centroid = Column(Geometry(geometry_type="POINT", srid=4326), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
