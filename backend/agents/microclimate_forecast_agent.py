"""
AGENT – MICROCLIMATE FORECAST AGENT
Uses OpenWeather 5-day forecast to predict disease progression.
"""
import os
import httpx
from datetime import datetime

DISEASE_RISK_MAP = {
    "blight": {"metric": "humidity", "threshold": 80, "condition": ">", "warning": "High humidity forecast indicates rapid blight spread. Preemptive fungicide recommended."},
    "rust": {"metric": "humidity", "threshold": 75, "condition": ">", "warning": "Sustained high humidity will accelerate rust spore germination."},
    "mildew": {"metric": "humidity", "threshold": 50, "condition": "<", "warning": "Dry conditions ahead favor powdery mildew spread. Maintain crop hydration."},
    "spot": {"metric": "rain", "threshold": 2, "condition": ">", "warning": "Rainfall predicted. Leaf wetness will severely spread bacterial/fungal spots."},
    "virus": {"metric": "temp", "threshold": 30, "condition": ">", "warning": "High temperatures will increase aphid/whitefly vector activity, spreading viruses."},
    "healthy": {"metric": "temp", "threshold": 99, "condition": "<", "warning": "Forecast looks generally favorable. Continue standard monitoring."}
}

def _get_disease_key(disease_class: str) -> str:
    d = disease_class.lower()
    if "blight" in d: return "blight"
    if "rust" in d: return "rust"
    if "mildew" in d: return "mildew"
    if "spot" in d or "scorch" in d or "mold" in d: return "spot"
    if "virus" in d or "mosaic" in d or "curl" in d: return "virus"
    if "healthy" in d: return "healthy"
    return "healthy" # default

class MicroclimateForecastAgent:
    async def run(self, context: dict):
        lat = context.get("location", {}).get("lat", 28.6139)
        lon = context.get("location", {}).get("lon", 77.2090)
        disease_class = context.get("disease_class", "Unknown")
        api_key = os.getenv("OPENWEATHER_API_KEY", "")

        forecast_data = []
        
        if api_key and api_key != "your_openweather_api_key_here":
            try:
                url = f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={api_key}&units=metric"
                async with httpx.AsyncClient(timeout=8.0) as client:
                    resp = await client.get(url)
                    data = resp.json()
                    
                    # OpenWeather forecast returns data every 3 hours. We'll group by day to get daily max/averages.
                    daily = {}
                    for item in data.get("list", []):
                        date_str = item["dt_txt"].split(" ")[0]
                        if date_str not in daily:
                            daily[date_str] = {"temps": [], "humidities": [], "rains": []}
                        
                        daily[date_str]["temps"].append(item["main"]["temp"])
                        daily[date_str]["humidities"].append(item["main"]["humidity"])
                        rain = item.get("rain", {}).get("3h", 0)
                        daily[date_str]["rains"].append(rain)
                        
                    for date, vals in list(daily.items())[:5]: # next 5 days
                        forecast_data.append({
                            "date": date,
                            "temp": round(sum(vals["temps"])/len(vals["temps"]), 1),
                            "humidity": round(sum(vals["humidities"])/len(vals["humidities"]), 1),
                            "rain": round(sum(vals["rains"]), 1)
                        })
            except Exception as e:
                print(f"[MicroclimateForecastAgent] API error: {e}")
        
        if not forecast_data:
            # Fallback mock data
            import random
            from datetime import timedelta
            now = datetime.now()
            for i in range(1, 6):
                forecast_data.append({
                    "date": (now + timedelta(days=i)).strftime("%Y-%m-%d"),
                    "temp": round(random.uniform(22, 35), 1),
                    "humidity": round(random.uniform(50, 90), 1),
                    "rain": round(random.uniform(0, 15), 1)
                })

        # Evaluate risk
        d_key = _get_disease_key(disease_class)
        rule = DISEASE_RISK_MAP.get(d_key, DISEASE_RISK_MAP["healthy"])
        
        triggered = False
        trigger_date = None
        trigger_val = 0
        
        for f in forecast_data:
            val = f[rule["metric"]]
            if rule["condition"] == ">" and val > rule["threshold"]:
                triggered = True
                trigger_date = f["date"]
                trigger_val = val
                break
            elif rule["condition"] == "<" and val < rule["threshold"]:
                triggered = True
                trigger_date = f["date"]
                trigger_val = val
                break
                
        alert = ""
        if triggered and d_key != "healthy":
            alert = f"🚨 PROACTIVE ALERT: {rule['warning']} (Trigger: {rule['metric'].capitalize()} {trigger_val} on {trigger_date})"
        elif d_key == "healthy":
            alert = f"✅ SAFE: {rule['warning']}"
        else:
            alert = f"ℹ️ FORECAST: Weather conditions over the next 5 days do not indicate an accelerated risk for {disease_class.split('___')[-1]}."

        context["microclimate_forecast"] = {
            "forecast": forecast_data,
            "alert": alert,
            "rule": rule
        }
