# Testing Strategy

## Phase Goal
Phase 11 validates the project through a focused mix of automated tests and manual workflow checks. The strategy emphasizes high-risk decision-support paths rather than broad low-value coverage.

## Testing Priorities
1. Authentication correctness
2. Recommendation engine correctness and failure handling
3. Backend service stability for player and match week access
4. Frontend mapping of backend recommendation payloads
5. Recommendation page behavior for empty and loaded states

## Automated Test Scope

### Backend
- `auth.service.test.ts`
  - successful login
  - invalid credential rejection
- `player.service.test.ts`
  - ordered list query
  - missing player failure
- `match-week.service.test.ts`
  - ordered list query with creator details
  - missing match week failure
- `recommendation-engine.test.ts`
  - successful formation generation
  - insufficient eligible players failure
  - exclusion of injured or unavailable players
  - rejection of completed match weeks

### Frontend
- `formatters.test.ts`
  - mapping backend recommendation payload into UI record
- `recommendations-page.test.tsx`
  - empty recommendation state
  - loaded recommendation state and generation trigger

## Manual Verification Scope
- login with seeded Coach/Admin account
- player list rendering from live API
- match week list rendering from live API
- create player from frontend form
- create match week from frontend form
- generate recommendation from frontend
- confirm lineup, exclusions, and ML support summary render
- logout and session restoration behavior

## Academic Rationale
- recommendation generation is the highest-risk business path, so it receives the deepest testing
- backend service tests are deterministic through mocking, which keeps results repeatable
- frontend tests focus on integration state and explainability presentation rather than superficial styling
