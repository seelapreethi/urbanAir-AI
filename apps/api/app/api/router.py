from fastapi import APIRouter
from app.api import auth, dashboard, map, forecast, source_attribution, enforcement, advisory, chat, scenario, explain, reports

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(map.router, prefix="/map", tags=["map"])
api_router.include_router(forecast.router, prefix="/forecast", tags=["forecast"])
api_router.include_router(source_attribution.router, prefix="/source-attribution", tags=["attribution"])
api_router.include_router(enforcement.router, prefix="/enforcement", tags=["enforcement"])
api_router.include_router(advisory.router, prefix="/advisory", tags=["advisory"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(scenario.router, prefix="/scenario", tags=["scenario"])
api_router.include_router(explain.router, prefix="/explain", tags=["explain"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
