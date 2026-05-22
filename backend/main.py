from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import uvicorn
from pathlib import Path
from orchestrator import MasterOrchestrator

app = FastAPI(
    title="AI Crop Disease Detection System",
    description="12-Agent AI Pipeline for Agricultural Intelligence",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for d in ["outputs/audio", "outputs/reports", "outputs/heatmaps"]:
    Path(d).mkdir(parents=True, exist_ok=True)

app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")

orchestrator = MasterOrchestrator()

@app.get("/")
async def root():
    return {"system": "AI Crop Disease Detection + Smart Advisory System", "agents": 12, "status": "operational"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/analyze")
async def analyze_crop(
    image: UploadFile = File(...),
    lat: float = Form(28.6139),
    lon: float = Form(77.2090),
    treatment_type: str = Form("organic"),
    user_query: str = Form(""),
    language: str = Form("english")
):
    if not image.content_type or not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    image_bytes = await image.read()
    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Empty image file")

    input_data = {
        "image_bytes": image_bytes,
        "image_filename": image.filename or "crop.jpg",
        "image_content_type": image.content_type,
        "location": {"lat": lat, "lon": lon},
        "treatment_type": treatment_type,
        "user_query": user_query.strip(),
        "language": language.lower(),
    }
    try:
        result = await orchestrator.run(input_data)
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/farm-history/{leaf_id}")
async def get_farm_history(leaf_id: str):
    from agents.farm_memory_agent import FarmMemoryAgent
    agent = FarmMemoryAgent()
    return {"leaf_id": leaf_id, "history": agent.get_history(leaf_id)}

@app.post("/farm-history/{leaf_id}")
async def create_farm_history(leaf_id: str, request: Request):
    data = await request.json()
    from agents.farm_memory_agent import FarmMemoryAgent
    agent = FarmMemoryAgent()
    return agent.create_record(leaf_id, data)

@app.put("/farm-history/{leaf_id}/{index}")
async def update_farm_history(leaf_id: str, index: int, request: Request):
    data = await request.json()
    from agents.farm_memory_agent import FarmMemoryAgent
    agent = FarmMemoryAgent()
    res = agent.update_record(leaf_id, index, data)
    if res["status"] == "error":
        raise HTTPException(status_code=404, detail=res["message"])
    return res

@app.delete("/farm-history/{leaf_id}/{index}")
async def delete_farm_history_record(leaf_id: str, index: int):
    from agents.farm_memory_agent import FarmMemoryAgent
    agent = FarmMemoryAgent()
    res = agent.delete_record(leaf_id, index)
    if res["status"] == "error":
        raise HTTPException(status_code=404, detail=res["message"])
    return res

@app.delete("/farm-history/{leaf_id}")
async def delete_farm_history_leaf(leaf_id: str):
    from agents.farm_memory_agent import FarmMemoryAgent
    agent = FarmMemoryAgent()
    res = agent.delete_leaf(leaf_id)
    if res["status"] == "error":
        raise HTTPException(status_code=404, detail=res["message"])
    return res

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
