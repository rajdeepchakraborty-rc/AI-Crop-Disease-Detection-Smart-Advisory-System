"""
AGENT 10 – VOICE GENERATOR AGENT
Converts the agricultural advisory into a spoken MP3 script using gTTS.
"""
import os
import uuid
from pathlib import Path


def _build_voice_script(context: dict) -> str:
    # Use the LLM-generated script if available, which will be in the correct language
    if context.get("advice", {}).get("voice_script"):
        return context["advice"]["voice_script"]

    # Fallback to English script
    disease = context.get("disease_name", "an unknown disease")
    severity = context.get("severity_level", "moderate severity")
    confidence = context.get("confidence_score", 0)
    leaf_id = context.get("leaf_id", "unknown")
    
    script = (
        f"Hello. Your leaf {leaf_id} has been analyzed. "
        f"Detection Result: {disease} with {confidence} percent confidence. "
        f"Severity is {severity}. Please check the report for details."
    )
    return script


class VoiceGeneratorAgent:
    async def run(self, context: dict):
        script = _build_voice_script(context)
        context["voice_script"] = script

        audio_dir = Path("outputs/audio")
        audio_dir.mkdir(parents=True, exist_ok=True)

        filename = f"advisory_{uuid.uuid4().hex[:8]}.mp3"
        filepath = audio_dir / filename

        try:
            from gtts import gTTS
            lang_str = context.get("language", "english").lower()
            lang_code = "en"
            if lang_str == "hindi":
                lang_code = "hi"
            elif lang_str == "bengali":
                lang_code = "bn"
                
            tts = gTTS(text=script, lang=lang_code, slow=False)
            tts.save(str(filepath))
            context["audio_url"] = f"/outputs/audio/{filename}"
            print(f"[VoiceAgent] Audio saved: {filepath}")
        except Exception as e:
            print(f"[VoiceAgent] gTTS error: {e}")
            context["audio_url"] = None
