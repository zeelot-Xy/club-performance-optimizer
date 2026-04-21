# Configuration Policy

## Overview
This document defines how configuration and secrets should be handled across services in the monorepo.

## Core Rules
- Real secrets must never be committed.
- `.env.example` files should be committed later for each service.
- Real `.env` files remain local and untracked.
- Environment variables should be separated by service responsibility.

## Service-Level Separation
- Frontend config should contain only frontend-safe variables.
- Backend config should own database URLs, JWT secrets, and backend service settings.
- AI service config should own model paths and AI-service-local settings.

## Validation Policy
- Each service should validate its required configuration at startup in later phases.
- Missing or invalid configuration should fail fast with a clear error.

## Secret Handling Rules
- No hardcoded secrets in source files.
- No hardcoded secrets in documentation.
- No shared secret values across services unless explicitly required.

## Configuration Drift Prevention
- Keep examples synchronized with real expected variables.
- Keep naming consistent across services.
- Avoid hidden defaults that make debugging difficult.
