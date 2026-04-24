# Database Model

## Overview
Phase 5 converts the conceptual ERD into a relational Prisma/PostgreSQL schema that stays within the strict one-club, weekly recommendation scope.

## Core Modeling Decisions
- No `Club` model is introduced because the system is explicitly single-club.
- `Formation` is stored as seeded rows instead of a Prisma enum because football formation codes contain values like `4-3-3` and `4-2-3-1`.
- `WeeklyPerformance` is separated from `Player` so each match week preserves its own historical player condition data.
- `Recommendation` stores textual explanation summaries to support transparency and academic defense.

## Model Summary

### `AdminUser`
- Stores the single operational Coach/Admin account data.
- Supports authentication and audit ownership.

### `Player`
- Stores persistent squad profile information.
- Keeps a unique squad number and position-group classification.

### `MatchWeek`
- Represents one planning cycle for an upcoming weekly recommendation.
- Owns the weekly player records and related recommendation history.

### `WeeklyPerformance`
- Stores week-specific player readiness data including training rating, fitness, fatigue, morale, availability, injury status, and suspension status.
- Prevents duplicate entries for the same player in the same week through a unique constraint.

### `Formation`
- Stores approved tactical options as controlled rows.
- Seeds include `4-3-3`, `4-4-2`, `4-2-3-1`, and `3-5-2`.

### `Recommendation`
- Stores the weekly recommendation result, selected formation, and explanation summaries.
- Links recommendation generation to the responsible admin user.

### `RecommendationPlayer`
- Stores selected and relevant excluded players together with role, score, and explanation fields.
- Preserves transparency at player level.

### `AuditLog`
- Stores key system events for traceability.

## Important Constraints
- `Player.squadNumber` is unique.
- `MatchWeek.label` is unique.
- `WeeklyPerformance` is unique on `matchWeekId + playerId`.
- `Formation.code` is unique.

## Validation Boundary
The Prisma schema captures structure and relational integrity. Numeric ranges, tactical eligibility, weekly readiness rules, and recommendation selection rules will be enforced in service-layer validation later.
