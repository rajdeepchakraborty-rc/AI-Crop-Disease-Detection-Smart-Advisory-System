import os
import json
from train_model import build_model, MODEL_DIR, MODEL_PATH, NAMES_PATH, PLANT_VILLAGE_CLASSES

def main():
    os.makedirs(MODEL_DIR, exist_ok=True)
    model, _ = build_model()
    model.save(MODEL_PATH)
    with open(NAMES_PATH, "w") as f:
        json.dump(PLANT_VILLAGE_CLASSES, f, indent=2)
    print(f"Mock model saved to {MODEL_PATH}")
    print(f"Names saved to {NAMES_PATH}")

if __name__ == "__main__":
    main()
