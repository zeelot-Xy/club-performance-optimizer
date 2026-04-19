# Git Workflow Discipline

## Branch Strategy
- `main` is the stable branch
- Feature and phase branches should use the `codex/` prefix when created later
- Keep commits small, scoped, and reversible

## Commit Discipline
- Make one logical change per commit
- Use conventional commit prefixes such as `chore`, `docs`, `feat`, `fix`, and `test`
- Write commit messages that describe the outcome, not just the touched files

## Review Discipline
- Confirm scope before adding new features
- Avoid mixing documentation, infrastructure, and feature logic in one commit unless tightly related
- Keep all architecture-impacting decisions documented in `docs/`
