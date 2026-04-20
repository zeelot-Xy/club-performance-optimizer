# Synthetic Data Model

## Overview
This document defines the synthetic weekly fields that will simulate club-side operational conditions for each player.

## Weekly Synthetic Fields

### training_rating
- Meaning: The player's weekly training performance before the match.
- Example Range: 1 to 10
- Why It Matters: Supports short-term form evaluation beyond historical profile data.

### fitness
- Meaning: The player's current physical readiness level.
- Example Range: 0 to 100
- Why It Matters: High fitness increases suitability for selection.

### fatigue
- Meaning: The player's current tiredness or workload burden.
- Example Range: 0 to 100
- Why It Matters: High fatigue should reduce recommendation priority.

### morale
- Meaning: The player's psychological readiness and confidence level.
- Example Range: 0 to 100
- Why It Matters: Morale can influence selection confidence and tie-breaking decisions.

### injury_status
- Meaning: The player's injury condition for the current match week.
- Example Values: `fit`, `minor_knock`, `injured`
- Why It Matters: Injured players must not be selected as starters.

### availability
- Meaning: Whether the player is operationally available for selection.
- Example Values: `available`, `unavailable`
- Why It Matters: Unavailable players must not be recommended.

### suspension_status
- Meaning: Whether a player is suspended for the current week.
- Example Values: `eligible`, `suspended`
- Why It Matters: Suspended players cannot be selected even if fully fit.

### coach_notes
- Meaning: Optional short note recorded by the Coach/Admin.
- Example Values: "Recovered well", "Reduced training load", "Tactical fit for wide role"
- Why It Matters: Adds interpretive context for review and future explanation support.

## Modeling Principles
- Values should remain realistic and internally consistent.
- Generated weekly records should create varied tactical scenarios.
- Synthetic data must support explainable rule-based scoring later in the project.
