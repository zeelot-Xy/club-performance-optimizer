# Monorepo Structure

## Overview
This project uses a monorepo so the frontend, backend, AI service, shared packages, infrastructure assets, data assets, scripts, and documentation can evolve in one coordinated repository. This is appropriate because the services are tightly related and academically easier to manage under one versioned project.

## Top-Level Folder Roles

### `apps/web`
- Purpose: Frontend application for the Coach/Admin dashboard.
- Owns: UI components, route-level pages, data presentation, form interactions, visual explanation views.
- Does Not Own: Final recommendation logic, direct database access, or direct AI service communication.

### `apps/api`
- Purpose: Backend application and primary orchestration layer.
- Owns: Authentication, validation, business rules, recommendation logic orchestration, PostgreSQL access, and ML service integration.
- Does Not Own: Frontend rendering or heavy offline data preparation workflows.

### `apps/ai-service`
- Purpose: Optional ML prediction microservice.
- Owns: Model loading, inference endpoints, and ML-specific preprocessing required at inference time.
- Does Not Own: Final tactical decision logic, authentication, or database orchestration.

### `packages/shared`
- Purpose: Reusable shared types, constants, and lightweight shared utilities.
- Owns: Shared TypeScript contracts and constants that are safe to reuse across services.
- Does Not Own: Backend-only business rules or frontend-only presentation code.

### `packages/config`
- Purpose: Reusable configuration presets.
- Owns: Shared lint, formatting, tsconfig, and similar project-wide configuration assets if needed later.

### `packages/ui`
- Purpose: Optional reusable UI primitives.
- Owns: Shared visual components only when reuse is real and justified.
- Does Not Own: Page-specific feature components or backend-aware logic.

### `infra/docker`
- Purpose: Docker and Compose-related service definitions and helper assets.

### `infra/database`
- Purpose: Database-related infrastructure assets such as initialization helpers or local database support files.

### `data/raw`
- Purpose: Original source data preserved before transformation.

### `data/processed`
- Purpose: Cleaned and simplified player profile datasets derived from raw sources.

### `data/synthetic`
- Purpose: Generated weekly scenario data and other synthetic artifacts.

### `scripts`
- Purpose: Seeding, preprocessing, setup, and utility automation scripts.

### `docs`
- Purpose: Academic, architectural, and process documentation.

## Independence and Boundaries
- Each app should remain deployable and understandable as its own service.
- Shared packages should stay small and intentional.
- Database access is allowed only in `apps/api`.
- The frontend must not call the AI service directly.
- The AI service must remain optional and support-only.

## Future File Placement Guidance
- Prisma schema and migrations will later live under the backend service.
- Seed logic and preprocessing scripts will later live under `scripts/`.
- App-specific tests should stay close to their owning app.
- Shared package tests should stay inside the shared package when those packages become non-trivial.
