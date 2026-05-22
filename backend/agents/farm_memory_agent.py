"""
AGENT 6 – FARM MEMORY AGENT
Reads and writes disease history for each leaf ID from/to a local JSON database.
Also appends the current detection to history after analysis.
"""
import json
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "database", "farm_memory.json")


class FarmMemoryAgent:
    def _load(self) -> dict:
        if os.path.exists(DB_PATH):
            with open(DB_PATH, "r") as f:
                return json.load(f)
        return {}

    def _save(self, data: dict):
        os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
        with open(DB_PATH, "w") as f:
            json.dump(data, f, indent=2)

    def get_history(self, leaf_id: str) -> list:
        db = self._load()
        return db.get(leaf_id, {}).get("history", [])

    def create_record(self, leaf_id: str, record: dict) -> dict:
        db = self._load()
        if leaf_id not in db:
            db[leaf_id] = {"history": []}
        db[leaf_id]["history"].append(record)
        self._save(db)
        return {"status": "success", "message": "Record created", "record": record}

    def update_record(self, leaf_id: str, index: int, record: dict) -> dict:
        db = self._load()
        if leaf_id in db and 0 <= index < len(db[leaf_id]["history"]):
            db[leaf_id]["history"][index].update(record)
            self._save(db)
            return {"status": "success", "message": "Record updated"}
        return {"status": "error", "message": "Record not found"}

    def delete_record(self, leaf_id: str, index: int) -> dict:
        db = self._load()
        if leaf_id in db and 0 <= index < len(db[leaf_id]["history"]):
            db[leaf_id]["history"].pop(index)
            self._save(db)
            return {"status": "success", "message": "Record deleted"}
        return {"status": "error", "message": "Record not found"}

    def delete_leaf(self, leaf_id: str) -> dict:
        db = self._load()
        if leaf_id in db:
            del db[leaf_id]
            self._save(db)
            return {"status": "success", "message": "Leaf history deleted"}
        return {"status": "error", "message": "Leaf not found"}

    async def run(self, context: dict):
        leaf_id = context.get("leaf_id", "LEAF-UNKNOWN")
        db = self._load()
        history = db.get(leaf_id, {}).get("history", [])

        context["farm_history"] = history

        # Append current detection to history (write-back after analysis)
        new_entry = {
            "date": datetime.now().strftime("%Y-%m-%d"),
            "disease": context.get("disease_name", "Unknown"),
            "confidence": context.get("confidence_score", 0),
            "severity": context.get("severity_level", "Unknown"),
            "treatment_type": context.get("treatment_type", "organic"),
            "location": context.get("location", {}),
        }
        if leaf_id not in db:
            db[leaf_id] = {"history": []}
        db[leaf_id]["history"].append(new_entry)
        # Keep last 10 records
        db[leaf_id]["history"] = db[leaf_id]["history"][-10:]
        self._save(db)
