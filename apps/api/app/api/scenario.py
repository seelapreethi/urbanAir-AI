from fastapi import APIRouter, Query, Body
from typing import List, Dict, Any
from app.services.simulation_service import SimulationService
from app.services.providers.aqi_provider import AQIProvider
from app.services.providers.weather_provider import WeatherProvider

router = APIRouter()

@router.get("", tags=["scenario"])
def get_scenarios_list():
    return [
        {"id": "scen-1", "name": "Restrict Heavy Vehicles", "description": "Restrict multi-axle transit between 8 AM and 8 PM."},
        {"id": "scen-2", "name": "Close Construction Sites", "description": "Enforce complete dust barriers and halt grading excavations."},
        {"id": "scen-3", "name": "Increase green cover by 15%", "description": "Deploy road-median plants and tree buffers."},
        {"id": "scen-4", "name": "Odd-Even Traffic Rule", "description": "Mandate alternate day license plate driving restrictions."}
    ]

@router.get("/results", tags=["scenario"])
async def get_scenario_results(city: str = Query("Delhi")):
    aqi_data = await AQIProvider(city).fetch_data()
    weather_data = await WeatherProvider(city).fetch_data()
    base_aqi = aqi_data["aqi"]
    wind_speed = weather_data["wind_speed"]
    
    return SimulationService.run_simulation(
        base_aqi, 25.0, 10.0, 0.0, 5.0, wind_speed, 0.0
    )

@router.post("/run", tags=["scenario"])
async def run_scenario_simulation(
    city: str = Body("Delhi", embed=True),
    traffic_reduction: float = Body(0.0, embed=True),
    construction_reduction: float = Body(0.0, embed=True),
    industrial_emission: float = Body(0.0, embed=True),
    green_cover: float = Body(0.0, embed=True),
    wind_speed: float = Body(12.0, embed=True),
    rainfall: float = Body(0.0, embed=True)
):
    aqi_data = await AQIProvider(city).fetch_data()
    base_aqi = aqi_data["aqi"]
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
