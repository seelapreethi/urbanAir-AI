from fastapi import APIRouter, Query
from typing import List, Dict, Any
from app.services.intelligence.intelligence_service import IntelligenceService

router = APIRouter()

@router.get("/summary", tags=["intelligence"])
async def get_intelligence_summary(city: str = Query("Delhi")):
    res = await IntelligenceService.get_summary(city)
    return {
        "success": True,
        "message": "Intelligence summary retrieved successfully",
        "data": res
    }

@router.get("/root-cause", tags=["intelligence"])
async def get_intelligence_root_cause(city: str = Query("Delhi")):
    res = await IntelligenceService.get_root_cause(city)
    return {
        "success": True,
        "message": "Root cause analysis retrieved successfully",
        "data": res
    }

@router.get("/recommendations", tags=["intelligence"])
async def get_intelligence_recommendations(city: str = Query("Delhi")):
    res = await IntelligenceService.get_recommendations(city)
    return {
        "success": True,
        "message": "Ranked interventions retrieved successfully",
        "data": res
    }

@router.get("/timeline", tags=["intelligence"])
async def get_intelligence_timeline(city: str = Query("Delhi")):
    res = await IntelligenceService.get_timeline(city)
    return {
        "success": True,
        "message": "Prognostic timeline logs retrieved successfully",
        "data": res
    }

@router.get("/risks", tags=["intelligence"])
async def get_intelligence_risks(city: str = Query("Delhi")):
    res = await IntelligenceService.get_risks(city)
    return {
        "success": True,
        "message": "Risk intelligence breakdown retrieved successfully",
        "data": res
    }

@router.get("/confidence", tags=["intelligence"])
async def get_intelligence_confidence(city: str = Query("Delhi")):
    res = await IntelligenceService.get_confidence(city)
    return {
        "success": True,
        "message": "Prediction confidence insights retrieved successfully",
        "data": res
    }
