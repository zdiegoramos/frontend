---
id: "002"
title: Invoice table UI — list, edit, delete
prd: "0003"
status: closed
type: afk
blocked_by: ["001"]
created: 2026-04-01
---

## Parent PRD

prds/0003-invoice-expense-tracker/PRD.md

## What to build

Build the `InvoiceTable` component on the `/invoice` page using TanStack Table (already in the project). Fetch all invoices from `invoice.list` and render columns for merchant, date, amount, currency, category, description, tax, and an actions column. Actions column: inline edit (opens a form pre-populated with all fields, saves via `invoice.update`) and delete (with a confirmation step, calls `invoice.delete`). After any mutation, refresh the list. Show an empty state when no records exist and a loading state while fetching.

## Acceptance criteria

- [x] Table renders all saved invoices with correct columns
- [x] Empty state shown when no invoices exist
- [x] Loading state shown while data is fetching
- [x] Delete removes the row after confirmation and refreshes the list
- [x] Inline edit pre-populates all fields and persists changes via `invoice.update`
- [x] Table is demoable by seeding a record directly in the DB

## Blocked by

- ISSUE-001

## User stories addressed

- User story 13 (see all invoices)
- User story 14 (edit a saved invoice)
- User story 15 (delete a saved invoice)

## Completion

Created `invoice-table.tsx` as a client component with TanStack Table. Columns: merchant, date, amount, currency, category, description, tax, actions. Edit opens a Dialog pre-populated with all fields and saves via `invoice.update`. Delete shows an AlertDialog confirmation then calls `invoice.delete`. Both mutations refresh the list via re-fetch. Skeleton shown during initial load; empty state message shown when no invoices exist. Updated `page.tsx` to compose the table beneath the page heading. Uses `@base-ui/react`'s `render` prop pattern (not Radix's `asChild`) for styled triggers. All 33 tests still pass.
