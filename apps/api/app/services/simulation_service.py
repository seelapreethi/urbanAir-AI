from typing import Dict, Any

class SimulationService:
    """
    Simulation intelligence engine computing the mathematical effects of policy 
    interventions (traffic, construction, greening) on localized air column models.
    """
    @classmethod
    def run_simulation(
        cls, 
        base_aqi: int,
        traffic_red_pct: float,
        construction_red_pct: float,
        industrial_red_pct: float,
        green_cover_add_pct: float,
        wind_speed_kmh: float,
        rainfall_mm: float
    ) -> Dict[str, Any]:
        # Compute reduction weights
        # Traffic accounts for max 40% of standard baseline emissions.
        # Construction accounts for max 20%.
        # Industrial activity accounts for max 25%.
        # Rainfall and wind speed act as positive dispersion multipliers.
        
        traffic_gain = (traffic_red_pct / 100.0) * 0.40 * base_aqi
        construction_gain = (construction_red_pct / 100.0) * 0.20 * base_aqi
        industrial_gain = (industrial_red_pct / 100.0) * 0.25 * base_aqi
        greening_gain = (green_cover_add_pct / 100.0) * 0.15 * base_aqi
        
        weather_dispersion = 0.0
        if wind_speed_kmh > 15:
            weather_dispersion += (wind_speed_kmh - 15) * 1.5
        if rainfall_mm > 0:
            weather_dispersion += min(rainfall_mm * 4.0, 30.0) # wash-out effect cap

        total_reduction = traffic_gain + construction_gain + industrial_gain + greening_gain + weather_dispersion
        total_reduction = min(total_reduction, base_aqi - 20) # absolute floor AQI is 20
        
        after_aqi = max(20, round(base_aqi - total_reduction))
        improvement = round(base_aqi - after_aqi)
        
        # Classify outcomes
        confidence = 94.2 - (0.05 * abs(wind_speed_kmh - 12))
        pop_saved = round(improvement * 0.65, 1)

        recommendation = ""
        if traffic_gain >= max(construction_gain, industrial_gain):
            recommendation = "Traffic restrictions yield the greatest marginal reduction capacity for this parameter set."
        elif construction_gain >= max(traffic_gain, industrial_gain):
            recommendation = "Construction control is more effective than standard heavy vehicle scheduling today."
        else:
            recommendation = "Industrial scrubbing inspection is recommended as the prime baseline cleanup driver."

        return {
            "before_aqi": base_aqi,
            "after_aqi": after_aqi,
            "expected_improvement": improvement,
            "affected_population_saved_pct": pop_saved,
            "confidence_score": round(confidence, 1),
            "recommendation_text": recommendation,
            "environmental_gain": "Positive" if improvement > 10 else "Neutral"
        }
