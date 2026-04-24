# Requirements to Implementation Matrix

| Requirement | Implementation Evidence |
| --- | --- |
| FR-01 to FR-03 Authentication and protected access | `apps/api/src/modules/auth`, `apps/web/src/context/auth-context.tsx`, `apps/web/src/pages/login-page.tsx` |
| FR-04 to FR-07 Squad management | `apps/api/src/modules/players`, `apps/web/src/pages/players-page.tsx`, `apps/web/src/components/forms/player-form.tsx` |
| FR-08 to FR-12 Match week management | `apps/api/src/modules/match-weeks`, `apps/web/src/pages/match-weeks-page.tsx`, `apps/web/src/components/forms/match-week-form.tsx` |
| FR-13 to FR-15 Player availability and status control | `apps/api/prisma/schema.prisma`, recommendation eligibility filtering in `apps/api/src/modules/recommendations/recommendation-engine.ts` |
| FR-16 to FR-21 Recommendation generation and storage | `apps/api/src/modules/recommendations`, Prisma `Recommendation` and `RecommendationPlayer` models |
| FR-22 to FR-25 Explainability | `selectionReason`, `exclusionReason`, `summary`, `ruleScoreSummary`, `mlSupportSummary` fields and UI rendering in `apps/web/src/pages/recommendations-page.tsx` |
| FR-26 to FR-27 Recommendation review and history | recommendation retrieval endpoints and frontend recommendation page integration |
| FR-28 to FR-31 Guard conditions and auditability | recommendation engine validation, stored recommendation context, test cases in Phase 11 |
