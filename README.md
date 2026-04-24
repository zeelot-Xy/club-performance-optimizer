# AI-Based Football Club Player Performance Analysis and Weekly Formation Optimization System

## Overview
This project is a web-based intelligent decision-support system for one football club. It analyzes player performance and recommends an optimal weekly formation and starting lineup for the coach/admin.

## Academic Focus
The system is designed as a realistic, explainable, and finishable final-year project. It prioritizes maintainability, transparency, and technical defensibility over unnecessary complexity.

## Official Academic Title
AI-Based Football Club Player Performance Analysis and Weekly Formation Optimization System for Weekly Match Decision Support

## Internal Product Title
Club Performance and Formation Optimizer

## Academic Problem Statement
This project develops a web-based decision-support system for a single football club that analyzes weekly player performance indicators and recommends an explainable starting lineup and formation for upcoming matches.

## Strict Scope
- One football club only
- Maximum 25 players in demo dataset
- Weekly recommendations only
- No live tracking
- No video analysis
- No GPS or wearable data
- No transfer market logic
- No scouting features
- Coach/Admin is the only user
- Recommendations must remain explainable

## Core Technology Stack
- Frontend: React 18, Vite, TypeScript, Tailwind CSS v4, Recharts, React Router v7, TanStack Query, Lucide React
- Backend: Node.js 20, Express, TypeScript, Prisma ORM, PostgreSQL, Zod, JWT, Helmet
- AI/ML: Python 3.11, FastAPI, scikit-learn, pandas, joblib
- Deployment: Docker Compose

## Development Philosophy
1. Build a fully working system without AI first
2. Add weighted rule-based intelligence
3. Add formation optimization logic
4. Add optional ML enhancement for academic value
5. Polish UI, testing, and documentation

## Planned Phases
- Phase 0: Project definition, academic framing, and repo setup
- Phase 1: Requirements analysis, system design, ERD, and architecture
- Phase 2: Dataset strategy and data preparation
- Phase 3: Git workflow discipline and monorepo structure
- Phase 4: Local environment setup
- Phase 5: Database modeling with Prisma
- Phase 6: Backend API development
- Phase 7: Rule-based recommendation engine
- Phase 8: ML layer with FastAPI
- Phase 9: Frontend UI
- Phase 10: Frontend-backend integration
- Phase 11: Testing and debugging
- Phase 12: Documentation and academic mapping
- Phase 13: Final polishing and defense preparation

## Repository Structure
- `apps/` contains the frontend, backend API, and Python AI service
- `packages/` contains shared code, configuration, and reusable UI utilities
- `docs/` contains academic and engineering documents
- `infra/` contains Docker and database environment assets
- `data/` contains raw, processed, and synthetic datasets

## Design Documents
- `docs/requirements-specification.md`
- `docs/use-cases.md`
- `docs/system-architecture.md`
- `docs/erd.md`
- `docs/domain-model.md`
- `docs/recommendation-workflow.md`
- `docs/non-functional-requirements.md`
- `docs/api-boundary.md`
- `docs/image-reference-phase-1.md`

## Data Strategy Documents
- `docs/dataset-strategy.md`
- `docs/data-preparation-plan.md`
- `docs/synthetic-data-model.md`
- `docs/demo-squad-plan.md`
- `docs/data-dictionary.md`
- `docs/seeding-strategy.md`

## Repository Workflow Documents
- `docs/monorepo-structure.md`
- `docs/git-branching-strategy.md`
- `docs/commit-and-pr-guidelines.md`
- `docs/folder-ownership.md`
- `docs/configuration-policy.md`
- `docs/naming-conventions.md`

## Local Environment Documents
- `docs/local-environment-setup.md`
- `docs/phases/phase-4-checklist.md`

## Database Documents
- `docs/database-model.md`
- `docs/phases/phase-5-checklist.md`

## Backend API Documents
- `docs/backend-api-design.md`
- `docs/phases/phase-6-checklist.md`

## Recommendation Engine Documents
- `docs/rule-based-recommendation-engine.md`
- `docs/phases/phase-7-checklist.md`

## ML Layer Documents
- `docs/ml-layer-design.md`
- `docs/phases/phase-8-checklist.md`

## Frontend UI Documents
- `docs/frontend-ui-design.md`
- `docs/phases/phase-9-checklist.md`

## Frontend Integration Documents
- `docs/frontend-backend-integration.md`
- `docs/phases/phase-10-checklist.md`

## Testing Documents
- `docs/testing-strategy.md`
- `docs/test-cases.md`
- `docs/bug-log.md`
- `docs/phases/phase-11-checklist.md`

## Academic Mapping Documents
- `docs/academic-mapping.md`
- `docs/report-structure.md`
- `docs/chapter-1-summary.md`
- `docs/chapter-2-summary.md`
- `docs/chapter-3-summary.md`
- `docs/chapter-4-summary.md`
- `docs/chapter-5-summary.md`
- `docs/requirements-to-implementation-matrix.md`
- `docs/objectives-to-outcomes-matrix.md`
- `docs/phase-summary.md`
- `docs/phases/phase-12-checklist.md`

## Local Run Overview
- `docker compose up --build` starts PostgreSQL, backend API, AI service, and frontend together
- Frontend runs on `http://localhost:5173`
- Backend runs on `http://localhost:8000`
- AI service runs on `http://localhost:8001`
- PostgreSQL runs on `localhost:5432`
- Prisma commands run from `apps/api` or via `npm run db:* --workspace @club/api`
- development admin seed runs via `npm run db:seed-admin --workspace @club/api`
- rule-based recommendation generation runs via `POST /api/v1/recommendations/generate`
- ML support is appended through the AI service when available and stored in `mlSupportSummary`

## Contribution Rules
- Keep the scope locked to one club and weekly recommendations
- Prioritize explainability before machine learning complexity
- Prefer TypeScript for JavaScript-facing services and tooling
- Keep business logic in service layers, not controllers or UI components
- Document any scope changes before implementation

## Status
Phase 12 documentation and academic mapping completed. The repository now includes report-facing chapter summaries, implementation matrices, academic positioning notes, and a structured mapping from scope and objectives to delivered system outcomes.
