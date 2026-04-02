---
id: "001"
title: Foundation — schema, API, page scaffold
prd: "0003"
status: open
type: afk
blocked_by: []
created: 2026-04-01
---

## Parent PRD

prds/0003-invoice-expense-tracker/PRD.md

## What to build

Add the `invoice` table to the Drizzle schema following the project's dual-ID pattern (bigint PK + nanoId, `withTimezone` timestamps). Fields: merchant (varchar), date (timestamp), amount (numeric), currency (varchar), category (varchar), description (text), tax (numeric). Wire up a full oRPC invoice router with `create`, `list`, `update`, and `delete` procedures — `list` ordered by date descending, `update` and `delete` keyed by nanoId. Scaffold the `/invoice` page as an empty shell inside the `(tools)` route group so it renders at the correct URL. Write CRUD tests for the router.

## Acceptance criteria

- [ ] `invoice` table in schema with all required fields using dual-ID pattern
- [ ] `amount` and `tax` stored as `numeric` (not float) to avoid precision issues
- [ ] oRPC invoice router exposes `create`, `list`, `update`, `delete`
- [ ] `invoice.list` returns records ordered by date descending
- [ ] `invoice.update` and `invoice.delete` operate by nanoId
- [ ] `/invoice` route renders without errors (placeholder heading is fine)
- [ ] Router CRUD tests pass

## Blocked by

None — can start immediately.

## User stories addressed

- User story 13 (see all invoices — API layer only)
