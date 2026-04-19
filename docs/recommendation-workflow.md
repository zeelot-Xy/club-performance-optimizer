# Recommendation Workflow

## Overview
This document describes how the system transforms weekly player information into an explainable formation and starting lineup recommendation.

## End-to-End Workflow
1. The Coach/Admin creates or selects a `MatchWeek`.
2. The Coach/Admin records weekly player metrics such as training rating, fitness, fatigue, morale, injury status, and availability.
3. The backend validates that required weekly records and status values are present and consistent.
4. The backend filters out players who are injured, suspended, or unavailable for the selected week.
5. The rule-based engine computes a weighted suitability score for each eligible player.
6. The backend groups players by tactical role and checks whether the approved formations can be satisfied by the available squad balance.
7. The backend evaluates candidate formations from the controlled set: `4-3-3`, `4-4-2`, `4-2-3-1`, and `3-5-2`.
8. The backend selects the best valid formation based on overall fit and player suitability scores.
9. The backend chooses the starting lineup for that formation using rule-based ranking, position fit, and availability constraints.
10. The backend generates textual explanations for player inclusion and exclusion.
11. If enabled, the backend may request an optional predictive score from the FastAPI ML service to append as supporting evidence.
12. The backend stores the recommendation summary, selected formation, selected players, and explanation records.
13. The frontend displays the final lineup, formation, and explanation details to the Coach/Admin.

## Explainability Requirements
- Every recommended player must have a selection reason.
- Excluded players should have an exclusion reason when exclusion is materially important.
- The system must identify that rule-based scoring is the primary logic source.
- Optional ML values must appear as supportive evidence only.

## Failure Handling

### Incomplete Weekly Data
- If required weekly metrics are missing for too many key players, the system should reject recommendation generation.
- The response must explain that the recommendation could not be produced because data is incomplete.

### Fewer Than 11 Eligible Players
- If fewer than 11 players remain after status filtering, the system must stop normal lineup generation.
- The response must explain the insufficiency and identify the cause where possible.

### Invalid Formation Fit
- If the available players cannot satisfy any approved formation with reasonable positional coverage, the system must reject recommendation generation.
- The response must explain that no valid formation fit was found for the current weekly squad condition.

### Score Ties
- If two players have very similar scores for the same role, the system should apply deterministic tie-breaking based on position fit, availability confidence, or predefined secondary criteria.
- The final explanation should note the preference if the tie affected selection.

## Stored Outputs
- Match week identifier
- Chosen formation
- Starting lineup
- Player-level rule-based scores
- Selection reasons
- Exclusion reasons where relevant
- Optional ML support summary
- Generation timestamp
