# Frontend UI Design

## Phase Goal
Phase 9 defines the Coach/Admin-facing frontend for the single-club weekly decision-support workflow. The interface is intentionally dashboard-oriented, restrained, and explainability-first.

## Visual Direction
- Primary color: `#0F2C22`
- Background: `#F8FAF7`
- Background motif: subtle grid-line pattern
- Style goals: premium, tactical, calm, analytical, modern
- Explicitly avoided: neon accents, flashy sports-app styling, noisy gradients

## Core UI Areas
- Dashboard: weekly readiness overview and system state summary
- Players: squad table with role, status, and readiness context
- Match Weeks: weekly preparation register and active week summary
- Recommendations: formation review, pitch visualization, starters, exclusions, and explanation summary

## Routing Structure
- `/` dashboard
- `/players`
- `/match-weeks`
- `/recommendations`

## Component Strategy
- Layout shell separates navigation from page content
- Reusable section cards, stat cards, tables, badges, and empty states stay presentation-focused
- Pitch visualization is custom React and CSS rather than canvas-heavy rendering
- Recommendation explanation remains a primary content block rather than a small secondary note

## Pitch Visualization Approach
- Support controlled formations only:
  - `4-3-3`
  - `4-4-2`
  - `4-2-3-1`
  - `3-5-2`
- Render player markers in grouped rows
- Keep field markings subtle and premium
- Optimize readability on mobile by allowing row wrapping with maintained hierarchy

## Data Strategy in Phase 9
- Use mock squad data and a mock active match week
- Use one mock recommendation record with:
  - selected formation
  - starting XI
  - exclusions
  - explanation highlights
  - ML support placeholder/advisory text
- Live API integration is deferred to Phase 10

## Explainability Rules Reflected in UI
- Recommendation page must show why the formation was chosen
- Selected starters must include short reasons
- Excluded players must remain visible with reasons
- ML support must be clearly labeled as advisory, not authoritative
