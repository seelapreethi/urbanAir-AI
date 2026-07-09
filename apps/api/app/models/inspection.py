import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from app.models.base import Base

class Inspection(Base):
    __tablename__ = "inspections"

    inspection_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    city_id = Column(String(36), ForeignKey("cities.city_id"), nullable=False)
    hotspot_id = Column(String(36), nullable=True)
    target_name = Column(String(100), nullable=False)
    priority_level = Column(String(20), nullable=False) # Critical, High, Medium, Low
    assigned_officer = Column(String(100), nullable=True)
    status = Column(String(30), default="Pending", nullable=False) # Pending, In_Progress, Completed
    route_order = Column(Integer, default=1, nullable=False)
    recommended_action = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    completed_at = Column(DateTime, nullable=True)
