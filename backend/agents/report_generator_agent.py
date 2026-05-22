"""
AGENT 11 – REPORT GENERATOR AGENT
Creates a structured professional agricultural report (HTML + plain text).
"""
from datetime import datetime


class ReportGeneratorAgent:
    async def run(self, context: dict):
        disease = context.get("disease_name", "Unknown Disease")
        confidence = context.get("confidence_score", 0)
        severity = context.get("severity_level", "Unknown")
        risk_note = context.get("risk_note", "")
        explanation = context.get("explanation", "")
        leaf_id = context.get("leaf_id", "LEAF-UNKNOWN")
        weather = context.get("weather", {})
        treatment_steps = context.get("treatment_steps", [])
        precautions = context.get("precautions", [])
        prevention = context.get("prevention", [])
        what_if = context.get("what_if_analysis")
        farm_history = context.get("farm_history", [])
        location = context.get("location", {})
        treatment_type = context.get("treatment_type", "organic")
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        lang = context.get("language", "english").lower()

        # Translations for report headers
        headers = {
            "english": {
                "title": "CLINICAL DIAGNOSTIC REPORT",
                "generated": "Date", "leaf_id": "Patient/Leaf ID", "loc": "Coordinates", "treatment": "Treatment Type",
                "disease_sec": "CLINICAL FINDINGS & DIAGNOSIS", "disease": "Diagnosis", "confidence": "Confidence", "severity": "Severity", "risk": "Risk Assessment",
                "xai_sec": "PATHOLOGY EXPLANATION (Grad-CAM XAI)",
                "weather_sec": "ENVIRONMENTAL VITALS", "temp": "Temperature", "humidity": "Humidity", "rain": "Rainfall", "impact": "Impact Analysis",
                "steps_sec": "PRESCRIPTION & PROTOCOL",
                "precautions_sec": "CONTRAINDICATIONS & PRECAUTIONS",
                "prevention_sec": "PREVENTATIVE MEASURES",
                "whatif_sec": "PROGNOSTIC SIMULATION (WHAT-IF)",
                "footer": "Verified by: CropAI — Disease Detection Project"
            },
            "hindi": {
                "title": "नैदानिक रिपोर्ट",
                "generated": "दिनांक", "leaf_id": "रोगी/पत्ता आईडी", "loc": "निर्देशांक", "treatment": "उपचार प्रकार",
                "disease_sec": "नैदानिक निष्कर्ष और निदान", "disease": "निदान", "confidence": "विश्वास", "severity": "गंभीरता", "risk": "जोखिम मूल्यांकन",
                "xai_sec": "पैथोलॉजी स्पष्टीकरण",
                "weather_sec": "पर्यावरणीय स्थिति", "temp": "तापमान", "humidity": "नमी", "rain": "वर्षा", "impact": "प्रभाव विश्लेषण",
                "steps_sec": "पर्चे और प्रोटोकॉल",
                "precautions_sec": "अंतर्विरोध और सावधानियां",
                "prevention_sec": "निवारक उपाय",
                "whatif_sec": "अनुमानित सिमुलेशन",
                "footer": "द्वारा सत्यापित: CropAI — रोग पहचान परियोजना"
            },
            "bengali": {
                "title": "ক্লিনিকাল ডায়াগনস্টিক রিপোর্ট",
                "generated": "তারিখ", "leaf_id": "রোগী/পাতা আইডি", "loc": "স্থানাঙ্ক", "treatment": "চিকিত্সার ধরন",
                "disease_sec": "ক্লিনিকাল ফলাফল এবং রোগ নির্ণয়", "disease": "রোগ নির্ণয়", "confidence": "আত্মবিশ্বাস", "severity": "তীব্রতা", "risk": "ঝুঁকি মূল্যায়ন",
                "xai_sec": "প্যাথলজি ব্যাখ্যা",
                "weather_sec": "পরিবেশগত অবস্থা", "temp": "তাপমাত্রা", "humidity": "আর্দ্রতা", "rain": "বৃষ্টিপাত", "impact": "প্রভাব বিশ্লেষণ",
                "steps_sec": "প্রেসক্রিপশন এবং প্রোটোকল",
                "precautions_sec": "সতর্কতা",
                "prevention_sec": "প্রতিরোধমূলক ব্যবস্থা",
                "whatif_sec": "সিমুলেশন",
                "footer": "যাচাইকৃত: CropAI — রোগ সনাক্তকরণ প্রকল্প"
            }
        }
        
        t = headers.get(lang, headers["english"])

        steps_text = "\n".join([f"  [Rx] {s}" for s in treatment_steps])
        precautions_text = "\n".join([f"  [!] {p}" for p in precautions])
        prevention_text = "\n".join([f"  [+] {p}" for p in prevention])

        plain_report = f"""
==============================================================
                    {t['title'].upper()}
==============================================================

[ {t['generated']}: {timestamp} ]
[ {t['leaf_id']}: {leaf_id} ]
[ {t['loc']}: Lat {location.get('lat', 'N/A')}, Lon {location.get('lon', 'N/A')} ]
[ {t['treatment']}: {treatment_type.upper()} ]

--------------------------------------------------------------
❖ {t['disease_sec']}
--------------------------------------------------------------
  {t['disease']:<15}: {disease}
  {t['severity']:<15}: {severity}
  {t['confidence']:<15}: {confidence}%

  {t['risk']}:
  {risk_note}

--------------------------------------------------------------
❖ {t['xai_sec']}
--------------------------------------------------------------
  {explanation}

--------------------------------------------------------------
❖ {t['weather_sec']}
--------------------------------------------------------------
  {t['temp']:<15}: {weather.get('temperature', 'N/A')}°C
  {t['humidity']:<15}: {weather.get('humidity', 'N/A')}%
  {t['rain']:<15}: {weather.get('rainfall', 'N/A')} mm

  {t['impact']}:
  {context.get('weather_impact', 'N/A')}

--------------------------------------------------------------
❖ {t['steps_sec']}
--------------------------------------------------------------
{steps_text}

--------------------------------------------------------------
❖ {t['precautions_sec']}
--------------------------------------------------------------
{precautions_text}

--------------------------------------------------------------
❖ {t['prevention_sec']}
--------------------------------------------------------------
{prevention_text}
"""
        if what_if:
            plain_report += f"""
--------------------------------------------------------------
❖ {t['whatif_sec']}
--------------------------------------------------------------
  {what_if}
"""

        plain_report += f"""
==============================================================
{t['footer']}
==============================================================
""".lstrip()

        context["report_text"] = plain_report
