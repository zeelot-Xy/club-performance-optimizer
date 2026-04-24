# Frontend-Backend Integration

## Phase Goal
Phase 10 connects the React frontend to the live Express backend using TanStack Query. The frontend no longer depends on Phase 9 mock data for the main dashboard, player registry, match week register, and recommendation review flow.

## Integration Layers
- `api-client.ts`: centralized HTTP client for authenticated requests
- `storage.ts`: local token persistence
- `auth-context.tsx`: session restoration, login, logout, and current-user state
- domain hooks:
  - `use-players.ts`
  - `use-match-weeks.ts`
  - `use-formations.ts`
  - `use-recommendations.ts`
  - `use-dashboard.ts`

## Auth Flow
- Login uses `POST /auth/login`
- Session restoration uses `GET /auth/me`
- JWT is stored locally for development use
- Protected routes redirect unauthenticated users to `/login`
- Logout clears token and cached server state

## Connected Pages
- Dashboard: derives live summary cards and charts from players, match weeks, and recommendations
- Players: fetches real player records and supports player creation
- Match Weeks: fetches real planning cycles and supports match week creation
- Recommendations: selects a real match week, fetches stored recommendation data, and triggers backend recommendation generation

## Explainability Preservation
- The frontend does not implement formation logic or player scoring
- Recommendation explanations, exclusions, and ML support summaries are displayed from backend responses
- The browser only maps backend payloads into presentational shapes for the UI

## Error and Loading Handling
- Dedicated loading and error components provide explicit UI states
- Recommendation fetch by match week treats backend `404` as “no recommendation yet” rather than a hard crash
- Token failure clears the session and returns the user to login

## Local Development Notes
- Backend base URL is configured through `VITE_API_BASE_URL`
- Seeded development login remains:
  - `admin@club.local`
  - `Admin123!`
- Recommendation generation still requires the backend database to contain a ready match week and eligible weekly data
