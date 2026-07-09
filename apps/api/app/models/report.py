import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime
from app.models.base import Base

class Report(Base):
    __tablename__ = "reports"

    report_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(100), nullable=False)
    report_type = Column(String(50), nullable=False) # Daily AQI, Weekly, etc.
    file_format = Column(String(20), nullable=False) # PDF, CSV, Excel, JSON
    file_path = Column(String(250), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

class ReportTemplate(Base):
    __tablename__ = "report_templates"

    template_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    sections_config = Column(String(1000), nullable=False) # comma-separated list of modules included
