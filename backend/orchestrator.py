from agents.image_processing_agent import ImageProcessingAgent
from agents.disease_detection_agent import DiseaseDetectionAgent
from agents.severity_analysis_agent import SeverityAnalysisAgent
from agents.explainability_agent import ExplainabilityAgent
from agents.leaf_signature_agent import LeafSignatureAgent
from agents.farm_memory_agent import FarmMemoryAgent
from agents.weather_intelligence_agent import WeatherIntelligenceAgent
from agents.advisory_llm_agent import AdvisoryLLMAgent
from agents.whatif_simulation_agent import WhatIfSimulationAgent
from agents.voice_generator_agent import VoiceGeneratorAgent
from agents.report_generator_agent import ReportGeneratorAgent
from agents.response_builder_agent import ResponseBuilderAgent
from agents.microclimate_forecast_agent import MicroclimateForecastAgent
from agents.supply_chain_agent import SupplyChainAgent


class MasterOrchestrator:
    """
    MASTER AI ORCHESTRATOR
    Calls each of the 12 agents in sequence, passing a shared context dict.
    Each agent reads what it needs and writes its output back into context.
    """

    def __init__(self):
        self.pipeline = [
            ("1. Image Processing",       ImageProcessingAgent()),
            ("2. Disease Detection",       DiseaseDetectionAgent()),
            ("3. Severity Analysis",       SeverityAnalysisAgent()),
            ("4. Explainability (XAI)",    ExplainabilityAgent()),
            ("5. Leaf Signature",          LeafSignatureAgent()),
            ("6. Farm Memory",             FarmMemoryAgent()),
            ("7. Weather Intelligence",    WeatherIntelligenceAgent()),
            ("8. Microclimate Forecast", MicroclimateForecastAgent()),
            ("9. Advisory LLM",            AdvisoryLLMAgent()),
            ("10. What-If Simulation",      WhatIfSimulationAgent()),
            ("11. Voice Generator",        VoiceGeneratorAgent()),
            ("12. Supply Chain",         SupplyChainAgent()),
            ("13. Report Generator",       ReportGeneratorAgent()),
            ("14. Response Builder",       ResponseBuilderAgent()),
        ]

    async def run(self, input_data: dict) -> dict:
        context = dict(input_data)
        context["agent_logs"] = []

        for name, agent in self.pipeline:
            try:
                print(f"[ORCHESTRATOR] Running {name}...")
                await agent.run(context)
                context["agent_logs"].append({"agent": name, "status": "success"})
            except Exception as e:
                print(f"[ORCHESTRATOR] {name} ERROR: {e}")
                context["agent_logs"].append({"agent": name, "status": "error", "error": str(e)})

        return context.get("final_response", {})
