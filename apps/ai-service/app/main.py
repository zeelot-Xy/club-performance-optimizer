import os
from datetime import datetime, timezone

from fastapi import FastAPI

app = FastAPI(
    title="Club Performance AI Service",
    version="0.1.0",
    description="Optional ML support service for the football club decision-support platform.",
)


@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "Club Performance AI service is running."}


@app.get("/health")
def read_health() -> dict[str, str]:
    return {
        "service": "ai-service",
        "status": "ok",
        "model": os.getenv("MODEL_NAME", "baseline_rule_support"),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
