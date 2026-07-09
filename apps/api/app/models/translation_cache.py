import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime
from app.models.base import Base

class TranslationCache(Base):
    __tablename__ = "translation_cache"

    translation_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    language_code = Column(String(10), nullable=False) # hi, te, ta, kn, mr, bn
    translation_key = Column(String(250), nullable=False)
    translated_text = Column(String(1000), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
