# Non-Functional Requirements

## Overview
This document defines the quality expectations for the system beyond core functional behavior.

## Explainability
- NFR-01: Every recommendation shall include human-readable explanation text.
- NFR-02: Rule-based logic shall remain the primary recommendation basis in version 1.
- NFR-03: Optional ML output shall be presented only as supplementary evidence.

## Maintainability
- NFR-04: The system shall use layered service boundaries so presentation, business logic, persistence, and ML concerns remain separate.
- NFR-05: Business rules shall be placed in backend service layers rather than UI components.
- NFR-06: TypeScript shall be used in frontend and backend codebases for maintainability and consistency.

## Usability
- NFR-07: The interface shall be understandable to a single Coach/Admin user without requiring technical expertise.
- NFR-08: Weekly data entry and recommendation review flows shall be simple and direct.
- NFR-09: Recommendation results shall be presented in a way that makes lineup choices easy to inspect.

## Security
- NFR-10: Protected backend routes shall require JWT-based authentication.
- NFR-11: Sensitive authentication data shall be stored securely.
- NFR-12: The system shall prevent unauthorized access to player records and recommendation history.

## Performance
- NFR-13: The system should generate a recommendation within a few seconds for a squad of up to 25 players under normal local conditions.
- NFR-14: Normal dashboard data retrieval should feel responsive during local use.

## Reliability
- NFR-15: The system shall reject invalid input rather than storing inconsistent operational data.
- NFR-16: Saved recommendations shall remain retrievable after generation.
- NFR-17: Failure responses shall be clear and actionable when recommendation generation cannot proceed.

## Portability
- NFR-18: The full stack shall be runnable locally using Docker Compose.
- NFR-19: The application should remain installable and testable on standard developer systems without requiring specialized hardware.

## Academic Defensibility
- NFR-20: The system design shall remain within the approved single-club and weekly recommendation scope.
- NFR-21: The implementation shall avoid hidden autonomous decision behavior that cannot be explained during project defense.
