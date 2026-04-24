from pydantic import BaseModel, ConfigDict, Field


class PlayerScoreRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    player_id: str | None = None
    position_group: str
    training_rating: int = Field(ge=1, le=10)
    fitness: int = Field(ge=0, le=100)
    fatigue: int = Field(ge=0, le=100)
    morale: int = Field(ge=0, le=100)
    availability: str
    injury_status: str
    suspension_status: str
    age: int = Field(ge=15, le=45)


class PlayerScoreResponse(BaseModel):
    predicted_score: float
    model_name: str
