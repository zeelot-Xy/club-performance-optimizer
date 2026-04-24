# Demo Script

## Goal
Demonstrate the full value of the system in a short, calm, credible sequence that highlights scope control, explainability, and working implementation.

## Ideal Demo Length
5 to 8 minutes

## Demo Flow

### 1. Introduce the Problem
Say:
This system helps a single football club evaluate weekly player-condition data and generate an explainable recommendation for formation and starting lineup selection.

### 2. Show Login
- open the login page
- sign in with the seeded Coach/Admin account

Say:
The system is built for one operational user role only, the Coach/Admin, because the project focuses on decision support rather than multi-role enterprise workflow complexity.

### 3. Show Dashboard
- open the dashboard
- point out live counts and status summaries

Say:
The dashboard provides a high-level weekly readiness view without overwhelming the user with unnecessary analytics.

### 4. Show Players Page
- open the players page
- explain that the squad is restricted to a single club
- optionally create one new player if the data state allows a clean demo

Say:
The system manages the single-club squad and preserves the strict project scope of up to 25 demo players.

### 5. Show Match Weeks Page
- open the match weeks page
- show an existing planning cycle
- explain that recommendation generation happens per match week

Say:
The match week is the core planning unit. This is where the weekly recommendation context is anchored.

### 6. Show Recommendations Page
- select the current ready match week
- click generate recommendation if needed
- show the returned formation, lineup, exclusions, and ML support summary

Say:
The recommendation engine is primarily rule-based. It uses player condition indicators and formation-fit checks to produce a transparent recommendation.

### 7. Show Explainability
- point to player reasons
- point to excluded players and reasons
- point to the tactical pitch visualization

Say:
The main academic strength of the system is that it does not only recommend a lineup. It also explains why players were selected or excluded.

### 8. Close with ML Positioning
- mention the ML support summary section

Say:
The FastAPI Random Forest layer is supplementary only. It adds supporting evidence, but the final recommendation remains anchored in explainable rule-based logic.

## Backup Talking Points
- if recommendation generation fails:
  explain that the system intentionally blocks invalid runs when the match week is not ready or eligible players are insufficient
- if asked about realism:
  explain the hybrid dataset strategy and why weekly condition data is partially synthetic
- if asked about scope:
  explain that avoiding live data and multi-club complexity was a deliberate feasibility decision
