# Database Layer Notes

## Purpose
This directory exists to keep database-focused code and notes close to the API service.

## Phase 5 Scope
- Prisma schema lives in `apps/api/prisma/schema.prisma`
- Seed script lives in `apps/api/prisma/seed.ts`
- Shared Prisma client bootstrap lives in `apps/api/src/lib/prisma.ts`

## Boundary Rule
Database access remains owned by `apps/api` only.
