from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import numpy as np
import pandas as pd

from .model import build_model, save_model


POSITION_MAP = {
    "GOALKEEPER": 0,
    "DEFENDER": 1,
    "MIDFIELDER": 2,
    "FORWARD": 3,
}

AVAILABILITY_MAP = {
    "AVAILABLE": 1,
    "UNAVAILABLE": 0,
}

INJURY_MAP = {
    "FIT": 1.0,
    "MINOR_KNOCK": 0.55,
    "INJURED": 0.05,
}

SUSPENSION_MAP = {
    "ELIGIBLE": 1,
    "SUSPENDED": 0,
}


@dataclass
class TrainingArtifacts:
    model_name: str
    row_count: int


def encode_position_group(value: str) -> int:
    return POSITION_MAP.get(value, -1)


def encode_availability(value: str) -> int:
    return AVAILABILITY_MAP.get(value, 0)


def encode_injury_status(value: str) -> float:
    return INJURY_MAP.get(value, 0.0)


def encode_suspension_status(value: str) -> int:
    return SUSPENSION_MAP.get(value, 0)


def build_training_dataframe(sample_size: int = 800) -> pd.DataFrame:
    rng = np.random.default_rng(42)

    data = {
        "training_rating": rng.integers(1, 11, sample_size),
        "fitness": rng.integers(40, 101, sample_size),
        "fatigue": rng.integers(0, 61, sample_size),
        "morale": rng.integers(30, 101, sample_size),
        "availability": rng.choice(["AVAILABLE", "UNAVAILABLE"], sample_size, p=[0.9, 0.1]),
        "injury_status": rng.choice(
            ["FIT", "MINOR_KNOCK", "INJURED"],
            sample_size,
            p=[0.78, 0.17, 0.05],
        ),
        "suspension_status": rng.choice(
            ["ELIGIBLE", "SUSPENDED"],
            sample_size,
            p=[0.95, 0.05],
        ),
        "position_group": rng.choice(
            ["GOALKEEPER", "DEFENDER", "MIDFIELDER", "FORWARD"],
            sample_size,
            p=[0.1, 0.35, 0.3, 0.25],
        ),
        "age": rng.integers(17, 36, sample_size),
    }

    frame = pd.DataFrame(data)

    base_target = (
        frame["training_rating"] * 8
        + frame["fitness"] * 0.38
        + frame["morale"] * 0.22
        + (100 - frame["fatigue"]) * 0.28
        + frame["availability"].map(AVAILABILITY_MAP) * 8
        + frame["injury_status"].map(INJURY_MAP) * 12
        + frame["suspension_status"].map(SUSPENSION_MAP) * 6
    )

    noise = rng.normal(0, 2.2, sample_size)
    frame["target_score"] = (base_target + noise).clip(0, 100)

    return frame


def transform_features(frame: pd.DataFrame) -> pd.DataFrame:
    transformed = frame.copy()
    transformed["position_group"] = transformed["position_group"].map(encode_position_group)
    transformed["availability"] = transformed["availability"].map(encode_availability)
    transformed["injury_status"] = transformed["injury_status"].map(encode_injury_status)
    transformed["suspension_status"] = transformed["suspension_status"].map(encode_suspension_status)
    return transformed


def train_and_save_model() -> TrainingArtifacts:
    training_frame = build_training_dataframe()
    transformed = transform_features(training_frame)

    feature_columns = [
        "training_rating",
        "fitness",
        "fatigue",
        "morale",
        "availability",
        "injury_status",
        "suspension_status",
        "position_group",
        "age",
    ]

    model = build_model()
    model.fit(transformed[feature_columns], training_frame["target_score"])

    save_model(
        {
            "model_name": "random_forest_v1",
            "feature_columns": feature_columns,
            "model": model,
        }
    )

    return TrainingArtifacts(model_name="random_forest_v1", row_count=len(training_frame))
