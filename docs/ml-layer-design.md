# ML Layer Design

## Overview
Phase 8 adds an optional machine learning support layer to the project without replacing the explainable rule-based recommendation engine. The ML layer predicts a support score for player suitability and is used only as supplementary evidence.

## Model Choice
- Model: `RandomForestRegressor`
- Reason: suitable for structured tabular data, easy to defend academically, and lighter than deep learning for this project scope

## Input Features
The ML support layer uses the same family of weekly football readiness fields already used by the rule engine:
- training rating
- fitness
- fatigue
- morale
- availability
- injury status
- suspension status
- position group
- age

## Training Strategy
- training data is synthetically generated inside the AI service
- the target score is derived from a transparent weighted formula plus small noise
- the trained model is saved with `joblib`
- the model is loaded on startup or trained automatically if missing

## FastAPI Endpoints

### `GET /health`
Returns:
- service status
- model loaded state
- model name

### `POST /predict/player-score`
Accepts a structured player readiness payload and returns:
- `predicted_score`
- `model_name`

## Backend Integration
- the backend remains the only orchestrator
- the rule-based engine still decides the final lineup
- the backend calls the AI service after the lineup is selected
- the backend stores a short `mlSupportSummary` on the recommendation
- if the AI service is unavailable, the backend falls back gracefully and stores a readable fallback message

## Academic Positioning
This ML layer is intentionally secondary. Its purpose is to increase academic value by showing how a simple supervised model can complement the explainable engine, not replace it.
