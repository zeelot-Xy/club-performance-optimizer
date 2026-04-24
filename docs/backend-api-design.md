# Backend API Design

## Overview
Phase 6 implements the backend API as a layered Express application with Prisma persistence, Zod request validation, and JWT-based authentication for the single Coach/Admin user.

## Architecture Pattern
- `schema.ts` validates request input with Zod
- `service.ts` owns Prisma access and business rules
- `controller.ts` maps requests to service calls and responses
- `routes.ts` wires endpoints and middleware
- shared middleware handles authentication, not-found, and errors

## Implemented Modules

### Auth
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

Purpose:
- authenticate the development Coach/Admin account
- issue JWT access tokens
- return current authenticated user details

### Players
- `GET /api/v1/players`
- `GET /api/v1/players/:id`
- `POST /api/v1/players`
- `PATCH /api/v1/players/:id`

Purpose:
- manage player profile records for the single club squad

### Match Weeks
- `GET /api/v1/match-weeks`
- `GET /api/v1/match-weeks/:id`
- `POST /api/v1/match-weeks`
- `PATCH /api/v1/match-weeks/:id`

Purpose:
- manage weekly planning cycles for upcoming matches

### Weekly Performance
- `GET /api/v1/weekly-performance/match-week/:matchWeekId`
- `POST /api/v1/weekly-performance`
- `PUT /api/v1/weekly-performance/:id`

Purpose:
- create and update weekly readiness records for players

### Formations
- `GET /api/v1/formations`
- `GET /api/v1/formations/:id`

Purpose:
- expose the seeded approved formation options

### Recommendations
- `GET /api/v1/recommendations`
- `GET /api/v1/recommendations/match-week/:matchWeekId`
- `GET /api/v1/recommendations/:id`

Purpose:
- retrieve stored recommendation records only
- recommendation generation remains out of scope for Phase 6

## Authentication Design
- JWT payload includes `sub`, `email`, and `role`
- protected endpoints require `Authorization: Bearer <token>`
- authenticated user data is attached to the Express request object by middleware

## Error Response Shape
Errors are returned in a consistent JSON format:

```json
{
  "message": "Readable error message",
  "details": []
}
```

## Development Admin
Phase 6 includes a development-only admin seed utility.

Default local credentials:
- email: `admin@club.local`
- password: `Admin123!`

These credentials are for local development only and must not be treated as production-safe defaults.
