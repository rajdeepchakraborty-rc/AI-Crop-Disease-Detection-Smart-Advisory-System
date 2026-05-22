"""
AGENT 7 – WEATHER INTELLIGENCE AGENT
Fetches real-time weather from OpenWeather API and explains its impact on the detected disease.
Falls back to simulated weather if API key is missing.
"""
import os
import httpx
from dotenv import load_dotenv

load_dotenv()

WEATHER_IMPACT_MAP = {
    "blight": "High humidity (>{humidity}%) and temperatures above 20°C accelerate blight spore germination. Current conditions are {risk} for disease progression.",
    "rust": "Rust fungi thrive in warm, wet conditions. Dew periods >6 hours significantly increase infection risk. Current humidity is {risk}.",
    "powdery_mildew": "Powdery mildew paradoxically thrives in LOW humidity with moderate temperatures. Current dry conditions may {risk} spread.",
    "spot": "Leaf wetness from rainfall or high humidity promotes bacterial and fungal spot diseases. Current {risk} rainfall increases spread risk.",
    "virus": "Virus spread is vector-dependent (aphids, whiteflies). High temperatures increase insect activity. Current conditions show {risk} vector pressure.",
    "healthy": "Current weather conditions are favorable for the crop. Maintain regular monitoring during the upcoming {risk} season.",
    "default": "Weather conditions (Temp: {temp}°C, Humidity: {humidity}%, Rainfall: {rain}mm) have a {risk} impact on the detected disease progression.",
}


def _get_impact(disease_class: str, temp: float, humidity: float, rain: float) -> str:
    d = disease_class.lower()
    if "blight" in d:
        risk = "HIGH" if humidity > 70 else "MODERATE"
        return f"High humidity ({humidity}%) and {temp}°C temperature create {risk} risk for blight spore germination. {'Reduce moisture exposure immediately.' if risk == 'HIGH' else 'Monitor closely.'}"
    if "rust" in d:
        risk = "HIGH" if humidity > 65 and temp > 18 else "MODERATE"
        return f"Rust fungi flourish at {temp}°C with {humidity}% humidity — {risk} infection pressure. {'Consider fungicide window.' if risk == 'HIGH' else 'Preventive spray advised.'}"
    if "mildew" in d:
        risk = "ELEVATED" if humidity < 60 else "REDUCED"
        return f"Powdery mildew risk is {risk} at {humidity}% humidity. Dry conditions with moderate temperatures favor fungal spread."
    if "spot" in d or "scorch" in d:
        risk = "HIGH" if rain > 5 or humidity > 80 else "MODERATE"
        return f"{'Recent rainfall' if rain > 5 else 'High humidity'} ({humidity}%) promotes {risk} spot disease spread. Leaf wetness duration is the key driver."
    if "virus" in d or "curl" in d:
        vector = "HIGH" if temp > 25 else "MODERATE"
        return f"At {temp}°C, insect vector activity is {vector}. Warm, dry conditions accelerate aphid and whitefly populations that spread viral infections."
    if "healthy" in d:
        return f"Current conditions (Temp: {temp}°C, Humidity: {humidity}%) are favorable. Watch for humidity spikes above 75% that could trigger fungal infections."
    return f"Temperature {temp}°C, Humidity {humidity}%, Rainfall {rain}mm — conditions have moderate impact on disease progression. Monitor daily."


class WeatherIntelligenceAgent:
    async def run(self, context: dict):
        lat = context.get("location", {}).get("lat", 28.6139)
        lon = context.get("location", {}).get("lon", 77.2090)
        disease_class = context.get("disease_class", "Unknown")
        api_key = os.getenv("OPENWEATHER_API_KEY", "")

        temp, humidity, rain, city = 28.0, 72.0, 3.5, "Unknown"

        if api_key and api_key != "your_openweather_api_key_here":
            try:
                url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric"
                async with httpx.AsyncClient(timeout=8.0) as client:
                    resp = await client.get(url)
                    data = resp.json()
                    temp = round(data["main"]["temp"], 1)
                    humidity = data["main"]["humidity"]
                    rain = data.get("rain", {}).get("1h", 0.0)
                    city = data.get("name", "Unknown")
            except Exception as e:
                print(f"[WeatherAgent] API error: {e} — using simulation.")
        else:
            # Realistic simulated weather for demo
            import random
            temp = round(random.uniform(22, 34), 1)
            humidity = random.randint(60, 88)
            rain = round(random.uniform(0, 12), 1)
            city = "Simulated Location"

        weather_impact = _get_impact(disease_class, temp, humidity, rain)

        context["weather"] = {
            "temperature": temp,
            "humidity": humidity,
            "rainfall": rain,
            "city": city,
            "units": {"temperature": "°C", "humidity": "%", "rainfall": "mm"},
        }
        context["weather_impact"] = weather_impact
