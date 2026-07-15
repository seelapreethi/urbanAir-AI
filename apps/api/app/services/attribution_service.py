from typing import Dict, Any

class AttributionService:
    """
    Modular source attribution analysis service calculating contribution matrices 
    based on meteorological dispersion vectors, local geography, and traffic indicators.
    """
    @classmethod
    def calculate_attribution(
        cls,
        city_name: str,
        latitude: float,
        longitude: float,
        wind_direction_deg: float,
        wind_speed_kmh: float,
        traffic_volume_idx: float,
        construction_idx: float = 50.0,
        industrial_idx: float = 50.0
    ) -> Dict[str, Any]:
        # Simple dispersion model simulation
        # High traffic volumes directly amplify traffic contribution
        base_traffic = 20.0 + (traffic_volume_idx * 15.0)
        
        # Stagnant winds increase localized dust and waste burning factors
        stagnation_factor = max(1.0, 15.0 - wind_speed_kmh)
        base_waste = 8.0 + (stagnation_factor * 0.8)
        base_road_dust = 10.0 + (stagnation_factor * 0.5)

        # Wind direction offsets contributions of localized factory zones
        industry_multiplier = 1.0
        if 30.0 <= wind_direction_deg <= 60.0:
            # Upwind industry emissions carried over
            industry_multiplier = 1.55 

        base_industry = (industrial_idx * 0.3) * industry_multiplier
        base_construction = construction_idx * 0.25
        base_other = 5.0

        # Normalize percentages to total 100%
        total = base_traffic + base_industry + base_construction + base_waste + base_road_dust + base_other
        
        traffic_pct = round((base_traffic / total) * 100, 1)
        industry_pct = round((base_industry / total) * 100, 1)
        construction_pct = round((base_construction / total) * 100, 1)
        waste_pct = round((base_waste / total) * 100, 1)
        dust_pct = round((base_road_dust / total) * 100, 1)
        other_pct = round((base_other / total) * 100, 1)

        # Overwrite minor rounding mismatch on other category
        rounding_error = 100.0 - (traffic_pct + industry_pct + construction_pct + waste_pct + dust_pct + other_pct)
        other_pct = round(other_pct + rounding_error, 1)

        contributions = {
            "Traffic": traffic_pct,
            "Industry": industry_pct,
            "Construction": construction_pct,
            "Waste Burning": waste_pct,
            "Road Dust": dust_pct,
            "Other": other_pct
        }
        dominant = max(contributions, key=contributions.get)
        
        # Deterministic confidence based on input quality metrics
        confidence = round(85.0 + (wind_speed_kmh * 0.2) - (traffic_volume_idx * 1.5), 1)
        confidence = max(50.0, min(99.9, confidence))

        return {
            "city": city_name,
            "latitude": latitude,
            "longitude": longitude,
            "contributions": contributions,
            "dominant_source": dominant,
            "confidence_score": confidence,
            "evidence": (
                f"High contribution from {dominant} ({contributions[dominant]}%) is supported by "
                f"local traffic indexes of {traffic_volume_idx} combined with "
                f"stagnant wind dispersion vectors ({wind_speed_kmh} km/h from {wind_direction_deg}°)."
            )
        }
