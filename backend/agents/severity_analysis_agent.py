"""
AGENT 3 – SEVERITY ANALYSIS AGENT
Rules:
  0–50  → Mild     🟢
  50–80 → Moderate 🟡
  80–100→ Severe   🔴
"""


class SeverityAnalysisAgent:
    async def run(self, context: dict):
        confidence = context.get("confidence_score", 50.0)
        disease_name = context.get("disease_name", "Unknown Disease")
        is_healthy = "healthy" in context.get("disease_class", "").lower()

        if is_healthy:
            severity_level = "Healthy 🟢"
            risk_note = "No active disease detected. Continue regular monitoring and preventive care."
            severity_score = 0
        elif confidence < 50:
            severity_level = "Mild 🟢"
            risk_note = (
                f"Early-stage {disease_name} detected with low confidence. "
                "Immediate action is not critical, but monitor closely over the next 3–5 days."
            )
            severity_score = 1
        elif confidence < 80:
            severity_level = "Moderate 🟡"
            risk_note = (
                f"Active {disease_name} infection confirmed. Spread is localized but progressing. "
                "Treatment should begin within 48 hours to prevent further crop loss."
            )
            severity_score = 2
        else:
            severity_level = "Severe 🔴"
            risk_note = (
                f"Critical {disease_name} infection detected at high confidence. "
                "Immediate intervention required. Delay may result in total crop loss for the affected plot."
            )
            severity_score = 3

        context["severity_level"] = severity_level
        context["severity_score"] = severity_score
        context["risk_note"] = risk_note
