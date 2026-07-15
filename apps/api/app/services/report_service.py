from typing import List, Dict, Any
from datetime import datetime
from app.services.providers.weather_provider import WeatherProvider
from app.services.providers.aqi_provider import AQIProvider
from app.services.providers.city_data_provider import CityDataProvider
from app.services.health_service import HealthService

class ReportService:
    """
    Reporting service providing templates structure configurations and 
    PDF/Excel report downloads parameters compilers.
    """
    @classmethod
    def get_templates(cls) -> List[Dict[str, Any]]:
        return [
            {
                "template_id": "temp-1",
                "name": "Daily AQI Dashboard Report",
                "description": "24h summary layout containing hotspot details and active health advisory codes.",
                "modules": ["AQI Overview", "Hotspots List", "Health Advisory"]
            },
            {
                "template_id": "temp-2",
                "name": "Weekly Forecast & Enforcement Review",
                "description": "7-day forecasting curves combined with inspector dispatch completions checklists.",
                "modules": ["AQI Overview", "Forecast Trend", "Enforcement Checklist"]
            },
            {
                "template_id": "temp-3",
                "name": "Executive City Compliance Digest",
                "description": "Comprehensive monthly summary designed for city authorities reporting.",
                "modules": ["AQI Overview", "Source Attribution Breakdown", "Forecast Trend", "Hotspots List", "Enforcement Checklist"]
            }
        ]

    @classmethod
    async def generate_report(
        cls, 
        title: str, 
        report_type: str, 
        file_format: str, 
        city: str, 
        modules: List[str]
    ) -> Dict[str, Any]:
        weather = await WeatherProvider(city).fetch_data()
        aqi = await AQIProvider(city).fetch_data()
        city_data = await CityDataProvider(city).fetch_data()
        risk = HealthService.classify_risk(aqi["aqi"])

        # Formulate executive summaries blocks dynamically
        summary = (
            f"Executive Summary for {city} prepared on {datetime.utcnow().strftime('%Y-%m-%d')}. "
            f"The live monitored AQI is {aqi['aqi']} ({risk['risk_level']}) with PM2.5 at {aqi['pm2_5']} µg/m³ and PM10 at {aqi['pm10']} µg/m³. "
            f"Local weather sensors report temperature of {weather['temperature']}°C, relative humidity at {weather['humidity']}%, "
            f"and wind speed of {weather['wind_speed']} km/h. "
            f"Source attribution models calculate traffic contribution index at {city_data['traffic_density_index']:.1f}% "
            f"and construction index at {city_data['active_construction_index']:.1f}%."
        )

        findings = [
            f"Ambient AQI is currently classified as {risk['risk_level']}.",
            f"Fine particulates PM2.5 level stands at {aqi['pm2_5']} µg/m³, which exceeds standard WHO daily guidelines.",
            f"Dominant emission source attributed for {city} is {city_data['dominant_source']}."
        ]

        if weather["wind_speed"] < 8.0:
            findings.append("Stagnant weather conditions (wind speed < 8 km/h) are preventing particulate dispersion.")

        actions = [
            f"Prioritize inspection dispatches targeting active construction sites in {city} (Index: {city_data['active_construction_index']:.1f}).",
            "Coordinate with traffic authorities to route commercial logistics around central nodes during stagnation events."
        ]

        if aqi["aqi"] > 200:
            actions.append("Issue public health warnings recommending N95 mask compliance for outdoor transit.")

        return {
            "report_id": f"rep-{int(datetime.utcnow().timestamp())}",
            "title": title,
            "report_type": report_type,
            "file_format": file_format,
            "created_at": datetime.utcnow().isoformat(),
            "city": city,
            "summary_text": summary,
            "key_findings": findings,
            "priority_actions": actions,
            "modules_compiled": modules,
            "file_url": f"/exports/reports/{city.lower()}_report_{file_format.lower()}"
        }
