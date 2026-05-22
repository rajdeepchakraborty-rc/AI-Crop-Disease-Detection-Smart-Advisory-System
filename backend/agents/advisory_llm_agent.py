"""
AGENT 8 – ADVISORY LLM AGENT (CORE)
Uses Groq API (LLaMA / Mixtral) to generate personalized treatment, prevention, and precautions.
Falls back to structured rule-based advice if API key is missing.
"""
import os
import json
from dotenv import load_dotenv

load_dotenv()

FALLBACK_ADVICE = {
    "organic": {
        "treatment_steps": [
            "Remove and destroy all visibly infected plant material immediately.",
            "Apply neem oil spray (5ml neem oil + 1ml dish soap per liter of water) every 5–7 days.",
            "Use copper-based fungicide (copper sulfate or Bordeaux mixture) as a protective spray.",
            "Apply compost tea to boost soil microbiome and plant immune response.",
            "Introduce beneficial insects (ladybugs, lacewings) to control pest vectors.",
        ],
        "precautions": [
            "Wear gloves and mask when handling infected material.",
            "Avoid overhead irrigation — use drip irrigation to minimize leaf wetness.",
            "Disinfect all tools with 10% bleach solution between uses.",
            "Do not compost infected plant material.",
        ],
        "prevention": [
            "Maintain proper plant spacing (≥45cm) for adequate air circulation.",
            "Rotate crops every season to break disease cycles.",
            "Use disease-resistant varieties in future plantings.",
            "Apply preventive neem oil spray every 14 days during high-risk weather.",
            "Test and maintain soil pH between 6.0–7.0 for optimal plant immunity.",
        ],
    },
    "chemical": {
        "treatment_steps": [
            "Apply contact fungicide (Mancozeb 75% WP) at 2.5g/liter, covering all leaf surfaces.",
            "Follow with systemic fungicide (Propiconazole 25% EC) after 5 days for deep tissue treatment.",
            "Apply insecticide (Imidacloprid 200SL) if vector insects are present.",
            "Use chelated micronutrient spray (zinc + boron) to boost plant recovery.",
            "Repeat treatment cycle every 10–14 days until symptoms clear.",
        ],
        "precautions": [
            "Follow all label instructions and observe pre-harvest intervals (PHI).",
            "Wear full PPE: gloves, mask, goggles, and protective clothing.",
            "Do not spray during rain or when wind speed >15 km/h.",
            "Store chemicals locked away from food, water, and children.",
            "Observe a 7-day re-entry interval after chemical application.",
        ],
        "prevention": [
            "Implement integrated pest management (IPM) practices.",
            "Scout fields weekly to catch infections before they spread.",
            "Alternate fungicide classes to prevent resistance development.",
            "Install pheromone traps to monitor and reduce insect populations.",
            "Apply prophylactic fungicide at planting and before monsoon season.",
        ],
    },
}


def _build_groq_prompt(context: dict) -> str:
    lang = context.get('language', 'english').upper()
    return f"""You are an expert agricultural advisor AI. Generate precise, actionable advice.
IMPORTANT: You MUST write the values of the JSON response strictly in the {lang} language, but DO NOT translate the JSON keys. Keep the JSON keys exactly as shown below!

Translate the following fields into {lang} as part of your JSON response:
- disease_name: {context.get('disease_name', 'Unknown')}
- severity_level: {context.get('severity_level', 'Unknown')}
- risk_note: {context.get('risk_note', 'Unknown')}
- explanation: {context.get('explanation', 'Unknown')}
- weather_impact: {context.get('weather_impact', 'Unknown')}

Weather Data: Temp {context.get('weather', {}).get('temperature', 'N/A')}°C, Humidity {context.get('weather', {}).get('humidity', 'N/A')}%, Rainfall {context.get('weather', {}).get('rainfall', 'N/A')}mm
Farm History: {json.dumps(context.get('farm_history', [])[:2])}

Respond ONLY with valid JSON in this exact format:
{{
  "disease_name": "translated disease name",
  "severity_level": "translated severity level",
  "risk_note": "translated risk note",
  "explanation": "translated explanation",
  "weather_impact": "translated weather impact",
  "treatment_steps": ["step1", "step2", "step3", "step4", "step5"],
  "precautions": ["precaution1", "precaution2", "precaution3"],
  "prevention": ["tip1", "tip2", "tip3", "tip4"],
  "voice_script": "A natural,3-4 sentence spoken summary of the diagnosis and top action to take, written strictly in the {lang} language."
}}"""


class AdvisoryLLMAgent:
    async def run(self, context: dict):
        api_key = os.getenv("GROQ_API_KEY", "")
        treatment_type = context.get("treatment_type", "organic")

        advice = None
        if api_key and api_key != "your_groq_api_key_here":
            try:
                from groq import AsyncGroq
                client = AsyncGroq(api_key=api_key)
                completion = await client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=[{"role": "user", "content": _build_groq_prompt(context)}],
                    temperature=0.4,
                    max_tokens=800,
                )
                raw = completion.choices[0].message.content.strip()
                # Extract JSON from response
                start = raw.find("{")
                end = raw.rfind("}") + 1
                if start != -1 and end > start:
                    advice = json.loads(raw[start:end])
                
                # Overwrite context with translated fields if they exist
                if advice:
                    if "disease_name" in advice: context["disease_name"] = advice["disease_name"]
                    if "severity_level" in advice: context["severity_level"] = advice["severity_level"]
                    if "risk_note" in advice: context["risk_note"] = advice["risk_note"]
                    if "explanation" in advice: context["explanation"] = advice["explanation"]
                    if "weather_impact" in advice: context["weather_impact"] = advice["weather_impact"]
                
            except Exception as e:
                print(f"[AdvisoryLLMAgent] Groq error: {e} — using fallback.")
                import traceback
                traceback.print_exc()

        if advice is None:
            advice = FALLBACK_ADVICE.get(treatment_type, FALLBACK_ADVICE["organic"])

        # Personalize with farm history
        history = context.get("farm_history", [])
        if history:
            last = history[-1]
            advice["treatment_steps"].insert(
                0,
                f"⚠️ Farm Memory Alert: Previous {last.get('disease', 'disease')} detected on {last.get('date', 'N/A')}. "
                f"Check if current infection is a recurrence."
            )

        context["advice"] = advice
        context["treatment_steps"] = advice.get("treatment_steps", [])
        context["precautions"] = advice.get("precautions", [])
        context["prevention"] = advice.get("prevention", [])
