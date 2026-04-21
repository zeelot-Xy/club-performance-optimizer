# Folder Ownership

## Overview
This document defines practical ownership boundaries for each major part of the repository. These boundaries are intended to preserve maintainability and architectural clarity.

## Ownership Rules

### `apps/web`
- Owns UI, page composition, route-level presentation, charts, tables, and user interaction flows.
- Must not own final recommendation business logic.
- Must not access PostgreSQL directly.
- Must not call `apps/ai-service` directly.

### `apps/api`
- Owns authentication, validation, service-layer business rules, recommendation orchestration, and database access.
- Is the only service allowed to talk directly to PostgreSQL.
- Is responsible for deciding when optional ML inference is requested.

### `apps/ai-service`
- Owns optional model inference and ML-serving behavior only.
- Must not become the source of final tactical decisions.
- Must not take over business rules that belong in the backend API.

### `packages/shared`
- Owns shared types, constants, and narrowly scoped reusable logic.
- Must not accumulate unclear or convenience-only code.

### `packages/config`
- Owns reusable project configuration where shared setup provides real value.

### `packages/ui`
- Owns reusable UI primitives only if reuse becomes meaningful later.
- Must not become a dumping ground for unrelated web components.

### `scripts`
- Owns data preprocessing, seeding, setup helpers, and repeatable developer utilities.

### `data`
- Owns data artifacts only.
- Raw, processed, and synthetic stages must remain separated.

## Architectural Protection Rules
- Recommendation logic stays in the backend.
- Database access stays in the backend.
- ML support stays optional and isolated.
- Shared packages must remain clearly owned and narrowly scoped.
