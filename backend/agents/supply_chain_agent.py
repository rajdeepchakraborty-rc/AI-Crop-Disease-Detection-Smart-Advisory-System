"""
AGENT - SUPPLY CHAIN
Provides nearby fertilizer/pesticide shops based on location and treatment type.
Uses OpenStreetMap Overpass API for pure accurate real-world locations.
"""

import math
import aiohttp
import json
import random

def get_distance_km(lat1, lon1, lat2, lon2):
    R = 6371.0 
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

class SupplyChainAgent:
    async def run(self, context: dict):
        lat = context.get("location", {}).get("lat", 22.9006)
        lon = context.get("location", {}).get("lon", 88.3926)
        treatment_type = context.get("treatment_type", "organic").lower()

        # Query Nominatim API for real agricultural/fertilizer shops near the coordinates
        # Limit search to roughly 50km viewbox (0.5 degrees)
        real_shops = []
        queries = ["fertilizer", "agricultural", "pesticide", "seed", "kisan"]
        try:
            async with aiohttp.ClientSession() as session:
                for q in queries:
                    url = "https://nominatim.openstreetmap.org/search"
                    params = {
                        "q": q,
                        "format": "json",
                        "viewbox": f"{lon-0.5},{lat+0.5},{lon+0.5},{lat-0.5}",
                        "bounded": 1,
                        "limit": 5,
                        "addressdetails": 1
                    }
                    headers = {"User-Agent": "CropDiseaseApp/1.0"}
                    
                    async with session.get(url, params=params, headers=headers, timeout=10) as response:
                        if response.status == 200:
                            data = await response.json()
                            for item in data:
                                name = item.get('name') or item.get('display_name', '').split(',')[0]
                                stocks = ["organic", "chemical"] if "organic" in name.lower() or "bio" in name.lower() else ["chemical", "organic"]
                                
                                real_shops.append({
                                    "name": name,
                                    "lat": float(item['lat']),
                                    "lon": float(item['lon']),
                                    "stocks": stocks
                                })
                        else:
                            print(f"[SupplyChainAgent] Nominatim API failed with status {response.status}")
        except Exception as e:
            print(f"[SupplyChainAgent] Nominatim API failed: {e}")

        # Remove duplicate coordinates and calculate accurate Haversine distance
        unique_shops = []
        seen = set()
        for shop in real_shops:
            coord = (shop["lat"], shop["lon"])
            if coord not in seen:
                seen.add(coord)
                shop["distance_km"] = get_distance_km(lat, lon, shop["lat"], shop["lon"])
                unique_shops.append(shop)

        # Filter by stock (treatment type) AND ensure it is strictly under 50km
        valid_shops = [shop for shop in unique_shops if treatment_type in shop["stocks"] and shop["distance_km"] <= 50]
        
        # Sort by actual geometric distance to find the absolute nearest
        valid_shops.sort(key=lambda s: s["distance_km"])
        
        # Take pure accurate nearest 3
        nearest_shops = valid_shops[:3]

        context["supply_chain"] = {
            "shops": nearest_shops,
            "center": {"lat": lat, "lon": lon},
            "api_guidance": "We are using OpenStreetMap via Leaflet, which is 100% free and open-source. No API key or credit card is required to use this map!"
        }
