import asyncio
import aiohttp
import math

def get_distance_km(lat1, lon1, lat2, lon2):
    R = 6371.0 
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

async def test_agent_logic():
    lat = 22.9006
    lon = 88.3926
    
    real_shops = []
    queries = ["fertilizer", "agricultural", "pesticide", "seed", "kisan"]
    try:
        async with aiohttp.ClientSession() as session:
            for q in queries:
                url = "https://nominatim.openstreetmap.org/search"
                params = {
                    "q": q,
                    "format": "json",
                    "viewbox": f"{lon-0.5},{lat-0.5},{lon+0.5},{lat+0.5}",
                    "bounded": 1,
                    "limit": 5,
                    "addressdetails": 1
                }
                headers = {"User-Agent": "CropDiseaseApp/1.0"}
                
                async with session.get(url, params=params, headers=headers, timeout=10) as response:
                    if response.status == 200:
                        data = await response.json()
                        for item in data:
                            real_shops.append({
                                "name": item.get('name') or item.get('display_name', '').split(',')[0],
                                "lat": float(item['lat']),
                                "lon": float(item['lon'])
                            })
    except Exception as e:
        print(f"Error: {e}")

    for shop in real_shops:
        d = get_distance_km(lat, lon, shop["lat"], shop["lon"])
        print(f"Shop {shop['name']} at {shop['lat']},{shop['lon']} is {d:.2f} km away")

asyncio.run(test_agent_logic())
