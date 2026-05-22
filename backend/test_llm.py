import asyncio
from agents.advisory_llm_agent import AdvisoryLLMAgent

async def main():
    agent = AdvisoryLLMAgent()
    context = {
        "disease_name": "Tomato Early Blight",
        "severity_level": "Severe",
        "confidence_score": 95,
        "treatment_type": "chemical",
        "language": "bengali",
        "farm_history": []
    }
    await agent.run(context)
    print("Translated Disease Name:", context.get("disease_name"))
    print("Translated Severity:", context.get("severity_level"))
    print("Steps:", context.get("treatment_steps"))
    print("Advice dict:", context.get("advice"))

if __name__ == "__main__":
    asyncio.run(main())
