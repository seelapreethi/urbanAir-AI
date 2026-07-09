import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from app.models.base import Base

class EnforcementAction(Base):
    __tablename__ = "enforcement_actions"

    action_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    city_id = Column(String(36), ForeignKey("cities.city_id"), nullable=False)
    inspection_id = Column(String(36), ForeignKey("inspections.inspection_id"), nullable=True)
    action_type = Column(String(50), nullable=False) # Fine, Citation, Warning, StopWork
    fine_amount = Column(Float, default=0.0, nullable=False)
    violator_name = Column(String(100), nullable=True)
    details = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
