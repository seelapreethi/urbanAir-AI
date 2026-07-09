import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime
from app.models.base import Base

class Scenario(Base):
    __tablename__ = "scenarios"

    scenario_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    description = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
