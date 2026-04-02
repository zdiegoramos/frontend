---
id: "003"
title: Drop zone + review form (stub extraction)
prd: "0003"
status: open
type: afk
blocked_by: ["001"]
created: 2026-04-01
---

## Parent PRD

prds/0003-invoice-expense-tracker/PRD.md

## What to build

Add the `InvoiceDropZone` component above the table on the `/invoice` page. It must handle drag-and-drop (`dragover`, `drop` events) and include a fallback file `<input>` button. Accepted types: PDF, JPG, PNG, WEBP — reject anything else with a visible error. On drop, call a Next.js server action that returns a **stub** extraction result (empty/zero values) without touching Ollama. The result opens a review form pre-populated with all invoice fields (merchant, date, amount, currency, category, description, tax). The user can edit every field then click Save, which calls `invoice.create` — the new record must appear in the table. Show a loading/processing state while the server action runs.

## Acceptance criteria

- [ ] Drop zone accepts PDF, JPG, PNG, WEBP; rejects other file types with an error message
- [ ] Fallback file input button triggers the same flow as drag-and-drop
- [ ] Dropping a file calls the server action and opens the review form
- [ ] Review form shows all fields pre-populated (stub values are fine at this stage)
- [ ] User can edit every field before saving
- [ ] Saving calls `invoice.create` and the record appears in the table without a page reload
- [ ] Processing/loading state is visible while the server action runs

## Blocked by

- ISSUE-001

## User stories addressed

- User story 1 (drag-and-drop PDF)
- User story 2 (drag-and-drop image)
- User story 10 (review extracted fields before saving)
- User story 11 (edit fields in review form)
- User story 12 (save to database)
- User story 16 (loading indicator while processing)
- User story 18 (drop multiple files in sequence)
