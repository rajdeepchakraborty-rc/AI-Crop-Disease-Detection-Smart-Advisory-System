# 🌾 AI Crop Disease Detection System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.9+](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![Node.js 18+](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React 18](https://img.shields.io/badge/React-18.3-61DAFB.svg)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688.svg)](https://fastapi.tiangolo.com/)

> **Cutting-edge Agricultural Intelligence Pipeline** leveraging a 14-Agent orchestrated architecture for real-time crop disease detection, environmental analysis, and AI-powered farm advisory.

---

## 📋 Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation Guide](#installation-guide)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [System Architecture](#system-architecture)
- [Database Schema](#database-schema)
- [Scripts](#scripts)
- [Performance & Optimizations](#performance--optimizations)
- [Troubleshooting](#troubleshooting)
- [Future Improvements](#future-improvements)
- [Contributing Guidelines](#contributing-guidelines)
- [License](#license)
- [Author](#author)
- [Acknowledgements](#acknowledgements)

---

## 🎯 Project Description

**AI Crop Disease Detection System** is a comprehensive agricultural intelligence platform designed to empower farmers and agricultural professionals with AI-driven insights. The system automatically identifies crop diseases from leaf images, provides real-time weather context, generates actionable treatment recommendations, and maintains a persistent farm memory for long-term tracking.

### Main Purpose
This platform bridges the gap between traditional farming and modern AI/ML technology, enabling:
- **Accurate Disease Diagnosis**: Real-time identification of 38+ plant diseases using deep learning
- **Smart Advisory**: AI-powered treatment and prevention strategies tailored to local weather
- **Supply Chain Integration**: Location-aware supplier discovery and logistics support
- **Predictive Intelligence**: What-if simulations for treatment outcomes and weather scenarios
- **Farmer-Centric UX**: Multilingual support (English, Hindi, Bengali) with audio advisories

### Target Users
- 👨‍🌾 Small to medium-scale farmers
- 🏢 Agricultural cooperatives and organizations
- 📊 Agricultural extension workers
- 🔬 Crop scientists and researchers

### Workflow Overview
1. **Upload** → Capture or upload crop leaf image
2. **Analyze** → AI pipeline processes the image through 14 specialized agents
3. **Diagnose** → Identify disease with confidence scores and visual explanations
4. **Contextualize** → Integrate weather, location, and historical farm data
5. **Recommend** → Receive AI-powered treatment plans and prevention strategies
6. **Track** → Store results in farm memory for long-term crop health monitoring

---

## ✨ Features

### Core Intelligence
- **🤖 14-Agent Sequential Pipeline**: Fully orchestrated AI workflow from image processing to output generation
- **🔬 MobileNetV2 Disease Detection**: Transfer learning model trained on PlantVillage dataset (38 disease classes)
- **📊 Real-time Severity Analysis**: Calculates damage extent via bounding box coverage and damage ratios
- **💡 Explainable AI (XAI)**: Grad-CAM heatmaps visualize disease features for transparency

### Environmental Intelligence
- **🌦 Weather Integration**: Real-time hyper-local climate data (temperature, humidity, precipitation)
- **📈 Microclimate Forecasting**: 5-day predictive weather analysis for risk assessment
- **🌍 Geographic Context**: GPS-based location services for precise environmental analysis

### Advisory & Treatment
- **🤖 LLM-Powered Recommendations**: Groq-powered Llama 3 generates organic/chemical treatment plans
- **💊 Treatment Decision Support**: Context-aware recommendations based on disease, weather, and treatment type
- **⚠️ Risk Precautions**: Evidence-based safety guidelines and prevention strategies
- **🔮 What-If Simulations**: Predictive outcomes for delayed treatments and alternative strategies

### Logistics & Supply Chain
- **📍 Supplier Discovery**: Nominatim-powered search for nearest agricultural suppliers (50km radius)
- **🗺️ Interactive Maps**: Leaflet-based mapping with auto-fit visualization
- **🔗 Supply Chain Integration**: Connect farmers with treatment suppliers and resources

### Data Management & Tracking
- **📋 Farm Memory (CRUD)**: JSON-based persistent database for long-term plant health tracking
- **🆔 Leaf Signatures**: Unique embeddings for individual crop tracking over time
- **📊 Historical Analytics**: Access past disease detections and treatment outcomes
- **💾 Persistent Storage**: Automatic backup and retrieval of farm records

### User Experience
- **🎨 Dynamic 3D Dashboard**: Immersive UI with Three.js 3D leaf animations
- **🌐 Multilingual Support**: Full localization (English, Hindi, Bengali) for UI and audio
- **🎙️ Audio Advisory**: Text-to-speech synthesis in regional languages (gTTS)
- **📱 Cross-Platform**: Web dashboard (React), Mobile app (React Native/Expo), Mobile web support
- **📄 Report Generation**: Comprehensive PDF reports with diagnostic data, treatment plans, and supply chain info

---

## 🛠 Tech Stack

### Backend
| Category | Technology |
|----------|-----------|
| **Framework** | FastAPI 0.111.0 |
| **Server** | Uvicorn (ASGI) |
| **Language** | Python 3.9+ |
| **ML/AI** | TensorFlow 2.16.1, MobileNetV2 |
| **LLM API** | Groq (LLaMA 3, Mixtral) |
| **APIs** | OpenWeather, Nominatim, Kaggle |
| **Image Processing** | OpenCV, Pillow, NumPy |
| **Async** | AsyncIO, httpx |
| **Text-to-Speech** | gTTS (Google Translate TTS) |

### Frontend (Web Dashboard)
| Category | Technology |
|----------|-----------|
| **Framework** | React 18.3.1 |
| **Build Tool** | Vite 8.0.12 |
| **Styling** | Tailwind CSS 4.3.0 |
| **3D Graphics** | Three.js 0.184.0 |
| **Maps** | Leaflet 1.9.4, React-Leaflet 4.2.1 |
| **HTTP Client** | Axios 1.16.1 |
| **PDF Export** | html2pdf.js 0.14.0 |
| **Icons** | Lucide React 0.395.0 |

### Mobile Application
| Category | Technology |
|----------|-----------|
| **Framework** | React Native 0.85.3 / Expo 56.0.3 |
| **Navigation** | React Navigation 7.2.4 |
| **Image Picker** | Expo Image Picker 56.0.12 |
| **Location Services** | Expo Location 56.0.12 |
| **Audio Playback** | Expo Audio 56.0.9 |
| **HTTP Client** | Axios 1.16.1 |
| **Styling** | React Native StyleSheet |

### DevOps & Tools
- **Package Managers**: npm, pip
- **API Documentation**: FastAPI Swagger UI
- **Version Control**: Git
- **Environment Management**: python-dotenv

---

## 📁 Project Structure

```
AI Crop Disease/
├── backend/
│   ├── main.py                 # FastAPI application entry point
│   ├── orchestrator.py         # 14-Agent pipeline orchestrator
│   ├── requirements.txt        # Python dependencies
│   ├── train_model.py          # Model training script
│   ├── create_mock_model.py    # Model generation utility
│   ├── test_*.py               # Test scripts for APIs
│   ├── agents/
│   │   ├── image_processing_agent.py      # Image normalization & preprocessing
│   │   ├── disease_detection_agent.py     # MobileNetV2 disease classification
│   │   ├── severity_analysis_agent.py     # Damage extent calculation
│   │   ├── explainability_agent.py        # Grad-CAM XAI heatmaps
│   │   ├── leaf_signature_agent.py        # Embedding extraction
│   │   ├── farm_memory_agent.py           # CRUD operations for farm history
│   │   ├── weather_intelligence_agent.py  # Weather data integration
│   │   ├── microclimate_forecast_agent.py # 5-day weather predictions
│   │   ├── advisory_llm_agent.py          # Groq LLM treatment recommendations
│   │   ├── whatif_simulation_agent.py     # Outcome predictions
│   │   ├── voice_generator_agent.py       # Text-to-speech synthesis
│   │   ├── supply_chain_agent.py          # Supplier discovery & mapping
│   │   ├── report_generator_agent.py      # PDF report compilation
│   │   └── response_builder_agent.py      # Output orchestration
│   ├── models/
│   │   ├── crop_disease_model.h5          # Pre-trained TensorFlow model
│   │   └── class_names.json               # Disease class mappings
│   ├── database/
│   │   └── farm_memory.json               # Persistent farm history database
│   └── outputs/
│       ├── audio/                         # Generated audio advisories
│       ├── heatmaps/                      # Grad-CAM visualization outputs
│       └── reports/                       # Generated PDF reports
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                        # Main React component
│   │   ├── main.jsx                       # React entry point
│   │   ├── i18n.js                        # Internationalization config
│   │   ├── api/
│   │   │   └── cropApi.js                 # API client functions
│   │   ├── components/
│   │   │   ├── HomePage.jsx               # Landing page
│   │   │   ├── ImageUpload.jsx            # Image upload interface
│   │   │   ├── DashboardPage.jsx          # Results dashboard
│   │   │   ├── ResultsDashboard.jsx       # Analysis results display
│   │   │   ├── DiseaseCard.jsx            # Disease information card
│   │   │   ├── WeatherCard.jsx            # Weather context display
│   │   │   ├── MicroClimateCard.jsx       # Forecast display
│   │   │   ├── AdvisoryPanel.jsx          # Treatment recommendations
│   │   │   ├── HeatmapViewer.jsx          # XAI visualization
│   │   │   ├── SupplyChainMap.jsx         # Supplier location map
│   │   │   ├── VoicePlayer.jsx            # Audio advisory player
│   │   │   ├── FarmHistory.jsx            # Historical records
│   │   │   ├── WhatIfPanel.jsx            # Simulation interface
│   │   │   ├── FloatingLeaves3D.jsx       # 3D animations
│   │   │   ├── Header.jsx                 # Navigation header
│   │   │   └── Footer.jsx                 # Footer component
│   │   ├── constants/
│   │   │   └── theme.js                   # Color & styling constants
│   │   └── assets/                        # Images, icons, fonts
│   ├── index.html                         # HTML template
│   ├── package.json                       # Frontend dependencies
│   ├── vite.config.js                     # Vite build configuration
│   └── eslint.config.js                   # ESLint configuration
│
├── CropAI-Mobile/
│   ├── App.js                             # Expo app entry point
│   ├── package.json                       # Mobile app dependencies
│   ├── app.json                           # Expo configuration
│   ├── index.js                           # React Native entry point
│   ├── src/
│   │   ├── navigation/
│   │   │   └── AppNavigator.js            # Navigation structure
│   │   ├── screens/
│   │   │   ├── HomeScreen.js              # Home screen
│   │   │   ├── UploadScreen.js            # Image upload
│   │   │   ├── ResultScreen.js            # Analysis results
│   │   │   ├── HistoryScreen.js           # Farm history
│   │   │   ├── LoadingScreen.js           # Loading state
│   │   │   └── SplashScreen.js            # App splash screen
│   │   ├── components/
│   │   │   ├── DiseaseCard.js             # Disease display component
│   │   │   ├── WeatherCard.js             # Weather information
│   │   │   ├── SeverityMeter.js           # Severity visualization
│   │   │   ├── HeatmapViewer.js           # Heatmap display
│   │   │   ├── AudioPlayer.js             # Audio playback
│   │   │   └── HistoryCard.js             # History item display
│   │   ├── services/
│   │   │   └── api.js                     # Mobile API client
│   │   └── constants/
│   │       └── theme.js                   # Mobile theme constants
│   └── assets/                            # Mobile assets
│
└── README.md                              # This file
```

---

## 📦 Installation Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Python**: 3.9 or higher
- **pip**: Python package manager
- **npm** or **yarn**: Node package manager
- **Git**: Version control
- **Groq API Key**: [Get from Groq Console](https://console.groq.com)

### Clone Repository
```bash
git clone https://github.com/yourusername/AI-Crop-Disease.git
cd "AI Crop Disease"
```

### Backend Setup

#### 1. Create Python Virtual Environment
```bash
cd backend
python -m venv venv
```

On Windows:
```powershell
venv\Scripts\activate
```

On macOS/Linux:
```bash
source venv/bin/activate
```

#### 2. Install Python Dependencies
```bash
pip install -r requirements.txt
```

#### 3. Set Environment Variables
Create a `.env` file in the `backend/` directory:
```env
GROQ_API_KEY=your_groq_api_key_here
OPENWEATHER_API_KEY=your_openweather_api_key_here
```

Or set as system environment variables:

**Windows (PowerShell)**:
```powershell
$env:GROQ_API_KEY="your_groq_api_key_here"
$env:OPENWEATHER_API_KEY="your_openweather_api_key_here"
```

**macOS/Linux**:
```bash
export GROQ_API_KEY="your_groq_api_key_here"
export OPENWEATHER_API_KEY="your_openweather_api_key_here"
```

#### 4. Run Backend Server
```bash
python main.py
```

The backend will start at `http://localhost:8000`

**Verify Backend**:
```bash
curl http://localhost:8000/
curl http://localhost:8000/health
```

### Frontend Setup

#### 1. Install Node Dependencies
```bash
cd frontend
npm install
```

#### 2. Start Development Server
```bash
npm run dev
```

The frontend will typically run at `http://localhost:5173`

#### 3. Build for Production
```bash
npm run build
npm run preview
```

### Mobile App Setup (Optional)

#### 1. Install Dependencies
```bash
cd CropAI-Mobile
npm install
```

#### 2. Start Expo Development Server
```bash
npm start
```

#### 3. Run on Device
- **Android**: Press `a` and follow prompts
- **iOS**: Press `i` and follow prompts
- **Web**: Press `w` to run in web browser

---

## 🔐 Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

| Variable | Type | Purpose | Example |
|----------|------|---------|---------|
| `GROQ_API_KEY` | String | Groq API authentication for LLM | `gsk_xxxxxxxxxxxxx` |
| `OPENWEATHER_API_KEY` | String | OpenWeather API for weather data | `abc123def456` |
| `WEATHER_API_URL` | String | Weather API endpoint | `https://api.openweathermap.org/data/2.5` |
| `NOMINATIM_API_URL` | String | Nominatim API for geolocation | `https://nominatim.openstreetmap.org` |
| `MODEL_PATH` | String | Path to TensorFlow model | `models/crop_disease_model.h5` |
| `FARM_MEMORY_PATH` | String | Path to farm memory database | `database/farm_memory.json` |
| `OUTPUT_DIR` | String | Directory for outputs | `outputs` |
| `MAX_IMAGE_SIZE` | Integer | Maximum image size in bytes | `25000000` |
| `ALLOWED_EXTENSIONS` | String | Allowed file extensions | `jpg,jpeg,png` |

### Obtaining API Keys

**Groq API Key**:
1. Visit [Groq Console](https://console.groq.com)
2. Sign up or log in
3. Generate API key in API Keys section
4. Copy and store securely

**OpenWeather API Key**:
1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for free tier
3. Generate API key
4. Copy and store securely

---

## 🚀 Usage

### 1. Web Dashboard (Recommended)

#### Upload & Analyze
1. Navigate to `http://localhost:5173`
2. Click **"Upload Image"** or **"Capture Photo"**
3. Select a crop leaf image (JPG, PNG)
4. Enter **Location** (GPS coordinates or address)
5. Select **Treatment Type** (Organic or Chemical)
6. (Optional) Add **Custom Query** for specific concerns
7. Select **Language** (English, Hindi, Bengali)
8. Click **"Analyze"**

#### View Results
- **Disease Detection**: Predicted disease with confidence score
- **Heatmap Visualization**: Grad-CAM visualization showing affected regions
- **Weather Context**: Current temperature, humidity, rainfall impact
- **Treatment Plan**: Step-by-step organic/chemical treatment recommendations
- **Precautions**: Safety guidelines and best practices
- **Prevention**: Long-term prevention strategies
- **Supply Chain**: Find nearest agricultural suppliers
- **Audio Advisory**: Listen to AI-generated treatment advice
- **Report**: Download comprehensive PDF report

#### Farm History
1. Click **"Farm History"** in dashboard
2. View past detections and treatments
3. Track disease progression over time
4. Manage records (edit, delete)

#### What-If Analysis
1. In results dashboard, click **"What-If Analysis"**
2. Adjust parameters:
   - Treatment delay (days)
   - Weather changes
   - Alternative treatment strategy
3. View predicted outcomes

### 2. Mobile App

#### Basic Workflow
1. Launch Expo app: `npm start` in `CropAI-Mobile/`
2. Scan QR code on device or open in web browser
3. Grant permissions for camera and location
4. Select **Upload** to capture or import image
5. Provide location and preferences
6. View results with interactive components
7. Access farm history for tracking
8. Notification for Treatement Reminder.

### 3. API Usage (Manual)

#### Analyze Crop Image
```bash
curl -X POST "http://localhost:8000/analyze" \
  -F "image=@path/to/leaf.jpg" \
  -F "lat=28.6139" \
  -F "lon=77.2090" \
  -F "treatment_type=organic" \
  -F "language=english"
```

#### Response Structure
```json
{
  "disease_name": "Late Blight",
  "confidence": 0.92,
  "severity": "HIGH",
  "damage_ratio": 0.65,
  "xai_heatmap_url": "/outputs/heatmaps/heatmap_xyz.png",
  "weather": {
    "temperature": 22.5,
    "humidity": 78,
    "rainfall": 15.2
  },
  "treatment_plan": {
    "organic": {...},
    "chemical": {...}
  },
  "audio_url": "/outputs/audio/advisory_xyz.mp3",
  "suppliers": [...],
  "report_url": "/outputs/reports/report_xyz.pdf"
}
```

---

## 🔌 API Endpoints

### Main Analysis Endpoint

| Method | Endpoint | Purpose | Parameters |
|--------|----------|---------|------------|
| `POST` | `/analyze` | Analyze crop image | image (file), lat (float), lon (float), treatment_type (string), language (string), user_query (string) |
| `GET` | `/` | Health check & system info | - |
| `GET` | `/health` | API health status | - |

### Farm Memory Endpoints

| Method | Endpoint | Purpose | Parameters |
|--------|----------|---------|------------|
| `GET` | `/farm-history/{leaf_id}` | Retrieve farm history | leaf_id (path) |
| `POST` | `/farm-history/{leaf_id}` | Create history record | leaf_id (path), body (JSON) |
| `PUT` | `/farm-history/{leaf_id}/{index}` | Update history record | leaf_id, index (path), body (JSON) |
| `DELETE` | `/farm-history/{leaf_id}/{index}` | Delete specific record | leaf_id, index (path) |
| `DELETE` | `/farm-history/{leaf_id}` | Delete all records for leaf | leaf_id (path) |

### Example Request/Response

**Request**:
```bash
POST /analyze
Content-Type: multipart/form-data

image: <binary image data>
lat: 28.6139
lon: 77.2090
treatment_type: organic
language: english
```

**Response**:
```json
{
  "disease_detection": {
    "predicted_class": "Tomato___Late_blight",
    "display_name": "Late Blight",
    "confidence": 0.923,
    "top_3_predictions": [
      {"class": "Late_blight", "confidence": 0.923},
      {"class": "Early_blight", "confidence": 0.065},
      {"class": "Healthy", "confidence": 0.012}
    ]
  },
  "severity_analysis": {
    "damage_ratio": 0.45,
    "affected_area_percentage": 45,
    "severity_level": "MODERATE"
  },
  "xai_heatmap": {
    "url": "/outputs/heatmaps/gradcam_xyz.png",
    "explanation": "Red regions indicate high disease probability"
  },
  "weather_context": {
    "temperature": 22.5,
    "humidity": 78,
    "rainfall_24h": 15.2,
    "weather_impact": "High humidity (78%) creates favorable conditions for late blight development..."
  },
  "treatment_recommendations": {
    "organic": {
      "steps": ["Step 1...", "Step 2..."],
      "precautions": ["Precaution 1...", "Precaution 2..."],
      "prevention": ["Prevention 1...", "Prevention 2..."]
    },
    "chemical": {...}
  },
  "audio_advisory": {
    "url": "/outputs/audio/advisory_xyz.mp3",
    "language": "english",
    "duration": 45
  },
  "supply_chain": {
    "suppliers": [...],
    "map_data": "..."
  }
}
```

---

## 🏗 System Architecture

### 14-Agent Sequential Pipeline

The backend implements a sophisticated 14-agent orchestration pipeline that processes crop analysis requests through specialized stages:

```
INPUT IMAGE
    ↓
1. IMAGE PROCESSING AGENT
   - Normalize image dimensions
   - Convert to RGB array
   - Prepare tensors for neural networks
    ↓
2. DISEASE DETECTION AGENT
   - Load MobileNetV2 model
   - Run inference (38 classes)
   - Calculate confidence scores
    ↓
3. SEVERITY ANALYSIS AGENT
   - Calculate damage extent
   - Determine bounding box coverage
   - Assess disease progression stage
    ↓
4. EXPLAINABILITY (XAI) AGENT
   - Generate Grad-CAM heatmaps
   - Visualize disease hotspots
   - Create interpretable outputs
    ↓
5. LEAF SIGNATURE AGENT
   - Extract image embeddings
   - Generate unique identifiers
   - Enable crop tracking
    ↓
6. FARM MEMORY AGENT
   - Retrieve historical data
   - Store current analysis
   - Manage CRUD operations
    ↓
7. WEATHER INTELLIGENCE AGENT
   - Fetch real-time weather data
   - Calculate disease-weather impact
   - Provide contextual analysis
    ↓
8. MICROCLIMATE FORECAST AGENT
     - Predict 5-day weather trends
     - Assess future risk levels
     - Recommend monitoring periods
    ↓
9. ADVISORY LLM AGENT
   - Process Groq API requests
   - Generate treatment plans
   - Create prevention strategies
    ↓
10. WHAT-IF SIMULATION AGENT
   - Predict treatment outcomes
   - Model weather scenarios
   - Generate alternative strategies
    ↓
11. VOICE GENERATOR AGENT
    - Synthesize text-to-speech
    - Support multilingual output
    - Generate audio files
    ↓
12. SUPPLY CHAIN AGENT
      - Query Nominatim API
      - Find nearby suppliers
      - Map logistics options
    ↓
13. REPORT GENERATOR AGENT
    - Compile analysis data
    - Generate PDF reports
    - Include all context
    ↓
14. RESPONSE BUILDER AGENT
    - Unify all agent outputs
    - Format final response
    - Send to frontend
    ↓
OUTPUT DASHBOARD
```

### Agent Interactions & Data Flow

Each agent operates on a **shared context dictionary** that accumulates data:

```python
context = {
    "image_bytes": ...,              # Input image
    "image_filename": ...,
    "location": {"lat": 28.6139, "lon": 77.2090},
    
    # After Image Processing Agent
    "processed_array": np.array(...),
    "image_rgb_avg": {"r": 0.3, "g": 0.45, "b": 0.2},
    
    # After Disease Detection Agent
    "disease_name": "Late Blight",
    "confidence": 0.923,
    "predictions": [...],
    
    # After Severity Analysis Agent
    "damage_ratio": 0.45,
    "severity_level": "MODERATE",
    
    # After XAI Agent
    "heatmap_path": "/outputs/heatmaps/gradcam_xyz.png",
    
    # After Farm Memory Agent
    "farm_history": [...],
    
    # After Weather Agent
    "weather": {"temp": 22.5, "humidity": 78, "rain": 15.2},
    
    # After Advisory Agent
    "treatment_plan": {...},
    
    # After Supply Chain Agent
    "suppliers": [...],
    
    # ... more accumulated data
    
    "final_response": {
        # Unified output for frontend
    }
}
```

---

## 💾 Database Schema

### Farm Memory (JSON Structure)

**File**: `backend/database/farm_memory.json`

```json
{
  "leaf_records": {
    "leaf_id_123": [
      {
        "date": "2024-05-15T10:30:00Z",
        "disease": "Late Blight",
        "confidence": 0.923,
        "severity": "MODERATE",
        "weather": {
          "temperature": 22.5,
          "humidity": 78,
          "rainfall": 15.2
        },
        "treatment_applied": "Organic",
        "treatment_steps": ["Step 1", "Step 2"],
        "notes": "Applied neem oil spray",
        "image_hash": "abc123def456"
      },
      {
        "date": "2024-05-10T14:15:00Z",
        "disease": "Powdery Mildew",
        "confidence": 0.856,
        "severity": "LOW",
        ...
      }
    ],
    "leaf_id_456": [...]
  }
}
```

### Model Class Names

**File**: `backend/models/class_names.json`

```json
{
  "classes": [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Blueberry___healthy",
    "Corn___Common_rust",
    "Tomato___Late_blight",
    ...
  ],
  "total_classes": 38
}
```

---

## 📜 Scripts

### Frontend Scripts

Available commands in `frontend/package.json`:

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

### Backend Scripts

**Test APIs**:
```bash
python test_llm.py        # Test Groq LLM integration
python test_nominatim.py  # Test supplier geolocation
python test_overpass.py   # Test map data
```

**Train Model**:
```bash
python train_model.py     # Train disease detection model
```

**Generate Mock Model**:
```bash
python create_mock_model.py  # Create placeholder model for testing
```

### Mobile App Scripts

```bash
# Start Expo development server
npm start

# Run on Android device
npm run android

# Run on iOS device
npm run ios

# Run web version
npm run web
```

---

## ⚡ Performance & Optimizations

### Backend Optimizations
- **Async Processing**: AsyncIO and async/await for non-blocking I/O
- **Model Caching**: TensorFlow model loaded once at startup
- **Image Optimization**: OpenCV for efficient image resizing
- **Batch Processing**: Support for future batch analysis requests
- **API Rate Limiting**: Implement rate limiting for API endpoints
- **Response Compression**: Gzip compression for large responses

### Frontend Optimizations
- **Vite Bundling**: Fast, optimized production builds
- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Responsive image loading
- **Tailwind CSS**: Purged unused styles in production
- **Three.js**: Efficient 3D rendering with hardware acceleration
- **Memoization**: React.memo for expensive components

### Database Optimizations
- **JSON Indexing**: Fast lookups by leaf_id
- **Incremental Updates**: Only modified fields updated
- **Archive Strategy**: Move old records to archive files
- **Disk Caching**: Memory-efficient file operations

### Network Optimizations
- **CORS Configuration**: Optimized for cross-origin requests
- **Static File Serving**: Efficient delivery of heatmaps and audio
- **API Response Caching**: Cache weather and supplier data
- **Pagination**: Support for large farm history retrieval

---

## 🔧 Troubleshooting

### Backend Issues

**ModuleNotFoundError: No module named 'tensorflow'**
```bash
pip install -r requirements.txt
pip install tensorflow==2.16.1
```

**GROQ_API_KEY not found**
```bash
# Set environment variable before running
export GROQ_API_KEY="your_key_here"  # Linux/Mac
set GROQ_API_KEY=your_key_here       # Windows CMD
$env:GROQ_API_KEY="your_key_here"    # Windows PowerShell
```

**Port 8000 already in use**
```bash
# Use a different port
python main.py --port 8001
```

**Model file not found**
```bash
# Generate mock model for testing
python create_mock_model.py
```

### Frontend Issues

**Vite development server won't start**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**API connection refused**
- Ensure backend is running: `python main.py`
- Check backend is accessible: `curl http://localhost:8000/health`
- Verify CORS is enabled in FastAPI

**Tailwind CSS not loading**
```bash
# Rebuild Tailwind CSS
npm run build
```

### Mobile App Issues

**Expo QR code not scanning**
- Ensure camera permissions are granted
- Try opening directly: `expo://your-tunnel-url`

**Image picker not working**
```bash
# Grant permissions manually
# Android: Settings → Apps → Permissions
# iOS: Settings → [App Name] → Photos
```

---

## 👥 Contributing Guidelines

We welcome contributions! Please follow these guidelines:

### Code Style
- **Python**: Follow PEP 8 style guide
- **JavaScript**: Use ESLint configuration
- **Comments**: Add docstrings to all functions
- **Git**: Use meaningful commit messages

### Pull Request Process
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make changes and commit: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Create Pull Request with detailed description

### Reporting Bugs
- Use GitHub Issues
- Include steps to reproduce
- Add system information (OS, Python/Node version)
- Attach relevant logs and screenshots

### Feature Requests
- Describe use case and expected behavior
- Suggest implementation approach
- Link related issues

---

##  Team

| ![Rajdeep Chakraborty](https://avatars.githubusercontent.com/u/68934988?v=4&s=80) | ![Pritam Tung](https://avatars.githubusercontent.com/u/187090732?v=4&s=80) |![Krishnakanta Khamrui](https://avatars.githubusercontent.com/u/162899386?v=4&s=80) |
|:--:|:--:|:--:|
| **Rajdeep Chakraborty** <br> <sub>Team Leader</sub> <br> <sub>Frontend</sub> | **Pritam Tung** <br> <sub>Team Member</sub><br> <sub>Backend</sub> | **Krishnakanta Khamrui** <br> <sub>Team Member</sub><br> <sub>AI/ML</sub> |
| [![LinkedIn](https://img.icons8.com/fluency/32/000000/linkedin.png)](https://www.linkedin.com/in/rajdeepchakraborty69/) | [![LinkedIn](https://img.icons8.com/fluency/32/000000/linkedin.png)](https://www.linkedin.com/in/pritam-t-545866266/) | [![LinkedIn](https://img.icons8.com/fluency/32/000000/linkedin.png)](https://www.linkedin.com/in/krishnakanta-khamrui-1341a7371/) |

---

## 🙏 Acknowledgements

### Research & Inspiration
- **PlantVillage Dataset**: Crop disease classification dataset
- **MobileNetV2**: Efficient neural network architecture
- **Grad-CAM**: XAI visualization technique

### APIs & Services
- [Groq API](https://groq.com/) - High-speed LLM inference
- [OpenWeatherMap](https://openweathermap.org/) - Weather data
- [Nominatim](https://nominatim.org/) - Geolocation services
- [Leaflet](https://leafletjs.com/) - Interactive mapping

### Libraries & Frameworks
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [React](https://react.dev/) - UI library
- [TensorFlow](https://www.tensorflow.org/) - ML framework
- [Expo](https://expo.dev/) - React Native platform
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS

---

<div align="center">
  Made with ❤️ for farmers and agricultural communities worldwide
</div>

<div align="right">
    <a href="#top">
        <img src="https://img.shields.io/badge/Back%20to%20Top-000000?style=for-the-badge&logo=github&logoColor=white" alt="Back to Top">
    </a>
</div>