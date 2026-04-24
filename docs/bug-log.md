# Bug Log

## BUG-08-01 AI Service Port Conflict
- Phase: 8
- Issue: local port `8001` was already occupied by another service, blocking direct verification of this project's FastAPI service
- Resolution: implementation was completed with code-level verification and graceful backend fallback; live verification was deferred until a clean port was available

## BUG-08-02 Python Package Installation Timeout
- Phase: 8
- Issue: Python dependency installation experienced network timeout failures during local verification attempts
- Resolution: retained deterministic fail-open backend behavior and verified compile/build paths instead of depending on unstable runtime setup

## BUG-09-01 Vite Build Spawn Restriction
- Phase: 9
- Issue: frontend build initially failed because the environment blocked an internal process spawn used by Vite/esbuild
- Resolution: reran the build with the required permission level and confirmed a successful production build

## BUG-10-01 Recommendation Verification Blocked by Draft Match Week
- Phase: 10
- Issue: live UI verification could not trigger recommendation generation because the only stored match week was still `DRAFT`
- Resolution: updated the existing `Week 1` record to `READY` during verification and confirmed successful backend recommendation generation

## BUG-10-02 Legacy Phase 9 Status Assumption
- Phase: 10
- Issue: frontend recommendation exclusion badge logic still assumed a legacy `UNAVAILABLE` player status from Phase 9 mock data
- Resolution: aligned the frontend logic to the real backend enum set and revalidated TypeScript checks
