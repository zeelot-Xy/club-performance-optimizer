# Commit and PR Guidelines

## Commit Discipline
- Make one logical change per commit.
- Use commit messages that describe the outcome of the change.
- Avoid mixing backend, frontend, AI, and documentation changes in one commit unless they are tightly coupled.

## Recommended Commit Prefixes
- `docs`
- `chore`
- `feat`
- `fix`
- `refactor`
- `test`

## Commit Message Guidance
- Good: `feat: add weekly performance validation service`
- Good: `docs: document recommendation workflow edge cases`
- Avoid: messages that only say files were updated without describing the result.

## Pull Request Discipline
- PR titles should be short and outcome-focused.
- PR descriptions should explain what changed, why it changed, and how it was checked.
- Include testing notes when code is introduced later.
- Include documentation notes when behavior or architecture changes.

## Suggested PR Checklist
- Scope is clear and limited
- No forbidden scope expansion introduced
- Tests or verification steps are noted
- Documentation updated where required
- Secrets or generated artifacts were not committed
