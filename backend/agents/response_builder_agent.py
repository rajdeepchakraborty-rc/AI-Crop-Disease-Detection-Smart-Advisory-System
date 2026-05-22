"""
AGENT 12 – RESPONSE BUILDER AGENT
Combines all outputs from agents 1–11 into a single clean JSON response.
No missing fields. Consistent structure.
"""


class ResponseBuilderAgent:
    async def run(self, context: dict):
        weather = context.get("weather", {})
        advice = context.get("advice", {})
        farm_history = context.get("farm_history", [])

        final_response = {
            # Core detection
            "disease": context.get("disease_name", "Unknown"),
            "disease_class": context.get("disease_class", "Unknown"),
            "confidence": context.get("confidence_score", 0),
            "severity": context.get("severity_level", "Unknown"),
            "risk_note": context.get("risk_note", ""),

            # XAI
            "explanation": context.get("explanation", ""),
            "heatmap_description": context.get("heatmap_description", ""),
            "heatmap_url": context.get("heatmap_url", ""),

            # Leaf identity
            "leaf_id": context.get("leaf_id", "LEAF-UNKNOWN"),
            "leaf_texture": context.get("leaf_texture", {}),

            # Image processing metadata
            "image_processing": {
                "lighting_condition": context.get("lighting_condition", "normal"),
                "enhancement_applied": context.get("enhancement_applied", False),
                "description": context.get("processed_image_description", ""),
            },

            # Weather
            "weather": {
                "temperature": weather.get("temperature", "N/A"),
                "humidity": weather.get("humidity", "N/A"),
                "rainfall": weather.get("rainfall", "N/A"),
                "city": weather.get("city", "N/A"),
                "impact": context.get("weather_impact", ""),
            },
            
            # Microclimate Forecast
            "microclimate_forecast": context.get("microclimate_forecast"),

            # Farm memory
            "farm_history": farm_history,

            # Advisory
            "treatment_type": context.get("treatment_type", "organic"),
            "advice": {
                "treatment_steps": context.get("treatment_steps", []),
                "precautions": context.get("precautions", []),
                "prevention": context.get("prevention", []),
            },

            # Supply Chain
            "supply_chain": context.get("supply_chain"),

            # What-if
            "what_if_analysis": context.get("what_if_analysis"),

            # Voice
            "voice_script": context.get("voice_script", ""),
            "audio_url": context.get("audio_url"),

            # Report
            "report": context.get("report_text", ""),

            # Pipeline meta
            "agent_logs": context.get("agent_logs", []),
        }

        context["final_response"] = final_response
