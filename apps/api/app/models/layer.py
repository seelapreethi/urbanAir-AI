import uuid
from sqlalchemy import Column, String, Boolean
from app.models.base import Base

class Layer(Base):
    __tablename__ = "map_layers"

    layer_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    layer_name = Column(String(100), nullable=False)
    layer_key = Column(String(50), nullable=False, unique=True)
    category = Column(String(50), nullable=False)
    is_default = Column(Boolean, default=False, nullable=False)
