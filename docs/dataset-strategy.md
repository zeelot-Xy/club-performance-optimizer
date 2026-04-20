# Dataset Strategy

## Overview
This project uses a hybrid dataset strategy that combines a public football player statistics dataset with synthetic weekly club data. The goal is to balance realism, feasibility, explainability, and academic honesty.

## Base Dataset Source
- Source: Kaggle "Football Players Stats (2025-2026)"
- Role in Project: Provide a realistic structural basis for player profile fields and general football data organization.
- Academic Justification: A public football dataset gives the project a realistic domain structure without requiring access to private club systems.

## Why a Hybrid Approach Is Necessary
Public football datasets usually contain player and season-level statistics, but they rarely include weekly coaching variables such as morale, fatigue, training rating, or availability. These weekly operational indicators are essential for explainable lineup recommendation, so they must be simulated in a controlled way.

## Project-Specific Data Strategy
- Use Kaggle data as a structural and profile reference only.
- Extract a single-club-like subset for the project.
- Limit the demo squad to a maximum of 25 players.
- Generate weekly condition metrics synthetically for each match week.
- Use the synthetic weekly data to drive recommendation logic.

## Scope Protection
- No live feeds
- No web scraping
- No match video extraction
- No GPS or wearable data
- No multi-club dataset management
- No real-time updates

## Academic Positioning
This is not a fully real operational football analytics pipeline. It is a controlled academic prototype using realistic player structure plus synthetic weekly readiness indicators to support explainable tactical recommendation.
