# System Architecture

## Overview
The system uses a layered service architecture to separate user interaction, business logic, persistence, and optional machine learning enhancement. This structure improves maintainability, explainability, and academic defensibility.

Architecture diagram reference: see `docs/image-reference-phase-1.md`.

## Core Components

### Frontend Application
- Technology: React 18, Vite, TypeScript, Tailwind CSS v4
- Responsibility: Present the dashboard, forms, recommendation results, and explanation views to the Coach/Admin.
- Boundary: The frontend communicates only with the backend API.
- The frontend does not access PostgreSQL directly.
- The frontend does not communicate with the FastAPI ML service directly.

### Backend API
- Technology: Node.js 20, Express, TypeScript, Prisma ORM, Zod, JWT, Helmet
- Responsibility: Authentication, data validation, business logic orchestration, recommendation generation, persistence, and response shaping.
- Boundary: The backend is the single orchestrator between the UI, database, and optional ML service.
- The backend owns rule-based scoring and formation selection logic.
- The backend decides when optional ML support is requested.

### Database Layer
- Technology: PostgreSQL
- Responsibility: Store player records, match week data, recommendations, and audit-related information.
- Boundary: Only the backend API communicates directly with the database.
- The database is the source of truth for operational system data.

### ML Microservice
- Technology: Python 3.11, FastAPI, scikit-learn, pandas, joblib
- Responsibility: Provide optional predictive support for player rating estimation or comparative analysis.
- Boundary: The ML service does not own final recommendation decisions.
- The ML service is secondary and must not replace rule-based explainability.

## Interaction Model
1. The Coach/Admin interacts with the React frontend.
2. The frontend sends authenticated requests to the Express backend.
3. The backend validates requests and reads or writes PostgreSQL data.
4. When applicable, the backend may call the FastAPI service for additional predictive input.
5. The backend combines rule-based reasoning with optional ML evidence and returns an explainable result.

## Architecture Principles
- Single source of truth: PostgreSQL stores operational data.
- Single orchestration layer: Express controls rules, data flow, and ML integration.
- Explainability first: Rule-based scoring remains primary.
- Controlled extensibility: The ML service can be enabled later without restructuring the whole system.
- Scope discipline: One club, one role, weekly recommendations only.

## Responsibilities by Layer
- Presentation layer: Collect inputs and display outputs clearly.
- Application layer: Enforce use cases and business rules.
- Persistence layer: Store consistent historical records.
- ML enhancement layer: Supply optional predictive support without overriding core decisions.

## Deployment Direction
The system is intended for local multi-service execution through Docker Compose in later phases, with separate containers for frontend, backend, database, and AI service.
