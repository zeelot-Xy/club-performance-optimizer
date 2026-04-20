# Data Preparation Plan

## Overview
This document defines how data will be prepared for later implementation. This phase is planning-only and does not yet introduce automation scripts.

## Planned Data Pipeline
1. Obtain the Kaggle "Football Players Stats (2025-2026)" dataset.
2. Inspect the available columns and identify profile-related fields relevant to this project.
3. Remove irrelevant, overly complex, or noisy columns that do not support weekly lineup decision-making.
4. Normalize player profile fields into a simplified internal structure suitable for one club.
5. Derive a single-club subset containing 20 to 25 realistic players.
6. Save the cleaned player subset as a processed dataset for future seeding.
7. Generate synthetic weekly condition fields for each player and match week.
8. Use the processed player dataset and generated weekly records as the basis for PostgreSQL seeding in later phases.

## Data Reduction Principles
- Keep only fields that support squad management, performance analysis, or recommendation logic.
- Prefer simplified positions over excessively granular source roles.
- Remove columns that do not strengthen the academic story of weekly tactical recommendation.

## Planned Output Stages
- Raw source data in `data/raw/`
- Cleaned player profile data in `data/processed/`
- Synthetic weekly scenario data in `data/synthetic/`

## Important Note
Actual preprocessing scripts, transformation utilities, and database seeders will be implemented in later phases. Phase 2 only defines the strategy and workflow.
