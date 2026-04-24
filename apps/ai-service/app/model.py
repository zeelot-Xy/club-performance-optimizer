from __future__ import annotations

from pathlib import Path
from typing import Any

import joblib
from sklearn.ensemble import RandomForestRegressor


MODEL_DIR = Path(__file__).resolve().parent / "model_store"
MODEL_PATH = MODEL_DIR / "random_forest_v1.joblib"


def build_model() -> RandomForestRegressor:
    return RandomForestRegressor(
        n_estimators=120,
        max_depth=8,
        random_state=42,
    )


def save_model(model: Any) -> None:
    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODEL_PATH)


def load_model() -> Any | None:
    if not MODEL_PATH.exists():
        return None

    return joblib.load(MODEL_PATH)
