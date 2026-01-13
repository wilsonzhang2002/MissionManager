# Contributing to MissionManager

Thank you for contributing. This document contains the repository standards and workflow.

## Guidelines
- Open issues for bugs or enhancements before large changes.
- Create feature branches from `main` named `feature/<short-desc>` or `fix/<short-desc>`.
- Use PRs targeting `main`. Include a short description, testing steps, and screenshots when relevant.

## Naming conventions
- The canonical domain term for this repository is "Mission" (not "Project").
  - Use `Mission` in UI text, component and page names (e.g., `MissionList`, `MissionDetail`).
  - Use `Mission` in types and DTOs (e.g., `MissionDto`).
  - Use `/api/missions` for REST endpoints and prefer plural resource names.
  - Filenames and directories should reflect the term `mission` (e.g., `pages/MissionList.tsx`).
- Follow existing casing patterns: PascalCase for React components and types, camelCase for variables and function names.

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

## Graph model & UI behavior (new)
This project uses React Flow (`reactflow`) for visualizing and editing directed acyclic graphs (DAGs) in the frontend. The following expectations and standards apply when modifying or implementing graph-related features:

- Persisted model
  - The canonical graph model is expressed as nodes and edges arrays. Each node should include stable `id`, `label`, optional `metadata`, and `position` when persisted. Each edge should include `source` and `target` (node ids) and may include additional renderer properties such as `animated` or `markerEnd`.
  - Components that allow editing the graph (adding/removing nodes or edges, repositioning nodes) should maintain local React Flow state using `useNodesState` and `useEdgesState` and expose an explicit `onChange` callback or call a provided save API to persist the updated model to the backend.

- UI behavior
  - Nodes must be draggable so users can position them. Node positions should be saved to the persisted model so layout is preserved across reloads.
  - Edges must visually indicate direction using arrow markers (closed arrows preferred). Use React Flow's marker/arrow configuration for this (`markerEnd` or equivalent) so arrows render consistently.
  - For DAGs, avoid rendering bidirectional arrows between the same two nodes unless explicitly desired. Edge creation UI should include validation hooks where needed.

- Implementation notes
  - Use React Flow helpers such as `addEdge`, `useNodesState`, `useEdgesState`, and `onConnect` for consistent behavior.
  - Prefer stable id generation for nodes/edges (UUIDs or backend-assigned ids) and deterministic position storage in the model.
  - Add unit tests that validate serialization and deserialization of node positions and edge arrow metadata when adding save/load behaviors.

- Workflow
  - Before adding large refactors to graph persistence or rendering, open an issue describing the design and data contract.
  - Implement changes on a feature branch and include small, focused PRs when possible.

Please follow these rules to keep graph UI behavior consistent and persistent across sessions.
