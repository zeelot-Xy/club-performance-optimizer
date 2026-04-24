# Chapter 3 Summary

## Methodological Approach
The project followed an incremental software engineering approach. Requirements, scope, architecture, dataset strategy, database design, backend implementation, frontend implementation, integration, and testing were handled in explicit phases.

## System Design Summary
- frontend: React dashboard for Coach/Admin interaction
- backend: Express API with service-layer business logic
- database: PostgreSQL with Prisma schema
- AI service: FastAPI microservice for optional Random Forest support

## Dataset Method
- public football statistics structure used as a base reference
- synthetic weekly player-condition fields added for realism and control
- single-club demo dataset maintained to preserve project feasibility

## Recommendation Method
- filter ineligible players
- compute weighted scores from weekly indicators
- evaluate approved formations
- select highest valid formation and lineup combination
- store reasons for inclusion and exclusion
- optionally append ML support text

## Rationale
This methodology supports explainability, maintainability, reproducibility, and academic defensibility.
