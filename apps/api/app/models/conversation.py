import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime
from app.models.base import Base

class Conversation(Base):
    __tablename__ = "conversations"

    conversation_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(100), default="New Discussion", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
