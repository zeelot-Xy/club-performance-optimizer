# Seeding Strategy

## Overview
This document defines how the system's initial data will later be seeded into the application for development, testing, and demonstration.

## Seeding Principles
- Base player profiles will come from the processed single-club subset derived from the Kaggle structure.
- Weekly records will be synthetically generated to simulate changing club conditions.
- Recommendations will not be pre-seeded; they will be produced by the application at runtime.
- Seeding should be reproducible so the same demo conditions can be recreated when needed.

## Planned Seeding Layers

### Player Seed Layer
- Source: Processed player subset
- Purpose: Populate the single-club squad with realistic player profile records

### Weekly Performance Seed Layer
- Source: Synthetic generation rules
- Purpose: Create match week scenarios that vary in fitness, fatigue, morale, availability, and injuries

### Recommendation Layer
- Source: Runtime generation only
- Purpose: Preserve the integrity of the recommendation engine by avoiding precomputed outputs

## Reproducibility Guidance
- Use deterministic random seeds where possible.
- Keep generated scenarios consistent enough for demonstrations and supervisor review.
- Record generation assumptions so test scenarios can be explained later.

## Academic Importance
Reproducible seed data improves credibility, supports repeatable demonstrations, and helps defend the consistency of system testing.
