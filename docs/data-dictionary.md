# Data Dictionary

## Overview
This document defines the key data fields used across player profiles, weekly records, and recommendation outputs in plain academic language.

## Player Profile Fields

### player_id
- Meaning: Unique identifier for a player record.

### full_name
- Meaning: Player name used for identification and display.

### primary_position
- Meaning: Main tactical role of the player.

### secondary_position
- Meaning: Optional alternative tactical role.

### squad_number
- Meaning: Shirt number used for reference.

### dominant_foot
- Meaning: Preferred foot of the player.

### age
- Meaning: Player age at time of record.

### active_status
- Meaning: Indicates whether the player is currently active in the squad.

## Weekly Performance Fields

### match_week_id
- Meaning: Identifier for a specific recommendation cycle.

### training_rating
- Meaning: Weekly training quality score.

### fitness
- Meaning: Current physical readiness level.

### fatigue
- Meaning: Current workload or tiredness level.

### morale
- Meaning: Current confidence or psychological readiness level.

### injury_status
- Meaning: Injury condition for the week.

### availability
- Meaning: Whether the player is available for selection.

### suspension_status
- Meaning: Whether the player is suspended or eligible.

### coach_notes
- Meaning: Optional short weekly observation from the Coach/Admin.

## Recommendation Fields

### recommendation_id
- Meaning: Identifier for a saved recommendation output.

### formation_code
- Meaning: Selected tactical formation.

### selected_flag
- Meaning: Indicates whether a player was chosen in the starting lineup.

### computed_score
- Meaning: Rule-based suitability score used for ranking.

### selection_reason
- Meaning: Human-readable reason a player was selected.

### exclusion_reason
- Meaning: Human-readable reason a player was not selected when relevant.
