# Contributing to MissionManager

Thank you for contributing. This document contains the repository standards and workflow.

## Guidelines
- Open issues for bugs or enhancements before large changes.
- Create feature branches from `main` named `feature/<short-desc>` or `fix/<short-desc>`.
- Use PRs targeting `main`. Include a short description, testing steps, and screenshots when relevant.

## Code style and formatting
- Project-level formatting is defined in `.editorconfig`. Follow it.
  - Frontend (TypeScript/React): 2 spaces indentation.
  - Backend (C#): 4 spaces indentation.
- Run linters and formatters before pushing. Add or update rules in `package.json` / CI as needed.

## Tests
- Include unit tests for new functionality.
- Keep tests deterministic and fast.

## Review and Approval
- At least one approver required for non-trivial changes.
- Maintainers may request changes; address them via additional commits on the same branch.

## Provisioning files
- Keep README, deployment, and environment setup scripts up to date.
