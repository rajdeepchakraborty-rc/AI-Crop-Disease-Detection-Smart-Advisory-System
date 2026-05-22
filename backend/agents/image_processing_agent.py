"""
AGENT 1 – IMAGE PROCESSING AGENT
Resizes to 224x224, normalizes pixel values, detects low-light,
and applies Night Vision Enhancement (brightness boost) if needed.
"""
import io
import numpy as np
from PIL import Image, ImageEnhance


class ImageProcessingAgent:
    async def run(self, context: dict):
        image_bytes: bytes = context["image_bytes"]

        # Load image
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        original_size = img.size

        # Resize to 224x224 (MobileNetV2 input)
        img_resized = img.resize((224, 224), Image.LANCZOS)

        # Convert to numpy array and normalize [0, 1]
        arr = np.array(img_resized, dtype=np.float32) / 255.0

        # Detect lighting condition (mean brightness)
        brightness = float(np.mean(arr))
        if brightness < 0.25:
            lighting_condition = "low-light"
            enhancement_applied = True
            # Night Vision Enhancement: boost brightness + contrast
            enhancer = ImageEnhance.Brightness(img_resized)
            img_resized = enhancer.enhance(2.5)
            enhancer = ImageEnhance.Contrast(img_resized)
            img_resized = enhancer.enhance(1.8)
            # Add green tint (night vision effect)
            r, g, b = img_resized.split()
            g = ImageEnhance.Brightness(g).enhance(1.4)
            img_resized = Image.merge("RGB", (r, g, b))
            arr = np.array(img_resized, dtype=np.float32) / 255.0
        elif brightness < 0.45:
            lighting_condition = "dim"
            enhancement_applied = False
        else:
            lighting_condition = "normal"
            enhancement_applied = False

        # Dominant color analysis for downstream agents
        avg_r = float(np.mean(arr[:, :, 0]))
        avg_g = float(np.mean(arr[:, :, 1]))
        avg_b = float(np.mean(arr[:, :, 2]))

        # Store processed image array and metadata in context
        context["processed_array"] = arr          # shape (224,224,3)
        context["processed_image"] = img_resized  # PIL Image
        context["original_size"] = original_size
        context["lighting_condition"] = lighting_condition
        context["enhancement_applied"] = enhancement_applied
        context["image_rgb_avg"] = {"r": avg_r, "g": avg_g, "b": avg_b}
        context["processed_image_description"] = (
            f"Image resized from {original_size} to 224x224. "
            f"Lighting: {lighting_condition}. "
            f"Night vision enhancement: {'applied' if enhancement_applied else 'not needed'}. "
            f"Dominant RGB averages — R:{avg_r:.2f} G:{avg_g:.2f} B:{avg_b:.2f}."
        )
