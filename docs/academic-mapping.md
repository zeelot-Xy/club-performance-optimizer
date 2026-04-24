# Academic Mapping

## Purpose
This document maps the implemented repository to the typical academic expectations of a final-year software engineering project. It helps demonstrate that the project is not only functional, but also structured, scoped, documented, and validated in a way that is academically defensible.

## Core Academic Positioning
- Project type: applied software engineering and intelligent decision-support system
- Domain: football club performance analysis for weekly lineup and formation support
- User scope: one Coach/Admin for one club
- Intelligence scope: explainable rule-based recommendation first, optional ML enhancement second
- Feasibility principle: constrained features to ensure the project is realistic and finishable

## Mapping to Standard Academic Concerns

### Problem Relevance
- The system addresses the practical challenge of weekly player selection and formation choice.
- It improves consistency by combining player condition indicators into a structured recommendation process.

### Scope Control
- Multi-club, live tracking, video analysis, GPS data, scouting, and transfer features were excluded deliberately.
- This protects feasibility, implementation quality, and defense credibility.

### System Design
- The project uses a layered multi-service architecture:
  - React frontend for presentation
  - Express backend for business rules and orchestration
  - PostgreSQL for persistence
  - FastAPI microservice for optional ML support

### Explainability
- Recommendations are persisted with selection and exclusion reasons.
- ML does not replace the rule engine; it only provides supplementary support text.

### Engineering Discipline
- The work progressed in explicit phases from problem framing to testing.
- Git history reflects disciplined incremental delivery.
- Requirements, ERD, architecture, dataset strategy, implementation, and testing are all documented separately.

### Validation
- Backend and frontend test suites were added in Phase 11.
- Manual verification paths were documented for login, player management, match-week setup, and recommendation generation.

## Academic Claim Boundaries
- The system recommends weekly lineups and formations; it does not predict match outcomes.
- The dataset strategy is hybrid and partially synthetic; it is not presented as fully real operational club data.
- The ML layer is demonstrative and supplementary rather than the primary decision authority.

## Strong Defense Statement
The project is academically strong because it combines realistic problem framing, explicit scope control, layered system design, explainable decision logic, working full-stack implementation, and focused testing within a finishable undergraduate project boundary.
