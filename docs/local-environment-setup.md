# Local Environment Setup

## Overview
Phase 4 establishes the first runnable local development environment for the project. The objective is not to implement football features yet, but to ensure the monorepo can boot the frontend, backend, AI service, and PostgreSQL together with clean service boundaries.

## Services Introduced
- `apps/web`: React 18 + Vite + TypeScript frontend
- `apps/api`: Node.js + Express + TypeScript backend
- `apps/ai-service`: FastAPI + Python 3.11 AI support service
- `postgres`: PostgreSQL database for local development

## Local Port Map
- Frontend: `5173`
- Backend API: `8000`
- AI service: `8001`
- PostgreSQL: `5432`

## Phase 4 Goals
- Create the first runnable app skeletons
- Add Dockerfiles for the three application services
- Add a root `docker-compose.yml`
- Add service-level `.env.example` files
- Add basic health endpoints for backend and AI verification
- Keep setup minimal and clean without introducing application feature logic

## Expected Verification
- `docker compose config` should parse successfully
- Frontend should render a starter status page
- Backend should respond to a health endpoint
- AI service should respond to a health endpoint
- PostgreSQL should be reachable by the backend container in Compose

## Database Setup Extension
Phase 5 adds Prisma as the relational modeling layer inside `apps/api`. Database generation, migration, and seeding are run from the API workspace against the PostgreSQL service defined in Docker Compose.
