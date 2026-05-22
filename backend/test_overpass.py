import asyncio
import aiohttp

async def test_overpass():
    lat = 28.6139
    lon = 77.2090
    query = f"""
    [out:json];
    (
      node(around:50000,{lat},{lon})["shop"="agrarian"];
      node(around:50000,{lat},{lon})["name"~"Agri|Kisan|Fertilizer|Pesticide|Seed|Farm",i];
    );
    out 5;
    """
    url = "http://overpass-api.de/api/interpreter"
    
    async with aiohttp.ClientSession() as session:
        async with session.get(url, params={'data': query}) as response:
            data = await response.json()
            print(data)

asyncio.run(test_overpass())
