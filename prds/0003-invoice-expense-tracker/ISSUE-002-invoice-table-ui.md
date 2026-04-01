---
id: "002"
title: Invoice table UI — list, edit, delete
prd: "0003"
status: open
type: afk
blocked_by: ["001"]
created: 2026-04-01
---

## Parent PRD

prds/0003-invoice-expense-tracker/PRD.md

## What to build

Build the `InvoiceTable` component on the `/invoice` page using TanStack Table (already in the project). Fetch all invoices from `invoice.list` and render columns for merchant, date, amount, currency, category, description, tax, and an actions column. Actions column: inline edit (opens a form pre-populated with all fields, saves via `invoice.update`) and delete (with a confirmation step, calls `invoice.delete`). After any mutation, refresh the list. Show an empty state when no records exist and a loading state while fetching.

## Acceptance criteria

- [ ] Table renders all saved invoices with correct columns
- [ ] Empty state shown when no invoices exist
- [ ] Loading state shown while data is fetching
- [ ] Delete removes the row after confirmation and refreshes the list
- [ ] Inline edit pre-populates all fields and persists changes via `invoice.update`
- [ ] Table is demoable by seeding a record directly in the DB

## Blocked by

- ISSUE-001

## User stories addressed

- User story 13 (see all invoices)
- User story 14 (edit a saved invoice)
- User story 15 (delete a saved invoice)
