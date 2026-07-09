import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from app.models.base import Base

class Simulation(Base):
    __tablename__ = "simulations"

    simulation_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    scenario_id = Column(String(36), ForeignKey("scenarios.scenario_id"), nullable=False)
    traffic_reduction_pct = Column(Float, default=0.0, nullable=False)
    construction_reduction_pct = Column(Float, default=0.0, nullable=False)
    industrial_emission_pct = Column(Float, default=0.0, nullable=False)
    green_cover_pct = Column(Float, default=0.0, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

class SimulationResult(Base):
    __tablename__ = "simulation_results"

    result_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    simulation_id = Column(String(36), ForeignKey("simulations.simulation_id"), nullable=False)
    before_aqi = Column(Float, nullable=False)
    after_aqi = Column(Float, nullable=False)
    expected_improvement = Column(Float, nullable=False)
    confidence_score = Column(Float, default=92.0, nullable=False)
