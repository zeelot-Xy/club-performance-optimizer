# API Boundary Definition

## Overview
This document defines the backend module boundaries for version 1. It does not specify final endpoint paths or payload schemas yet.

## Auth Module
- Responsibility: Authenticate the Coach/Admin, issue access tokens, validate protected access, and support secure session handling.
- Typical Input: Login credentials, token-bearing requests, logout intent.
- Typical Output: Authentication result, access token, authenticated user context, access denial message where appropriate.
- Validation Expectations: Credentials must be validated securely and protected requests must include valid authentication context.

## Players Module
- Responsibility: Manage the single club squad and player profile records.
- Typical Input: Player creation data, player update data, player listing queries.
- Typical Output: Player record, squad list, validation errors, status confirmation.
- Validation Expectations: Required player identity and position fields must be present and valid; duplicate or inconsistent player data must be rejected.

## Weekly-Performance Module
- Responsibility: Create and manage match weeks and store weekly player metrics.
- Typical Input: Match week details, weekly metric values, availability flags, injury status, suspension status, review queries.
- Typical Output: Saved match week data, saved weekly records, validation errors, weekly summaries.
- Validation Expectations: Metric ranges must be controlled, weekly records must map to valid players and a valid match week, and conflicting status combinations should be rejected.

## Formations Module
- Responsibility: Expose the approved formation options and related tactical definitions used by the recommendation engine.
- Typical Input: Formation lookup requests and internal evaluation requests.
- Typical Output: Approved formation definitions and formation availability data.
- Validation Expectations: Only controlled formation values are valid in version 1.

## Recommendations Module
- Responsibility: Generate, store, and retrieve weekly formation and lineup recommendations with explanation details.
- Typical Input: Match week identifier, generation request, recommendation history query, recommendation detail query.
- Typical Output: Recommendation summary, selected formation, lineup records, explanation text, failure response when generation is not possible.
- Validation Expectations: Recommendation generation must verify sufficient eligible players, weekly data completeness, and valid formation fit before storing a result.

## Boundary Rules
- The frontend communicates only with the backend API.
- The backend API is the only component allowed to access PostgreSQL directly.
- The backend API is responsible for calling the ML microservice when optional predictive support is enabled.
- The ML microservice is not exposed directly to the frontend.
