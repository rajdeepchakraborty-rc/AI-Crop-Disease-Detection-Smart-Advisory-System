"""
AGENT 5 – LEAF SIGNATURE AGENT
Analyzes leaf texture + vein patterns and generates a unique hash ID (LEAF-XXXXXX).
"""
import hashlib
import numpy as np
import time


class LeafSignatureAgent:
    async def run(self, context: dict):
        arr = context.get("processed_array")
        image_bytes = context.get("image_bytes", b"")

        # Build a reproducible signature from image content + basic stats
        if arr is not None:
            # Texture: standard deviation across RGB channels
            texture_r = float(np.std(arr[:, :, 0]))
            texture_g = float(np.std(arr[:, :, 1]))
            texture_b = float(np.std(arr[:, :, 2]))

            # Vein proxy: horizontal gradient energy (Sobel-like)
            gray = 0.299 * arr[:, :, 0] + 0.587 * arr[:, :, 1] + 0.114 * arr[:, :, 2]
            grad_x = np.diff(gray, axis=1)
            grad_y = np.diff(gray, axis=0)
            vein_energy = float(np.mean(np.abs(grad_x)) + np.mean(np.abs(grad_y)))

            sig_str = f"{texture_r:.4f}|{texture_g:.4f}|{texture_b:.4f}|{vein_energy:.4f}"
        else:
            sig_str = str(len(image_bytes))

        # Generate deterministic hash from image content
        raw_hash = hashlib.sha256(image_bytes + sig_str.encode()).hexdigest()
        leaf_id = "LEAF-" + raw_hash[:6].upper()

        context["leaf_id"] = leaf_id
        if arr is not None:
            context["leaf_texture"] = {
                "texture_std_r": round(texture_r, 4),
                "texture_std_g": round(texture_g, 4),
                "texture_std_b": round(texture_b, 4),
                "vein_energy": round(vein_energy, 4),
            }
