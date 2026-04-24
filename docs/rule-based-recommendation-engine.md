# Rule-Based Recommendation Engine

## Overview
Phase 7 introduces the first intelligent decision layer of the project as a fully explainable rule-based engine. This engine uses weekly player condition data and approved formations to produce a starting lineup and tactical recommendation for one match week.

## Explainability-First Design
- The engine is deterministic.
- The engine uses visible weighted scoring rather than opaque prediction logic.
- Every selected player receives a human-readable selection reason.
- Excluded players receive a human-readable exclusion reason when relevant.
- ML support is intentionally not used in this phase.

## Scoring Factors
The current rule-based score is derived from:
- training rating
- fitness
- morale
- fatigue as an inverse factor

The score is designed to reward:
- strong recent training
- high physical readiness
- good psychological readiness
- lower fatigue

## Eligibility Rules
A player is excluded from selection if any of the following is true:
- unavailable
- injured
- suspended
- not active in the squad

## Formation Evaluation
The engine evaluates only the approved seeded formations:
- `4-3-3`
- `4-4-2`
- `4-2-3-1`
- `3-5-2`

For each formation, it checks:
- enough eligible players exist
- enough players exist in each tactical group
- one goalkeeper can be selected
- defenders, midfielders, and forwards satisfy the formation counts

## Selection Logic
- Eligible players are scored first.
- Players are grouped by tactical position group.
- The top-scoring players required for each formation slot are selected.
- The formation with the highest total team score is chosen.
- The result is stored in the database with recommendation player records.

## Stored Recommendation Output
Each saved recommendation includes:
- selected formation
- recommendation summary
- rule score summary
- selected players
- excluded players where relevant
- player-level selection or exclusion reasons

## Failure Conditions
The engine returns a clear failure when:
- no weekly records exist
- fewer than 11 eligible players are available
- no approved formation fits the eligible player balance
- the match week is already marked completed

## Academic Value
This phase is academically strong because it demonstrates intelligent decision support without sacrificing transparency. It also prepares a clean baseline for Phase 8, where ML can be added as a secondary enhancement rather than replacing the explainable engine.
