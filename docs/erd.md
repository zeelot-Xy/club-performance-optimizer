# Entity Relationship Definition

## Overview
This document defines the conceptual entities and relationships for the system in plain language. It does not use database-specific schema syntax in this phase.

ERD diagram reference: see `docs/image-reference-phase-1.md`.

## Core Entities

### AdminUser
Represents the single authenticated Coach/Admin user responsible for managing the system.

### Player
Represents a football player belonging to the single club squad.

### MatchWeek
Represents one weekly recommendation cycle associated with an upcoming match or planning period.

### WeeklyPerformance
Represents a player’s weekly condition and performance-related metrics for a specific match week.

### Formation
Represents an approved tactical formation option such as `4-3-3` or `4-2-3-1`.

### Recommendation
Represents the saved weekly recommendation outcome for a match week, including selected formation and generated explanation context.

### RecommendationPlayer
Represents a player-level record linked to a recommendation, capturing whether the player was selected and why.

### AuditLog
Represents important system actions for traceability, such as authentication or recommendation generation events.

## Relationship List
- One `AdminUser` can create or trigger many `MatchWeek` records over time.
- One `AdminUser` can generate many `Recommendation` records over time.
- One `Player` can have many `WeeklyPerformance` records across different match weeks.
- One `MatchWeek` has many `WeeklyPerformance` records, one per player when weekly data is available.
- One `Formation` can be used in many `Recommendation` records.
- One `MatchWeek` can have one or more `Recommendation` records across revision history, but version 1 should treat one final stored recommendation as the normal outcome.
- One `Recommendation` belongs to one `MatchWeek`.
- One `Recommendation` uses one `Formation`.
- One `Recommendation` has many `RecommendationPlayer` records.
- One `Player` can appear in many `RecommendationPlayer` records across different recommendations.
- One `AdminUser` can create many `AuditLog` entries through system actions.

## Cardinality Notes
- `Player` to `WeeklyPerformance`: one-to-many
- `MatchWeek` to `WeeklyPerformance`: one-to-many
- `Formation` to `Recommendation`: one-to-many
- `Recommendation` to `RecommendationPlayer`: one-to-many
- `Player` to `RecommendationPlayer`: one-to-many
- `MatchWeek` to `Recommendation`: one-to-many conceptually, but operationally one final recommendation is expected per week in version 1

## Practical Constraints
- Each `WeeklyPerformance` record must relate to exactly one player and one match week.
- A recommendation cannot exist without a related match week.
- A recommendation cannot be stored without an associated formation.
- A player marked unavailable, injured, or suspended for a match week cannot be selected as a starter in the related recommendation.
- The system models one club globally, so a separate `Club` entity is not required in version 1.
