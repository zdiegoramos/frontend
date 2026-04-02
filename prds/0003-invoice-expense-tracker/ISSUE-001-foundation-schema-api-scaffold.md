---
id: "001"
title: Foundation — schema, API, page scaffold
prd: "0003"
status: closed
type: afk
blocked_by: []
created: 2026-04-01
---

## Parent PRD

prds/0003-invoice-expense-tracker/PRD.md

## What to build

Add the `invoice` table to the Drizzle schema following the project's dual-ID pattern (bigint PK + nanoId, `withTimezone` timestamps). Fields: merchant (varchar), date (timestamp), amount (numeric), currency (varchar), category (varchar), description (text), tax (numeric). Wire up a full oRPC invoice router with `create`, `list`, `update`, and `delete` procedures — `list` ordered by date descending, `update` and `delete` keyed by nanoId. Scaffold the `/invoice` page as an empty shell inside the `(tools)` route group so it renders at the correct URL. Write CRUD tests for the router.

## Acceptance criteria

- [x] `invoice` table in schema with all required fields using dual-ID pattern
- [x] `amount` and `tax` stored as `numeric` (not float) to avoid precision issues
- [x] oRPC invoice router exposes `create`, `list`, `update`, `delete`
- [x] `invoice.list` returns records ordered by date descending
- [x] `invoice.update` and `invoice.delete` operate by nanoId
- [x] `/invoice` route renders without errors (placeholder heading is fine)
- [x] Router CRUD tests pass

## Blocked by

None — can start immediately.

## User stories addressed

- User story 13 (see all invoices — API layer only)

## Completion

Added the `invoice` table to `src/server/db/schema.ts` using the dual-ID pattern (bigint PK + nanoId) with `numeric` columns for `amount` and `tax`. Added `invoiceRouter` to `src/server/orpc/router.ts` with `create`, `list` (ordered by date desc), `update` (by nanoId), and `delete` (by nanoId) procedures. Scaffolded the `/tools/invoice` page at `src/app/(tools)/tools/invoice/page.tsx` with a placeholder heading. Added "Invoice Tracker" to `TOOLS_NAV`. Wrote CRUD tests at `src/server/orpc/__tests__/invoice.test.ts` using `vi.mock` on the DB and oRPC's `call` utility — all 8 new tests pass alongside the existing 25.
