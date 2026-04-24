import os
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException

from .model import load_model
from .predict import build_prediction_frame
from .schemas import PlayerScoreRequest, PlayerScoreResponse
from .train import train_and_save_model

app = FastAPI(
    title="Club Performance AI Service",
    version="0.1.0",
    description="Optional ML support service for the football club decision-support platform.",
)


def get_model_bundle():
    model_bundle = load_model()

    if model_bundle is None:
        train_and_save_model()
        model_bundle = load_model()

    if model_bundle is None:
        raise RuntimeError("Model bundle could not be loaded or trained.")

    return model_bundle


@app.get("/")
def read_root() -> dict[str, str]:
    return {"message": "Club Performance AI service is running."}


@app.get("/health")
def read_health() -> dict[str, str]:
    model_bundle = load_model()

    return {
        "service": "ai-service",
        "status": "ok",
        "model": model_bundle["model_name"] if model_bundle else "not_loaded",
        "model_loaded": "true" if model_bundle else "false",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.on_event("startup")
def ensure_model_ready() -> None:
    get_model_bundle()


@app.post("/predict/player-score", response_model=PlayerScoreResponse)
def predict_player_score(request: PlayerScoreRequest) -> PlayerScoreResponse:
    try:
        model_bundle = get_model_bundle()
    except RuntimeError as error:
        raise HTTPException(status_code=500, detail=str(error)) from error

    feature_frame = build_prediction_frame(request, model_bundle["feature_columns"])
    predicted_score = float(model_bundle["model"].predict(feature_frame)[0])

    return PlayerScoreResponse(
        predicted_score=round(predicted_score, 2),
        model_name=model_bundle["model_name"],
    )
