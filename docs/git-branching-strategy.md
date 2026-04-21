# Git Branching Strategy

## Overview
This project uses a simple Git workflow suitable for a final-year software engineering project. The goal is traceability, stability, and low process overhead.

## Main Branch Rule
- `main` is the stable branch.
- `main` should always represent a readable and reviewable project state.

## Feature Branch Strategy
- Use short-lived branches for focused work.
- Create a new branch when a change is large enough to span multiple commits or affect multiple files.
- Merge branches back after the work is complete and reviewed.

## Recommended Branch Naming
- `docs/phase-3-monorepo-rules`
- `feat/api-auth`
- `feat/web-dashboard`
- `feat/ai-rating-service`
- `fix/api-validation`

## Codex Local Workflow Note
Internal helper branches may still use the `codex/` prefix when needed locally, but project-facing feature branches should use readable names aligned with the actual work.

## Branching Rules
- Avoid long-lived unstable branches.
- Avoid keeping unrelated work on the same feature branch.
- Prefer one focused theme per branch.
- Merge when the branch is coherent, tested where applicable, and documented if behavior changed.

## Merge Discipline
- Merge only when the change has a clear purpose.
- Keep history readable through small, meaningful commits.
- Do not treat branches as long-term environments.
