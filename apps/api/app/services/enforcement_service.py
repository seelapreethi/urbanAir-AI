from typing import List, Dict, Any
import math

class EnforcementService:
    """
    Enforcement intelligence service managing hotspot priority rankings, 
    dispatch routing sequences, and inspector audit details.
    """
    @classmethod
    def rank_hotspots(cls, hotspots: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        # Sort and categorize hotspots based on severity index and radius
        ranked = []
        for idx, hp in enumerate(hotspots):
            severity = hp.get("severity", 0.5)
            
            if severity >= 0.90:
                priority = "Critical"
                score = 95
            elif severity >= 0.75:
                priority = "High"
                score = 80
            elif severity >= 0.50:
                priority = "Medium"
                score = 60
            else:
                priority = "Low"
                score = 35

            ranked.append({
                **hp,
                "priority_level": priority,
                "priority_score": score,
                "suggested_visit_order": idx + 1
            })
        
        # Sort ranked list so Critical and High hotspots appear first
        return sorted(ranked, key=lambda x: x["priority_score"], reverse=True)

    @classmethod
    def suggest_route(cls, center_lat: float, center_lng: float, hotspots: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        # Order coordinates using a simple distance metric from the municipal center to simulate TSP dispatch routing
        scored_hotspots = []
        for hp in hotspots:
            lat = hp["latitude"]
            lng = hp["longitude"]
            # Simple Euclidean distance squared
            distance = math.sqrt((lat - center_lat)**2 + (lng - center_lng)**2)
            scored_hotspots.append({
                **hp,
                "distance_from_center_km": round(distance * 111.0, 2) # approx lat deg to km conversion
            })
        
        # Sort by distance (nearest to center coordinates first)
        sorted_route = sorted(scored_hotspots, key=lambda x: x["distance_from_center_km"])
        for order, hp in enumerate(sorted_route):
            hp["suggested_visit_order"] = order + 1
            
        return sorted_route

    @classmethod
    def generate_recommendations(cls, ranked_hotspots: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        recommendations = []
        
        for idx, hp in enumerate(ranked_hotspots):
            priority = hp["priority_level"]
            source = hp.get("estimated_source", "General Area Emissions")
            
            # Formulate action details matching the pollutant source
            if "Traffic" in source:
                action = f"Enforce transit restriction and divert heavy vehicles away from coordinate [{hp['latitude']}, {hp['longitude']}]."
                department = "Traffic Enforcement Department"
                resources = "Road barricades, 4 officers"
                duration = "6 hours"
                improvement = 18
            elif "Industrial" in source or "Kilns" in source or "Manufacturing" in source:
                action = f"Conduct spot audit and inspect boiler filters at the industrial outlet near coordinate [{hp['latitude']}, {hp['longitude']}]."
                department = "Industrial Pollution Control Cell"
                resources = "Inspection kit, 2 auditors, emissions analyzer"
                duration = "4 hours"
                improvement = 25
            else:
                action = f"Deploy municipal dust sweepers and initiate street watering near coordinate [{hp['latitude']}, {hp['longitude']}]."
                department = "Municipal Sanitation Department"
                resources = "2 sprinkler trucks, 3 staff"
                duration = "3 hours"
                improvement = 10

            recommendations.append({
                "recommendation_id": f"rec-enf-{idx}",
                "hotspot_id": hp.get("hotspot_id"),
                "priority": priority,
                "action_text": action,
                "estimated_aqi_improvement": improvement,
                "expected_duration": duration,
                "responsible_authority": department,
                "required_resources": resources,
                "confidence_score": hp.get("confidence_score", 85.0),
                "supporting_evidence": (
                    f"Prioritized as {priority} due to active hotspot severity index "
                    f"of {hp.get('severity', 0.5)} with influence radius {hp.get('radius', 500)}m."
                )
            })
            
        return recommendations
