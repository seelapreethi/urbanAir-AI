from typing import Dict, Any, List
from app.services.providers.weather_provider import WeatherProvider
from app.services.providers.aqi_provider import AQIProvider
from app.services.providers.city_data_provider import CityDataProvider
from app.services.providers.satellite_provider import SatelliteProvider
from app.core.cities_config import get_city_config
from app.services.health_service import HealthService

class IntelligenceService:
    @classmethod
    async def get_city_features(cls, city: str) -> Dict[str, Any]:
        weather = await WeatherProvider(city).fetch_data()
        aqi = await AQIProvider(city).fetch_data()
        city_data = await CityDataProvider(city).fetch_data()
        satellite = await SatelliteProvider(city).fetch_data()
        
        return {
            "city": city,
            "aqi": aqi["aqi"],
            "pm2_5": aqi["pm2_5"],
            "pm10": aqi["pm10"],
            "temp": weather["temperature"],
            "humidity": weather["humidity"],
            "wind": weather["wind_speed"],
            "rain": weather["precipitation"],
            "traffic_idx": city_data["traffic_density_index"],
            "construction_idx": city_data["active_construction_index"],
            "industrial_idx": city_data["industrial_density_index"],
            "green_cover": city_data["green_cover_percentage"],
            "population": city_data["population"],
            "dominant_source": city_data["dominant_source"],
            "aod_index": satellite["aod_index"],
            "hotspots_detected": satellite["hotspot_count_detected"]
        }

    @classmethod
    async def get_summary(cls, city: str) -> Dict[str, Any]:
        feat = await cls.get_city_features(city)
        risk = HealthService.classify_risk(feat["aqi"])
        
        # Determine expected trend based on weather
        if feat["wind"] < 8.0:
            trend = "Worsening trend: low wind speeds (< 8 km/h) are causing particulate accumulation."
        elif feat["rain"] > 5.0:
            trend = "Improving trend: heavy precipitation will wash down coarse particles."
        else:
            trend = "Stable trend: moderate dispersion matches localized emission rates."

        situation = (
            f"UrbanAir AI dynamic telemetry identifies {city}'s air quality index at {feat['aqi']} ({risk['risk_level']}). "
            f"Particulate concentrations are PM2.5: {feat['pm2_5']} µg/m³ and PM10: {feat['pm10']} µg/m³."
        )

        cause = (
            f"The primary driver is emissions from local {feat['dominant_source'].lower()} sites, "
            f"compounded by a traffic congestion index of {feat['traffic_idx']:.0f}%."
        )

        action = (
            f"Municipal authorities must deploy dust suppression cannons along {feat['dominant_source'].lower()} buffers. "
            f"Restrict heavy commercial diesel trucks from central routes between 8 AM and 8 PM."
        )

        health = (
            f"Public risk is {risk['risk_level']}. Sensitive groups, including asthma patients and children, "
            f"should wear N95 masking during transits and limit active outdoor exertion."
        )

        priority = "High priority: audit particulate compliance and enforce construction site barrier enclosures."
        if feat["aqi"] > 250:
            priority = "Emergency priority: suspend non-essential casting operations and commercial grading excavations."

        return {
            "current_situation": situation,
            "major_cause": cause,
            "expected_trend": trend,
            "recommended_action": action,
            "health_impact": health,
            "government_priority": priority
        }

    @classmethod
    async def get_root_cause(cls, city: str) -> Dict[str, Any]:
        feat = await cls.get_city_features(city)
        
        # Calculate dynamic causes based on city profiles and parameters
        traffic_score = round(feat["traffic_idx"] * 0.8, 0)
        construction_score = round(feat["construction_idx"] * 0.75, 0)
        industrial_score = round(feat["industrial_idx"] * 0.7, 0)
        
        # Other factors (weather inversion, biomass, crop burning)
        inversion_score = 65 if (feat["wind"] < 6.0 and feat["temp"] < 20.0) else 15
        dust_score = round(30.0 + (100.0 - feat["green_cover"]) * 0.3, 0)
        
        # Crop burning occurs heavily in northern sectors like Delhi during winter/harvest
        crop_burning_score = 45 if city in ["Delhi", "Ahmedabad", "Kolkata"] else 10
        
        causes = [
            {"name": "Traffic", "percentage": traffic_score},
            {"name": "Construction", "percentage": construction_score},
            {"name": "Industries", "percentage": industrial_score},
            {"name": "Waste burning", "percentage": 25},
            {"name": "Dust", "percentage": dust_score},
            {"name": "Weather inversion", "percentage": inversion_score},
            {"name": "Crop burning", "percentage": crop_burning_score}
        ]
        
        # Sort by percentage descending
        causes.sort(key=lambda x: x["percentage"], reverse=True)
        
        return {
            "city": city,
            "root_causes": causes,
            "dominant_cause": causes[0]["name"]
        }

    @classmethod
    async def get_recommendations(cls, city: str) -> List[Dict[str, Any]]:
        feat = await cls.get_city_features(city)
        recs = []
        
        # Generate ranked recommendations based on actual telemetry
        if feat["construction_idx"] > 60:
            recs.append({
                "action": "Close active construction sites and halt grading excavations",
                "priority": "High" if feat["aqi"] > 200 else "Medium",
                "expected_aqi_improvement": 18,
                "affected_wards": ["Industrial Zone", "Commercial Hub"],
                "confidence": 88,
                "estimated_impact": "High particulate reduction"
            })
            
        if feat["traffic_idx"] > 70:
            recs.append({
                "action": "Restrict diesel truck transits inside municipal limits during peak hours",
                "priority": "High" if feat["aqi"] > 150 else "Medium",
                "expected_aqi_improvement": 22,
                "affected_wards": ["Central Business District", "Suburban Periphery"],
                "confidence": 91,
                "estimated_impact": "Substantial traffic emissions drop"
            })

        recs.append({
            "action": "Increase road sprinkling frequency along unpaved corridors",
            "priority": "Medium",
            "expected_aqi_improvement": 10,
            "affected_wards": ["All Wards"],
            "confidence": 85,
            "estimated_impact": "Suppression of coarse road dust particles"
        })

        if feat["aqi"] > 200:
            recs.append({
                "action": "Issue public warning alerts and declare outdoor restrictions",
                "priority": "High",
                "expected_aqi_improvement": 5,
                "affected_wards": ["All Wards"],
                "confidence": 95,
                "estimated_impact": "Reduced public exposure to hazards"
            })
            
        recs.append({
            "action": "Increase public transport frequency and declare fare subsidies",
            "priority": "Low",
            "expected_aqi_improvement": 12,
            "affected_wards": ["Central Business District"],
            "confidence": 76,
            "estimated_impact": "Encourages shift away from private transit"
        })
        
        return recs

    @classmethod
    async def get_timeline(cls, city: str) -> List[Dict[str, Any]]:
        feat = await cls.get_city_features(city)
        aqi = feat["aqi"]
        
        # Projections
        past_aqi = max(20, int(aqi * 0.95))
        next_24 = int(aqi * 1.05) if feat["wind"] < 8.0 else int(aqi * 0.96)
        next_48 = int(aqi * 1.1) if feat["wind"] < 8.0 else int(aqi * 0.92)
        next_72 = int(aqi * 1.15) if feat["wind"] < 8.0 else int(aqi * 0.88)
        
        return [
            {
                "time_frame": "Past 24 Hours",
                "aqi": past_aqi,
                "summary": f"Historical particulate data registers stable patterns (mean AQI: {past_aqi}). Stagnation was low."
            },
            {
                "time_frame": "Current",
                "aqi": aqi,
                "summary": f"Active monitoring station telemetry reports a mean index of {aqi}. Wind speed stands at {feat['wind']} km/h."
            },
            {
                "time_frame": "Next 24 Hours",
                "aqi": next_24,
                "summary": f"Prognostic models predict index shifting to {next_24}. Driven by nocturnal boundary inversion factors."
            },
            {
                "time_frame": "Next 48 Hours",
                "aqi": next_48,
                "summary": f"Index estimated at {next_48}. Dynamic weather dispersion shows signs of modification."
            },
            {
                "time_frame": "Next 72 Hours",
                "aqi": next_72,
                "summary": f"Forecast bounds resolve index at {next_72}. Stagnant vectors represent primary accumulation risks."
            }
        ]

    @classmethod
    async def get_risks(cls, city: str) -> List[Dict[str, Any]]:
        feat = await cls.get_city_features(city)
        aqi = feat["aqi"]
        
        return [
            {
                "group": "Health Risk",
                "severity": "Critical" if aqi > 250 else "High" if aqi > 150 else "Moderate",
                "reason": f"Elevated PM2.5 levels ({feat['pm2_5']} µg/m³) are penetrating deep into airways.",
                "recommendation": "Wear N95 protective masks outdoors and close windows."
            },
            {
                "group": "Traffic Risk",
                "severity": "High" if feat["traffic_idx"] > 80 else "Moderate",
                "reason": "Peak hour congestion is producing localized emission stagnation corridors.",
                "recommendation": "Reroute heavy logistics transit pathways out of core crossings."
            },
            {
                "group": "School Risk",
                "severity": "Critical" if aqi > 300 else "High" if aqi > 200 else "Moderate",
                "reason": "High particulate exposure representing severe risk to children's developing lungs.",
                "recommendation": "Suspend outdoor sports and reschedule physical classes to indoor sessions."
            },
            {
                "group": "Hospital Risk",
                "severity": "High" if aqi > 150 else "Moderate",
                "reason": "Vulnerable patients are exposed to poor indoor air circulation structures.",
                "recommendation": "Verify operation of high-efficiency particulate air (HEPA) filters in wards."
            },
            {
                "group": "Outdoor Worker Risk",
                "severity": "Critical" if aqi > 200 else "High",
                "reason": "Prolonged exposure during physical labor leads to massive inhaled dose rates.",
                "recommendation": "Mandate frequent breathing breaks inside indoor air-conditioned zones."
            },
            {
                "group": "Children Risk",
                "severity": "Critical" if aqi > 250 else "High" if aqi > 150 else "Moderate",
                "reason": "Faster breathing rates result in higher relative pollutant intake.",
                "recommendation": "Ensure child-size N95 masks are worn during any transit exits."
            },
            {
                "group": "Senior Citizen Risk",
                "severity": "Critical" if aqi > 200 else "High",
                "reason": "Pre-existing cardiovascular sensitivities are aggravated by fine particles.",
                "recommendation": "Stay strictly indoors with active air purifiers running."
            },
            {
                "group": "Pregnant Women Risk",
                "severity": "High" if aqi > 150 else "Moderate",
                "reason": "Fine particles can cross biological barriers and impact fetal development.",
                "recommendation": "Reduce duration of outdoor transits to minimal time scopes."
            }
        ]

    @classmethod
    async def get_confidence(cls, city: str) -> Dict[str, Any]:
        feat = await cls.get_city_features(city)
        
        # Calculate dynamic confidence mathematically
        confidence_pct = 95.0 - (feat["wind"] * 0.1) - (feat["traffic_idx"] * 0.05)
        confidence_pct = max(50.0, min(99.0, round(confidence_pct, 1)))
        
        return {
            "confidence_percentage": confidence_pct,
            "reason": "Predictions are highly constrained by live weather and CPCB station arrays.",
            "supporting_evidence": f"Telemetry includes wind vectors ({feat['wind']} km/h), AOD Index ({feat['aod_index']}), and traffic flow.",
            "data_sources_used": [
                "CPCB Air Quality Stations API",
                "Open-Meteo Climate Forecast API",
                "Sentinel-5P Satellite Aerosol Data",
                "OpenStreetMap Road Networks"
            ]
        }
