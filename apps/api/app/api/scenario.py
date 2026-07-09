from fastapi import APIRouter, Query, Body
from typing import List, Dict, Any
from app.services.simulation_service import SimulationService

router = APIRouter()

CITY_BASE_AQIS = {
    "Vijayawada": 142,
    "Hyderabad": 195,
    "Bengaluru": 85,
    "Chennai": 110,
    "Delhi": 280
}

@router.get("", tags=["scenario"])
def get_scenarios_list():
    return [
        {"id": "scen-1", "name": "Restrict Heavy Vehicles", "description": "Restrict multi-axle transit between 8 AM and 8 PM."},
        {"id": "scen-2", "name": "Close Construction Sites", "description": "Enforce complete dust barriers and halt grading excavations."},
        {"id": "scen-3", "name": "Increase green cover by 15%", "description": "Deploy road-median plants and tree buffers."},
        {"id": "scen-4", "name": "Odd-Even Traffic Rule", "description": "Mandate alternate day license plate driving restrictions."}
    ]

@router.get("/results", tags=["scenario"])
def get_scenario_results(city: str = Query("Vijayawada")):
    # Returns last run results caches
    base = CITY_BASE_AQIS.get(city, CITY_BASE_AQIS["Vijayawada"])
    return SimulationService.run_simulation(base, 25.0, 10.0, 0.0, 5.0, 12.0, 0.0)

@router.post("/run", tags=["scenario"])
def run_scenario_simulation(
    city: str = Body("Vijayawada", embed=True),
    traffic_reduction: float = Body(0.0, embed=True),
    construction_reduction: float = Body(0.0, embed=True),
    industrial_emission: float = Body(0.0, embed=True),
    green_cover: float = Body(0.0, embed=True),
    wind_speed: float = Body(12.0, embed=True),
    rainfall: float = Body(0.0, embed=True)
):
    base_aqi = CITY_BASE_AQIS.get(city, CITY_BASE_AQIS["Vijayawada"])
    res = SimulationService.run_simulation(
        base_aqi,
        traffic_reduction,
        construction_reduction,
        industrial_emission,
        green_cover,
        wind_speed,
        rainfall
    )
    
    return {
        "status": "Success",
        "inputs": {
            "city": city,
            "traffic_reduction": traffic_reduction,
            "construction_reduction": construction_reduction,
            "industrial_emission": industrial_emission,
            "green_cover": green_cover,
            "wind_speed": wind_speed,
            "rainfall": rainfall
        },
        "results": res
    }
