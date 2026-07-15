from typing import Dict, Any, List

class HealthService:
    """
    Public health risk classification and personalized medical advisory generator 
    supporting localized sensitive receptor calculations.
    """
    @classmethod
    def classify_risk(cls, aqi: int) -> Dict[str, Any]:
        # Using Indian AQI sub-indexes classification
        if aqi <= 50:
            level = "Good"
            pop = 0.0
            score = 98.5
        elif aqi <= 100:
            level = "Satisfactory"
            pop = 15.0
            score = 94.0
        elif aqi <= 200:
            level = "Moderate"
            pop = 45.0
            score = 91.2
        elif aqi <= 300:
            level = "Poor"
            pop = 70.0
            score = 88.6
        elif aqi <= 400:
            level = "Very Poor"
            pop = 95.0
            score = 85.0
        else:
            level = "Severe"
            pop = 100.0
            score = 92.4

        return {
            "aqi": aqi,
            "risk_level": level,
            "affected_population_pct": pop,
            "confidence_score": score
        }

    @classmethod
    def get_dynamic_advisory(
        cls, 
        user_group: str, 
        aqi: int, 
        pm2_5: float, 
        pm10: float, 
        temp: float, 
        humidity: float, 
        wind_speed: float
    ) -> Dict[str, Any]:
        # Formulate advice based on group vulnerability and AQI risk level
        risk_data = cls.classify_risk(aqi)
        risk_level = risk_data["risk_level"]
        
        is_sensitive = user_group in ["Children", "Senior Citizens", "Pregnant Women", "Asthma Patients"]
        is_active = user_group in ["Cyclists", "Joggers", "Outdoor Workers"]
        
        outdoor = "Safe to conduct standard outdoor activities."
        mask = "No mask required."
        ventilation = "Fully open windows. Natural ventilation recommended."
        
        # Influence of pollutants & weather
        weather_stress = ""
        if temp > 38.0:
            weather_stress = " Warning: High thermal stress detected. Drink plenty of water."
        elif temp < 12.0:
            weather_stress = " Warning: Cold air stagnation. Wear warm layers to protect airways."
            
        wind_stress = ""
        if wind_speed < 5.0 and aqi > 100:
            wind_stress = " Caution: Very low wind speeds are causing stagnation of particulate matter."

        humidity_stress = ""
        if humidity > 80.0 and aqi > 150:
            humidity_stress = " High humidity is trapping air pollutants close to the ground."

        # Specific Group advisory templates
        if risk_level == "Good":
            outdoor = f"Air quality is excellent. Ideal for outdoor exercises and ventilation.{weather_stress}"
            mask = "No mask needed."
            ventilation = "Excellent air circulation. Keep windows open."
        elif risk_level == "Satisfactory":
            outdoor = f"Air quality is acceptable. Active groups can proceed with outdoor tasks.{weather_stress}"
            mask = "No mask needed."
            ventilation = "Natural ventilation is safe."
        elif risk_level == "Moderate":
            if is_sensitive:
                outdoor = f"Sensitive groups should limit prolonged outdoor exertion.{weather_stress}{wind_stress}"
                mask = "N95 mask recommended for outdoor stays longer than 1 hour."
                ventilation = "Moderate indoor ventilation; close windows during peak traffic hours."
            elif is_active:
                outdoor = f"Standard activities are safe, but monitor breathing patterns.{wind_stress}"
                mask = "No mask required, but keep N95 available."
                ventilation = "Natural ventilation is generally fine."
            else:
                outdoor = "Safe to go outdoors. General public can continue routine activities."
                mask = "No mask required."
                ventilation = "Natural ventilation is fine."
        elif risk_level == "Poor":
            if is_sensitive:
                outdoor = f"High Risk: Avoid outdoor activities. Stay indoors as much as possible.{weather_stress}{wind_stress}{humidity_stress}"
                mask = "N95 mask mandatory for all outdoor exposure."
                ventilation = "Close windows. Use air purifiers if available."
            elif is_active:
                outdoor = f"Reschedule strenuous outdoor workouts or shifts to indoor spaces.{wind_stress}"
                mask = "N95 mask recommended during high-exertion outdoor tasks."
                ventilation = "Reduce outdoor air intake. Close windows."
            else:
                outdoor = "General public should reduce prolonged or heavy outdoor exertion."
                mask = "N95 mask recommended for outdoor transits."
                ventilation = "Limit natural ventilation; run AC in recirculation mode."
        elif risk_level == "Very Poor":
            outdoor = f"Severe threat: Minimize all outdoor activities. Sensitive groups must remain indoors.{weather_stress}{wind_stress}{humidity_stress}"
            mask = "N95 mask is strictly required for any outdoor transit."
            ventilation = "Close all windows completely. Utilize air purification systems."
        else: # Severe
            outdoor = f"Emergency levels: strictly avoid outdoor exposure. Keep windows sealed.{weather_stress}{wind_stress}{humidity_stress}"
            mask = "Double masking or particulate filter mask is mandatory for any urgent exit."
            ventilation = "Seal all indoor spaces. Avoid any natural ventilation."

        # Make the advice specific to pollutant levels
        pollutant_warning = ""
        if pm2_5 > 150:
            pollutant_warning = " Danger: PM2.5 levels are extremely high, representing deep respiratory health hazards."
        elif pm10 > 250:
            pollutant_warning = " Warning: Dust and PM10 coarse particles are heavily suspended in the air."
            
        outdoor += pollutant_warning
            
        return {
            "user_group": user_group,
            "risk_level_mapped": risk_level,
            "outdoor_activity_advice": outdoor,
            "mask_recommendation": mask,
            "ventilation_advice": ventilation,
            "pm2_5_level": pm2_5,
            "pm10_level": pm10,
            "humidity": humidity,
            "temperature": temp,
            "wind_speed": wind_speed
        }

    @classmethod
    def translate_text(cls, key_text: str, target_lang: str) -> str:
        translations = {
            "hi": {
                "Good": "अच्छा",
                "Satisfactory": "संतोषजनक",
                "Moderate": "मध्यम",
                "Poor": "खराब",
                "Very Poor": "बहुत खराब",
                "Severe": "गंभीर"
            },
            "te": {
                "Good": "మంచిది",
                "Satisfactory": "సంతృప్తికరం",
                "Moderate": "మధ్యస్థం",
                "Poor": "క్షీణించింది",
                "Very Poor": "చాలా క్షీణించింది",
                "Severe": "తీవ్రమైనది"
            }
        }
        
        lang = target_lang.lower().strip()
        if lang in translations and key_text in translations[lang]:
            return translations[lang][key_text]
        return key_text
