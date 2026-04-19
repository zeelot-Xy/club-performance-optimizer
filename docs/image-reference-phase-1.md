# Phase 1 Image Reference

## Purpose
This file tracks the visuals intentionally omitted from Phase 1 documentation. It allows diagrams to be added later without rewriting the surrounding documents.

## System Architecture Diagram
- Purpose: Show the high-level interaction between the frontend, backend API, PostgreSQL database, and optional FastAPI ML service.
- Suggested Caption: System architecture for the single-club weekly recommendation platform.
- Insert Later In: `docs/system-architecture.md`
- Content Summary: One Coach/Admin user accesses the React frontend, which communicates with the Express backend. The backend reads and writes PostgreSQL and optionally calls the FastAPI service for ML support. The frontend never talks directly to the database or AI service.
- Placeholder Filename: `phase-1-system-architecture.png`

## Use Case Diagram
- Purpose: Show the single actor and the major system use cases.
- Suggested Caption: Primary use cases for the Coach/Admin user.
- Insert Later In: `docs/use-cases.md`
- Content Summary: The Coach/Admin interacts with login, squad management, weekly data recording, player status review, recommendation generation, lineup review, and explanation review.
- Placeholder Filename: `phase-1-use-case-diagram.png`

## ERD Diagram
- Purpose: Show the conceptual entity structure and key relationships for the system.
- Suggested Caption: Conceptual ERD for the weekly football recommendation system.
- Insert Later In: `docs/erd.md`
- Content Summary: Entities include AdminUser, Player, MatchWeek, WeeklyPerformance, Formation, Recommendation, RecommendationPlayer, and AuditLog, with one-to-many and one-to-one conceptual relationships described in the ERD document.
- Placeholder Filename: `phase-1-erd-diagram.png`
