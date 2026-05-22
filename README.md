<div id="top"></div> 

# AI Crop Disease Detection System

A cutting-edge Agricultural Intelligence Pipeline utilizing a 14-Agent orchestrated architecture. This system automatically identifies crop diseases from images, offers real-time weather integration, generates local audio advisories, runs What-If simulations, and maintains a "Farm Memory" of past detections for long-term tracking.

## Software Requirements Specification (SRS) & Architecture

### 1. Introduction
This system provides accurate crop disease diagnostics, environmental context, supply chain logistics, and actionable insights to farmers. It combines a **React** (Vite) frontend with a **FastAPI** backend.

### 2. System Architecture: The 14-Agent Pipeline
The backend orchestrates a sequential execution of 14 specialized AI agents. The workflow follows this chronological order when an image analysis is requested:

**Phase 1: Visual Diagnostics**
1. **Image Processing Agent**: Normalizes inputs for neural networks (resizes and prepares tensors).
2. **Disease Detection Agent**: Evaluates imagery using a MobileNetV2 Transfer Learning model trained on the PlantVillage dataset (38 classes) to predict the disease.
3. **Severity Analysis Agent**: Calculates bounding box coverage and damage ratios to understand the extent of the crop damage.
4. **Explainability (XAI) Agent**: Uses Grad-CAM techniques to generate visual heatmaps pinpointing disease features.
5. **Leaf Signature Agent**: Extracts unique image embeddings for tracking individual crops over time.

**Phase 2: Contextual & Environmental Data**
6. **Farm Memory Agent**: A persistent JSON-based database for long-term health tracking and CRUD operations.
7. **Weather Intelligence Agent**: Fetches hyper-local climate data (temp, humidity, precipitation) based on user location.
8. **Microclimate Forecast Agent**: Analyzes a 5-day predictive weather API to forecast micro-climate risks.

**Phase 3: Advisory & Logistics**
9. **Supply Chain Agent**: Uses Nominatim API to query the nearest agricultural suppliers within a strict 50km radius and plots them on an auto-fit map.
10. **Advisory LLM Agent**: Uses Groq-powered Llama 3 models to recommend organic/chemical treatments based on exact disease and weather conditions.
11. **What-If Simulation Agent**: Predicts outcomes for delayed treatments, weather changes, or alternative strategies based on user-provided scenarios.

**Phase 4: Output Generation & Delivery**
12. **Voice Generator Agent**: Synthesizes the generated LLM advisory text into localized audio (English, Hindi, Bengali) for farmers.
13. **Report Generator Agent**: Compiles comprehensive diagnostic reports containing all environmental context, supply chain info, and LLM advice.
14. **Response Builder Agent**: Orchestrates and unifies outputs for the React frontend.

### 3. Functional Requirements
* The system MUST execute the agents sequentially to ensure dependencies are met.
* The dashboard MUST render XAI heatmaps, audio players, 3D animations, and supply chain maps.
* The system MUST support multilingual localization across the UI and audio playback. 
* Farm history MUST be persistently tracked via the backend API.

## Existing Key Features

- **14-Agent Sequential Pipeline**: A fully orchestrated AI workflow from image processing to predictive simulations.
- **Multilingual Support**: Fully localized dashboard and voice advisories (English, Hindi, Bengali).
- **Supply Chain Integration**: Location-aware "Find Nearest Supplier" using Nominatim, mapping local stores within a strict 50km radius.
- **Dynamic 3D Dashboard**: Stunning visually immersive UX with 3D leaf animations and scroll-triggered reveal effects.
- **Predictive Micro-Climate Risk Forecasting**: Advanced 5-day weather API integrations to inform crop health strategies.
- **Explainable AI (XAI)**: Grad-CAM generated heatmaps for transparent disease detection.
- **Farm Memory (CRUD API)**: Persistent local JSON database to track long-term plant health history.

## Prerequisites

- Node.js (v18+)
- Python (3.9+)
- Groq API Key (for LLM Advisory & Simulation)

## Environment Setup

### 1. Backend Setup (FastAPI & Agents)
Open a terminal and navigate to the backend directory:
```bash
cd backend
```

Install Python dependencies:
```bash
pip install -r requirements.txt
```

Set your Groq API key as an environment variable, or modify the `.env` if using python-dotenv. If you are on Windows, you can set it directly in the terminal before running:
```powershell
$env:GROQ_API_KEY="your_api_key_here"
```

Start the FastAPI backend server:
```bash
python main.py
```
*Note: The backend will run on `http://localhost:8000`.*

### 2. Frontend Setup (React Dashboard)
Open a **new** terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install Node dependencies:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```
*Note: The frontend will typically run on `http://localhost:5173`.*

## How to Use the System

1. Open your browser and navigate to the React frontend (e.g., `http://localhost:5173`).
2. **Upload an Image**: Click the drag-and-drop zone to upload a picture of a diseased crop leaf.
3. **Configure Settings**: 
   - Enter Latitude/Longitude for localized weather analysis.
   - Choose your preferred Treatment Type (Organic or Chemical).
   - Enter a "What-If" scenario (e.g., "What if it rains tomorrow?").
4. **Analyze**: Click "Analyze Crop Disease". You will see a beautiful animated leaf spinner while the 14 specialized agents process your request sequentially.
5. **View Results**: The dashboard will display:
   - The predicted disease & severity.
   - A Grad-CAM XAI heatmap.
   - Local weather statistics.
   - Treatment advisories (with a playable Voice audio button!).
   - Results from your What-If scenario.
   - Farm History/Memory for that plant type.

## Farm Memory (CRUD API)

The Farm Memory Agent uses a local JSON database (`backend/database/farm_memory.json`). We provide a full set of CRUD operations over REST API:

- **GET** `/farm-history/{leaf_id}`: Retrieve disease history for a leaf.
- **POST** `/farm-history/{leaf_id}`: Create a new history record.
- **PUT** `/farm-history/{leaf_id}/{index}`: Update an existing record.
- **DELETE** `/farm-history/{leaf_id}/{index}`: Remove a specific record.
- **DELETE** `/farm-history/{leaf_id}`: Clear all history for a leaf.

*(These are automatically updated when you run a new analysis via the frontend dashboard!)*

<!--Line-->
<img src="https://user-images.githubusercontent.com/74038190/212284100-561aa473-3905-4a80-b561-0d28506553ee.gif" width="900">

##  Team

| ![Rajdeep Chakraborty](https://avatars.githubusercontent.com/u/68934988?v=4&s=80) | ![Pritam Tung](https://avatars.githubusercontent.com/u/187090732?v=4&s=80) |![Krishnakanta Khamrui](https://avatars.githubusercontent.com/u/162899386?v=4&s=80) |
|:--:|:--:|:--:|
| **Rajdeep Chakraborty** <br> <sub>Team Leader</sub> <br> <sub>Frontend</sub> | **Pritam Tung** <br> <sub>Team Member</sub><br> <sub>Backend</sub> | **Krishnakanta Khamrui** <br> <sub>Team Member</sub><br> <sub>AI/ML</sub> |
| [![LinkedIn](https://img.icons8.com/fluency/32/000000/linkedin.png)](https://www.linkedin.com/in/rajdeepchakraborty69/) | [![LinkedIn](https://img.icons8.com/fluency/32/000000/linkedin.png)](https://www.linkedin.com/in/pritam-t-545866266/) | [![LinkedIn](https://img.icons8.com/fluency/32/000000/linkedin.png)](https://www.linkedin.com/in/krishnakanta-khamrui-1341a7371/) |


<div align="center">
    <a href="#top">
        <img src="https://img.shields.io/badge/Back%20to%20Top-000000?style=for-the-badge&logo=github&logoColor=white" alt="Back to Top">
    </a>
</div>