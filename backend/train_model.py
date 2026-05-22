"""
=============================================================
  CROP DISEASE MODEL TRAINER
  Dataset  : PlantVillage (Kaggle: abdallahalidev/plantvillage-dataset)
  Model    : MobileNetV2 Transfer Learning (38 classes)
  Output   : models/crop_disease_model.h5
=============================================================
"""
import os
import sys
import json
import shutil
import zipfile
import numpy as np

# Suppress TensorFlow verbose logs
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"

# ── Constants ────────────────────────────────────────────────
IMG_SIZE    = 224
BATCH_SIZE  = 32
EPOCHS_HEAD = 1 # Phase 1 – train top layers only
EPOCHS_FINE = 1   # Phase 2 – fine-tune top 30 layers
DATA_DIR    = "./data/plantvillage"
MODEL_DIR   = "./models"
MODEL_PATH  = os.path.join(MODEL_DIR, "crop_disease_model.h5")
NAMES_PATH  = os.path.join(MODEL_DIR, "class_names.json")

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
NUM_CLASSES = len(PLANT_VILLAGE_CLASSES)  # 38


# ── Step 1: Download dataset from Kaggle ────────────────────
def download_dataset():
    color_dir = find_color_dir()
    if color_dir:
        base_dir = os.path.dirname(color_dir)
        print(f"[✓] Dataset already exists at: {base_dir}")
        return base_dir


    print("\n[1/4] Downloading PlantVillage dataset from Kaggle...")
    try:
        import kaggle
        kaggle.api.authenticate()
        os.makedirs(DATA_DIR, exist_ok=True)
        kaggle.api.dataset_download_files(
            "abdallahalidev/plantvillage-dataset",
            path=DATA_DIR,
            unzip=True,
            quiet=False,
        )
        print("[✓] Download complete.")
    except Exception as e:
        print(f"[✗] Kaggle download failed: {e}")
        sys.exit(1)

    color_dir = find_color_dir()
    if not color_dir:
        print("[✗] Could not locate 'color' folder in downloaded data.")
        sys.exit(1)
    return os.path.dirname(color_dir)

def find_color_dir():
    """Walk the data directory and return the path that contains class sub-folders."""
    for root, dirs, files in os.walk(DATA_DIR):
        if "color" in dirs:
            return os.path.join(root, "color")
        # Some versions unzip directly with class folders
        if any(c in dirs for c in PLANT_VILLAGE_CLASSES):
            return root
    return None


# ── Step 2: Build tf.data pipelines ─────────────────────────
def build_datasets(base_dir: str):
    import tensorflow as tf

    print(f"\n[2/4] Building datasets from: {base_dir} (color, grayscale, segmented)")

    color_dir = os.path.join(base_dir, "color")
    gray_dir = os.path.join(base_dir, "grayscale")
    seg_dir = os.path.join(base_dir, "segmented")

    def load_and_split(directory):
        if not os.path.exists(directory):
            return None, None
        
        print(f"      Loading images from {os.path.basename(directory)}...")
        ds = tf.keras.utils.image_dataset_from_directory(
            directory,
            image_size=(IMG_SIZE, IMG_SIZE),
            batch_size=None,
            label_mode="int",
            shuffle=True,
            seed=42,
        )
        total = len(ds)
        train_n = int(total * 0.80)
        val_n   = int(total * 0.10)
        
        train_ds = ds.take(train_n)
        val_ds = ds.skip(train_n).take(val_n)
        return train_ds, val_ds

    train_ds, val_ds = load_and_split(color_dir)
    
    gray_train, gray_val = load_and_split(gray_dir)
    if gray_train is not None:
        train_ds = train_ds.concatenate(gray_train)
        val_ds = val_ds.concatenate(gray_val)
        
    seg_train, seg_val = load_and_split(seg_dir)
    if seg_train is not None:
        train_ds = train_ds.concatenate(seg_train)
        val_ds = val_ds.concatenate(seg_val)

    def preprocess(img, lbl):
        img = tf.cast(img, tf.float32)
        img = tf.keras.applications.mobilenet_v2.preprocess_input(img)
        return img, lbl

    def augment(img, lbl):
        img = tf.image.random_flip_left_right(img)
        img = tf.image.random_flip_up_down(img)
        img = tf.image.random_brightness(img, 0.2)
        img = tf.image.random_contrast(img, 0.8, 1.2)
        img = tf.image.random_saturation(img, 0.8, 1.2)
        return img, lbl

    # Apply preprocessing, augmentation, batching, and prefetching
    ds_train = (
        train_ds
        .map(preprocess, num_parallel_calls=-1)
        .map(augment,    num_parallel_calls=-1)
        .shuffle(10000, seed=42)
        .batch(BATCH_SIZE)
        .prefetch(-1)
    )
    
    ds_val = (
        val_ds
        .map(preprocess, num_parallel_calls=-1)
        .batch(BATCH_SIZE)
        .prefetch(-1)
    )
    
    # We don't need to remap labels because tf.keras.utils.image_dataset_from_directory 
    # assigns labels 0-37 alphabetically, which exactly matches the order of PLANT_VILLAGE_CLASSES.
    print(f"      Train batches: {len(ds_train)}, Val batches: {len(ds_val)}")
    return ds_train, ds_val


# ── Step 3: Build MobileNetV2 model ─────────────────────────
def build_model():
    import tensorflow as tf
    from tensorflow.keras import layers, Model
    from tensorflow.keras.applications import MobileNetV2

    print("\n[3/4] Building MobileNetV2 transfer-learning model...")
    base = MobileNetV2(
        input_shape=(IMG_SIZE, IMG_SIZE, 3),
        include_top=False,
        weights="imagenet",
    )
    base.trainable = False  # frozen for phase-1

    inputs  = tf.keras.Input(shape=(IMG_SIZE, IMG_SIZE, 3), name="image_input")
    x       = base(inputs, training=False)
    x       = layers.GlobalAveragePooling2D()(x)
    x       = layers.BatchNormalization()(x)
    x       = layers.Dense(512, activation="relu")(x)
    x       = layers.Dropout(0.4)(x)
    x       = layers.Dense(256, activation="relu")(x)
    x       = layers.Dropout(0.3)(x)
    outputs = layers.Dense(NUM_CLASSES, activation="softmax", name="predictions")(x)

    model = Model(inputs, outputs)
    print(f"      Parameters: {model.count_params():,}")
    return model, base


# ── Step 4: Train ────────────────────────────────────────────
def train(model, base, ds_train, ds_val):
    import tensorflow as tf
    from tensorflow.keras.callbacks import (
        ModelCheckpoint, EarlyStopping, ReduceLROnPlateau, TensorBoard
    )

    os.makedirs(MODEL_DIR, exist_ok=True)

    ckpt = ModelCheckpoint(
        MODEL_PATH,
        monitor="val_accuracy",
        save_best_only=True,
        verbose=1,
    )
    early = EarlyStopping(monitor="val_accuracy", patience=4, restore_best_weights=True)
    lr    = ReduceLROnPlateau(monitor="val_loss", patience=2, factor=0.5, min_lr=1e-7, verbose=1)

    # ── Phase 1: Train classification head ──
    print("\n  ▶ Phase 1: Training classification head (base frozen)...")
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )
    model.fit(
        ds_train,
        validation_data=ds_val,
        epochs=EPOCHS_HEAD,
        callbacks=[ckpt, early, lr],
    )

    # ── Phase 2: Fine-tune top layers of base ──
    print("\n  ▶ Phase 2: Fine-tuning top 30 layers of MobileNetV2...")
    base.trainable = True
    for layer in base.layers[:-30]:
        layer.trainable = False

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )
    model.fit(
        ds_train,
        validation_data=ds_val,
        epochs=EPOCHS_FINE,
        callbacks=[ckpt, early, lr],
    )

    return model


# ── Main ─────────────────────────────────────────────────────
def main():
    print("=" * 60)
    print("  CROP DISEASE MODEL TRAINER")
    print(f"  Classes : {NUM_CLASSES}")
    print(f"  Image   : {IMG_SIZE}×{IMG_SIZE}")
    print(f"  Output  : {MODEL_PATH}")
    print("=" * 60)

    # 1. Download
    base_dir = download_dataset()

    # 2. Build datasets
    ds_train, ds_val = build_datasets(base_dir)

    # 3. Build model
    model, base = build_model()

    # 4. Train
    model = train(model, base, ds_train, ds_val)

    # 5. Save class names
    with open(NAMES_PATH, "w") as f:
        json.dump(PLANT_VILLAGE_CLASSES, f, indent=2)

    # 6. Final eval
    print("\n[4/4] Final evaluation on validation set...")
    import tensorflow as tf
    loss, acc = model.evaluate(ds_val, verbose=1)
    print(f"\n{'='*60}")
    print(f"  ✅  Validation Accuracy : {acc*100:.2f}%")
    print(f"  ✅  Model saved         : {MODEL_PATH}")
    print(f"  ✅  Class names saved   : {NAMES_PATH}")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    main()
