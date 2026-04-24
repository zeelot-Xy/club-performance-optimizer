import {
  AvailabilityStatus,
  InjuryStatus,
  MatchWeekStatus,
  PlayerStatus,
  PositionGroup,
  RecommendationPlayerRole,
  RecommendationStatus,
  SuspensionStatus,
  type Formation,
  type Player,
  type WeeklyPerformance,
} from "@prisma/client";

import { HTTP_STATUS } from "../../config/http.js";
import { HttpError } from "../../lib/http-error.js";

type WeeklyRecordWithPlayer = WeeklyPerformance & {
  player: Player;
};

type ScoredCandidate = {
  record: WeeklyRecordWithPlayer;
  score: number;
  selectionReason: string;
  exclusionReason: string | null;
};

type FormationEvaluation = {
  formation: Formation;
  selected: ScoredCandidate[];
  excluded: ScoredCandidate[];
  teamScore: number;
  summary: string;
  ruleScoreSummary: string;
};

const GROUP_COUNTS: Record<string, number> = {
  GOALKEEPER: 1,
};

const ROLE_BY_GROUP: Record<PositionGroup, RecommendationPlayerRole> = {
  GOALKEEPER: RecommendationPlayerRole.GOALKEEPER,
  DEFENDER: RecommendationPlayerRole.DEFENDER,
  MIDFIELDER: RecommendationPlayerRole.MIDFIELDER,
  FORWARD: RecommendationPlayerRole.FORWARD,
};

const normalizeTrainingRating = (value: number) => value * 10;
const normalizeFatigue = (value: number) => 100 - value;

export const scorePlayer = (record: WeeklyRecordWithPlayer) => {
  const trainingComponent = normalizeTrainingRating(record.trainingRating) * 0.3;
  const fitnessComponent = record.fitness * 0.3;
  const moraleComponent = record.morale * 0.15;
  const fatigueComponent = normalizeFatigue(record.fatigue) * 0.25;

  const score = Number(
    (trainingComponent + fitnessComponent + moraleComponent + fatigueComponent).toFixed(2),
  );

  const reason = [
    `training ${record.trainingRating}/10`,
    `fitness ${record.fitness}/100`,
    `morale ${record.morale}/100`,
    `fatigue ${record.fatigue}/100`,
  ].join(", ");

  return {
    score,
    reason: `Selected based on ${reason}.`,
  };
};

const isEligible = (record: WeeklyRecordWithPlayer) =>
  record.availability === AvailabilityStatus.AVAILABLE &&
  record.injuryStatus !== InjuryStatus.INJURED &&
  record.suspensionStatus !== SuspensionStatus.SUSPENDED &&
  record.player.status === PlayerStatus.ACTIVE;

const buildExclusionReason = (record: WeeklyRecordWithPlayer) => {
  if (record.player.status !== PlayerStatus.ACTIVE) {
    return "Excluded because the player is not active in the squad.";
  }

  if (record.availability !== AvailabilityStatus.AVAILABLE) {
    return "Excluded because the player is unavailable this week.";
  }

  if (record.injuryStatus === InjuryStatus.INJURED) {
    return "Excluded because the player is injured.";
  }

  if (record.suspensionStatus === SuspensionStatus.SUSPENDED) {
    return "Excluded because the player is suspended.";
  }

  return "Excluded because the player was not selected ahead of stronger candidates in the same tactical group.";
};

const countRequiredByGroup = (formation: Formation) => ({
  GOALKEEPER: 1,
  DEFENDER: formation.defenders,
  MIDFIELDER: formation.midfielders,
  FORWARD: formation.forwards,
});

const assignStartingPosition = (
  role: RecommendationPlayerRole,
  record: WeeklyRecordWithPlayer,
  index: number,
) => `${role.toLowerCase()}-${index}: ${record.player.primaryPosition}`;

export const generateRecommendationFromWeeklyData = (
  matchWeekLabel: string,
  weeklyRecords: WeeklyRecordWithPlayer[],
  formations: Formation[],
) => {
  if (!weeklyRecords.length) {
    throw new HttpError(
      HTTP_STATUS.BAD_REQUEST,
      "No weekly performance records are available for this match week.",
    );
  }

  const eligibleRecords = weeklyRecords.filter(isEligible);

  if (eligibleRecords.length < 11) {
    throw new HttpError(
      HTTP_STATUS.BAD_REQUEST,
      "A recommendation cannot be generated because fewer than 11 eligible players are available.",
    );
  }

  const scoredCandidates = eligibleRecords.map((record) => {
    const score = scorePlayer(record);
    return {
      record,
      score: score.score,
      selectionReason: score.reason,
      exclusionReason: null,
    };
  });

  const ineligibleCandidates = weeklyRecords
    .filter((record) => !isEligible(record))
    .map((record) => ({
      record,
      score: 0,
      selectionReason: "",
      exclusionReason: buildExclusionReason(record),
    }));

  const evaluations: FormationEvaluation[] = formations
    .map((formation) => {
      const required = countRequiredByGroup(formation);

      const selected: ScoredCandidate[] = [];
      const excluded: ScoredCandidate[] = [...ineligibleCandidates];

      for (const [group, needed] of Object.entries(required)) {
        const candidates = scoredCandidates
          .filter((candidate) => candidate.record.player.positionGroup === group)
          .sort((left, right) => right.score - left.score);

        if (candidates.length < needed) {
          return null;
        }

        selected.push(...candidates.slice(0, needed));
        excluded.push(
          ...candidates.slice(needed).map((candidate) => ({
            ...candidate,
            exclusionReason:
              "Excluded because the chosen formation only has limited slots for this tactical group.",
          })),
        );
      }

      if (selected.length !== 11) {
        return null;
      }

      const uniqueSelectedIds = new Set(selected.map((candidate) => candidate.record.playerId));
      const remainingEligible = scoredCandidates.filter(
        (candidate) => !uniqueSelectedIds.has(candidate.record.playerId),
      );

      excluded.push(
        ...remainingEligible.map((candidate) => ({
          ...candidate,
          exclusionReason:
            candidate.exclusionReason ??
            "Excluded because the player was ranked below the selected lineup for this formation.",
        })),
      );

      const teamScore = Number(
        selected.reduce((sum, candidate) => sum + candidate.score, 0).toFixed(2),
      );

      const summary = `For ${matchWeekLabel}, the system recommends ${formation.code} with a rule-based team score of ${teamScore}.`;
      const ruleScoreSummary = `The lineup was selected from weekly training rating, fitness, morale, and fatigue with deterministic formation-fit checks.`;

      return {
        formation,
        selected,
        excluded,
        teamScore,
        summary,
        ruleScoreSummary,
      };
    })
    .filter((value): value is FormationEvaluation => value !== null)
    .sort((left, right) => right.teamScore - left.teamScore);

  if (!evaluations.length) {
    throw new HttpError(
      HTTP_STATUS.BAD_REQUEST,
      "No valid formation can be generated from the currently eligible players.",
    );
  }

  const bestEvaluation = evaluations[0];

  const recommendationPlayers = [
    ...bestEvaluation.selected
      .sort((left, right) => right.score - left.score)
      .reduce<
        Array<{
          playerId: string;
          role: RecommendationPlayerRole;
          startingPosition: string | null;
          isSelected: boolean;
          computedScore: number;
          selectionReason: string | null;
          exclusionReason: string | null;
          rankOrder: number | null;
        }>
      >((entries, candidate, index) => {
        const role = ROLE_BY_GROUP[candidate.record.player.positionGroup];
        const roleCount =
          entries.filter((entry) => entry.role === role && entry.isSelected).length + 1;

        entries.push({
          playerId: candidate.record.playerId,
          role,
          startingPosition: assignStartingPosition(role, candidate.record, roleCount),
          isSelected: true,
          computedScore: candidate.score,
          selectionReason: candidate.selectionReason,
          exclusionReason: null,
          rankOrder: index + 1,
        });

        return entries;
      }, []),
    ...bestEvaluation.excluded.map((candidate, index) => ({
      playerId: candidate.record.playerId,
      role: RecommendationPlayerRole.EXCLUDED,
      startingPosition: null,
      isSelected: false,
      computedScore: candidate.score,
      selectionReason: null,
      exclusionReason: candidate.exclusionReason ?? buildExclusionReason(candidate.record),
      rankOrder: bestEvaluation.selected.length + index + 1,
    })),
  ];

  return {
    status: RecommendationStatus.FINAL,
    formationId: bestEvaluation.formation.id,
    summary: bestEvaluation.summary,
    ruleScoreSummary: bestEvaluation.ruleScoreSummary,
    mlSupportSummary: null,
    recommendationPlayers,
  };
};

export const validateMatchWeekReady = (status: MatchWeekStatus) => {
  if (status === MatchWeekStatus.COMPLETED) {
    throw new HttpError(
      HTTP_STATUS.BAD_REQUEST,
      "Recommendations cannot be generated for a completed match week.",
    );
  }
};
