import { env } from "../config/env.js";

type PlayerScoreRequest = {
  playerId?: string;
  positionGroup: string;
  trainingRating: number;
  fitness: number;
  fatigue: number;
  morale: number;
  availability: string;
  injuryStatus: string;
  suspensionStatus: string;
  age: number;
};

type PlayerScoreResponse = {
  predicted_score: number;
  model_name: string;
};

const mapPayload = (input: PlayerScoreRequest) => ({
  player_id: input.playerId ?? null,
  position_group: input.positionGroup,
  training_rating: input.trainingRating,
  fitness: input.fitness,
  fatigue: input.fatigue,
  morale: input.morale,
  availability: input.availability,
  injury_status: input.injuryStatus,
  suspension_status: input.suspensionStatus,
  age: input.age,
});

export const aiServiceClient = {
  async predictPlayerScore(input: PlayerScoreRequest): Promise<PlayerScoreResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), env.AI_SERVICE_TIMEOUT_MS);

    try {
      const response = await fetch(`${env.AI_SERVICE_URL}/predict/player-score`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mapPayload(input)),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`AI service responded with status ${response.status}.`);
      }

      const body = (await response.json()) as PlayerScoreResponse;

      return body;
    } finally {
      clearTimeout(timeoutId);
    }
  },
};
