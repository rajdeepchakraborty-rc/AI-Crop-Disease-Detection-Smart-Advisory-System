"""
AGENT 2 – DISEASE DETECTION AGENT
Uses MobileNetV2 (TensorFlow/Keras) for plant disease classification.
Falls back to intelligent color-texture simulation if model is unavailable.
Reference dataset: PlantVillage (38 disease classes)
"""
import numpy as np
import random
import io
import os

PLANT_VILLAGE_CLASSES = [
    "Apple___Apple_scab", "Apple___Black_rot", "Apple___Cedar_apple_rust", "Apple___healthy",
    "Blueberry___healthy", "Cherry___Powdery_mildew", "Cherry___healthy",
    "Corn___Cercospora_leaf_spot", "Corn___Common_rust", "Corn___Northern_Leaf_Blight", "Corn___healthy",
    "Grape___Black_rot", "Grape___Esca_Black_Measles", "Grape___Leaf_blight", "Grape___healthy",
    "Orange___Haunglongbing_Citrus_greening",
    "Peach___Bacterial_spot", "Peach___healthy",
    "Pepper___Bacterial_spot", "Pepper___healthy",
    "Potato___Early_blight", "Potato___Late_blight", "Potato___healthy",
    "Raspberry___healthy", "Soybean___healthy", "Squash___Powdery_mildew",
    "Strawberry___Leaf_scorch", "Strawberry___healthy",
    "Tomato___Bacterial_spot", "Tomato___Early_blight", "Tomato___Late_blight",
    "Tomato___Leaf_Mold", "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites", "Tomato___Target_Spot",
    "Tomato___Yellow_Leaf_Curl_Virus", "Tomato___mosaic_virus", "Tomato___healthy",
]

DISEASE_DISPLAY = {c: c.replace("___", " ").replace("_", " ") for c in PLANT_VILLAGE_CLASSES}





class DiseaseDetectionAgent:
    def __init__(self):
        self.model = None
        self._try_load_model()

    def _try_load_model(self):
        model_path = "models/crop_disease_model.h5"
        if os.path.exists(model_path):
            try:
                import tensorflow as tf
                self.model = tf.keras.models.load_model(model_path)
                print("[DiseaseDetectionAgent] Loaded trained model.")
            except Exception as e:
                print(f"[DiseaseDetectionAgent] Model load failed: {e}. Using simulation.")
        else:
            print("[DiseaseDetectionAgent] No model file found!")

    async def run(self, context: dict):
        rgb_avg = context.get("image_rgb_avg", {"r": 0.3, "g": 0.45, "b": 0.2})
        arr = context.get("processed_array")

        if self.model is not None and arr is not None:
            try:
                import tensorflow as tf
                batch = np.expand_dims(arr, axis=0)
                preds = self.model.predict(batch, verbose=0)[0]
                idx = int(np.argmax(preds))
                confidence = round(float(preds[idx]) * 100, 1)
                disease_class = PLANT_VILLAGE_CLASSES[idx] if idx < len(PLANT_VILLAGE_CLASSES) else "Unknown"

                # REJECT UNKNOWN/UNTRAINED IMAGES:
                # If the model is not confident, it means it's likely an untrained leaf or random object.
                if confidence < 60.0:
                    raise Exception("Our model is not trained with this leaf. Please upload a valid, clear image of a supported crop.")

            except Exception as e:
                print(f"[DiseaseDetectionAgent] Inference error: {e}")
                # Re-raise the exception so it stops the pipeline
                raise Exception(str(e))
        else:
            raise Exception("No disease detection model loaded. Color-based fallback is disabled.")

        disease_name = DISEASE_DISPLAY.get(disease_class, disease_class)
        context["disease_class"] = disease_class
        context["disease_name"] = disease_name
        context["confidence_score"] = confidence
 
        
