# Use Cases

## Overview
This document defines the text-based use cases for the single actor supported by the system.

Use case diagram reference: see `docs/image-reference-phase-1.md`.

## Actor
- Coach/Admin

## Use Case 1: Log In
- Actor: Coach/Admin
- Preconditions: The Coach/Admin account exists and the system is available.
- Trigger: The Coach/Admin submits login credentials.
- Main Flow:
  1. The system displays the login interface.
  2. The Coach/Admin enters valid credentials.
  3. The system validates the credentials.
  4. The system creates an authenticated session and grants access to protected functions.
- Alternate Flow:
  1. Invalid credentials are submitted.
  2. The system rejects the login attempt and displays an error message.
- Postconditions: The Coach/Admin is either authenticated successfully or informed that login failed.

## Use Case 2: Manage Squad
- Actor: Coach/Admin
- Preconditions: The Coach/Admin is authenticated.
- Trigger: The Coach/Admin opens squad management.
- Main Flow:
  1. The system displays the current squad list.
  2. The Coach/Admin adds a new player or edits an existing player.
  3. The system validates the submitted player information.
  4. The system stores the updated player record.
  5. The system refreshes the squad list.
- Alternate Flow:
  1. Submitted player data is incomplete or invalid.
  2. The system rejects the change and requests correction.
- Postconditions: The squad data reflects valid updates only.

## Use Case 3: Record Weekly Data
- Actor: Coach/Admin
- Preconditions: The Coach/Admin is authenticated and at least one player exists in the squad.
- Trigger: The Coach/Admin opens a match week and enters player metrics.
- Main Flow:
  1. The system displays the selected match week form.
  2. The Coach/Admin enters weekly values for each relevant player.
  3. The system validates rating, fitness, fatigue, morale, injury status, and availability fields.
  4. The system stores the weekly records for the match week.
  5. The system confirms successful save.
- Alternate Flow:
  1. One or more required weekly fields are missing or invalid.
  2. The system blocks submission and highlights the affected records.
- Postconditions: Valid weekly player data is stored for the selected match week.

## Use Case 4: Review Player Status
- Actor: Coach/Admin
- Preconditions: The Coach/Admin is authenticated and weekly data exists for the selected match week.
- Trigger: The Coach/Admin reviews squad condition before recommendation generation.
- Main Flow:
  1. The system displays player availability, injury status, and weekly condition indicators.
  2. The Coach/Admin reviews player readiness and positional coverage.
  3. The system reflects the latest saved weekly records.
- Alternate Flow:
  1. Some players do not yet have weekly records.
  2. The system highlights missing data and warns that recommendation quality may be limited.
- Postconditions: The Coach/Admin has a clear pre-recommendation view of player status.

## Use Case 5: Generate Recommendation
- Actor: Coach/Admin
- Preconditions: The Coach/Admin is authenticated and the selected match week contains sufficient valid weekly data.
- Trigger: The Coach/Admin requests a formation and lineup recommendation.
- Main Flow:
  1. The system validates data completeness and player eligibility.
  2. The system computes weighted rule-based player scores.
  3. The system evaluates approved formations against the available squad profile.
  4. The system selects the best valid formation and starting lineup.
  5. The system stores the recommendation and explanation details.
  6. The system presents the result to the Coach/Admin.
- Alternate Flow:
  1. Fewer than 11 eligible players are available.
  2. The system stops generation and returns a clear insufficiency message.
  3. No valid formation fits the available player balance.
  4. The system stops generation and returns an explainable failure message.
- Postconditions: A recommendation is stored successfully or a clear reason is returned for failure.

## Use Case 6: View Recommended Lineup and Formation
- Actor: Coach/Admin
- Preconditions: A recommendation exists for the selected match week.
- Trigger: The Coach/Admin opens the recommendation result or history entry.
- Main Flow:
  1. The system displays the selected formation.
  2. The system displays the recommended starting lineup.
  3. The system shows supporting player-level reasoning and lineup context.
- Alternate Flow:
  1. No recommendation exists yet for the selected match week.
  2. The system prompts the Coach/Admin to generate a recommendation first.
- Postconditions: The Coach/Admin can inspect the stored recommendation output.

## Use Case 7: View Recommendation Explanation
- Actor: Coach/Admin
- Preconditions: A recommendation exists.
- Trigger: The Coach/Admin opens explanation details.
- Main Flow:
  1. The system displays reasons for selected players.
  2. The system displays reasons for excluded players where relevant.
  3. The system indicates whether optional ML support was included in the result.
- Alternate Flow:
  1. Explanation details are unavailable due to a failed generation attempt.
  2. The system displays the failure reason captured during recommendation processing.
- Postconditions: The recommendation remains transparent and academically defensible.
