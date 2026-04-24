from __future__ import annotations

import pandas as pd

from .schemas import PlayerScoreRequest
from .train import (
    encode_availability,
    encode_injury_status,
    encode_position_group,
    encode_suspension_status,
)


def build_prediction_frame(request: PlayerScoreRequest, feature_columns: list[str]) -> pd.DataFrame:
    frame = pd.DataFrame(
        [
            {
                "training_rating": request.training_rating,
                "fitness": request.fitness,
                "fatigue": request.fatigue,
                "morale": request.morale,
                "availability": encode_availability(request.availability),
                "injury_status": encode_injury_status(request.injury_status),
                "suspension_status": encode_suspension_status(request.suspension_status),
                "position_group": encode_position_group(request.position_group),
                "age": request.age,
            }
        ]
    )

    return frame[feature_columns]
