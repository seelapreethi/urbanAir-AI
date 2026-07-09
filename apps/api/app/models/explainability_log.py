import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime
from app.models.base import Base

class ExplainabilityLog(Base):
    __tablename__ = "explainability_logs"

    log_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    model_name = Column(String(100), nullable=False)
    feature_name = Column(String(50), nullable=False)
    importance_score = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
