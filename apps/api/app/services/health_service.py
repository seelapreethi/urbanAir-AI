from typing import Dict, Any, List
import random

class HealthService:
    """
    Public health risk classification and personalized medical advisory generator 
    supporting localized sensitive receptor calculations.
    """
    @classmethod
    def classify_risk(cls, aqi: int) -> Dict[str, Any]:
        if aqi <= 50:
            level = "Safe"
            pop = 0.0
            score = 98.5
        elif aqi <= 100:
            level = "Low Risk"
            pop = 15.0
            score = 94.0
        elif aqi <= 150:
            level = "Moderate Risk"
            pop = 45.0
            score = 91.2
        elif aqi <= 200:
            level = "High Risk"
            pop = 70.0
            score = 88.6
        elif aqi <= 300:
            level = "Very High Risk"
            pop = 95.0
            score = 85.0
        else:
            level = "Hazardous"
            pop = 100.0
            score = 92.4

        return {
            "aqi": aqi,
            "risk_level": level,
            "affected_population_pct": pop,
            "confidence_score": score
        }

    @classmethod
    def get_group_advisory(cls, user_group: str, risk_level: str) -> Dict[str, Any]:
        # Formulate advice based on group vulnerability and AQI risk level
        is_sensitive = user_group in ["Children", "Senior Citizens", "Pregnant Women", "Asthma Patients"]
        is_active = user_group in ["Cyclists", "Joggers", "Outdoor Workers"]
        
        if "Safe" in risk_level or "Low" in risk_level:
            outdoor = "Safe to conduct standard outdoor activities."
            mask = "No mask required."
            ventilation = "Fully open windows. Natural ventilation recommended."
        elif "Moderate" in risk_level:
            outdoor = "Reduce prolonged intense outdoor exertion." if is_sensitive else "Standard outdoor activities are safe."
            mask = "N95 recommended for sensitive individuals." if is_sensitive else "No mask required."
            ventilation = "Limit ventilation during traffic peak hours."
        elif "High" in risk_level or "Very High" in risk_level:
            outdoor = "Avoid outdoor activities. Remain indoors." if is_sensitive else "Reduce outdoor exertion. Reschedule events."
            mask = "N95 mask highly recommended for all outdoor transit."
            ventilation = "Keep windows closed. Utilize indoor air purifiers."
        else: # Hazardous
            outdoor = "Strictly avoid outdoor exposure. Keep windows sealed."
            mask = "Double mask (N95 + surgical) mandatory for any urgent exit."
            ventilation = "Seal windows. Run air purifiers on high mode."

        return {
            "user_group": user_group,
            "risk_level_mapped": risk_level,
            "outdoor_activity_advice": outdoor,
            "mask_recommendation": mask,
            "ventilation_advice": ventilation
        }

    @classmethod
    def translate_text(cls, key_text: str, target_lang: str) -> str:
        # Mock translations mapping for key framework elements in multiple languages
        # Languages: hi, te, ta, kn, mr, bn
        translations = {
            "hi": {
                "Safe": "सुरक्षित",
                "Low Risk": "कम जोखिम",
                "Moderate Risk": "मध्यम जोखिम",
                "High Risk": "उच्च जोखिम",
                "Very High Risk": "बहुत उच्च जोखिम",
                "Hazardous": "खतरनाक",
                "Avoid outdoor exercise": "बाहरी व्यायाम से बचें",
                "Keep windows closed": "खिड़कियां बंद रखें",
                "Wear N95 mask": "N95 मास्क पहनें"
            },
            "te": {
                "Safe": "సురక్షితం",
                "Low Risk": "తక్కువ ప్రమాదం",
                "Moderate Risk": "మధ్యస్థ ప్రమాదం",
                "High Risk": "అధిక ప్రమాదం",
                "Very High Risk": "చాలా ఎక్కువ ప్రమాదం",
                "Hazardous": "అపాయకరం",
                "Avoid outdoor exercise": "బయట వ్యాయామం నివారించండి",
                "Keep windows closed": "కిటికీలు మూసి ఉంచండి",
                "Wear N95 mask": "N95 మాస్క్ ధరించండి"
            },
            "ta": {
                "Safe": "பாதுகாப்பானது",
                "Low Risk": "குறைந்த ஆபத்து",
                "Moderate Risk": "மிதமான ஆபத்து",
                "High Risk": "அதிக ஆபத்து",
                "Wear N95 mask": "N95 முகமூடி அணியுங்கள்"
            }
        }
        
        lang = target_lang.lower().strip()
        if lang in translations and key_text in translations[lang]:
            return translations[lang][key_text]
            
        # Return fallback English string if not cached in translation files
        return key_text
