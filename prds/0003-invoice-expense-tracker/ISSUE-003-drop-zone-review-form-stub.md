---
id: "003"
title: Drop zone + review form (stub extraction)
prd: "0003"
status: closed
type: afk
blocked_by: ["001"]
created: 2026-04-01
---

## Parent PRD

prds/0003-invoice-expense-tracker/PRD.md

## What to build

Add the `InvoiceDropZone` component above the table on the `/invoice` page. It must handle drag-and-drop (`dragover`, `drop` events) and include a fallback file `<input>` button. Accepted types: PDF, JPG, PNG, WEBP — reject anything else with a visible error. On drop, call a Next.js server action that returns a **stub** extraction result (empty/zero values) without touching Ollama. The result opens a review form pre-populated with all invoice fields (merchant, date, amount, currency, category, description, tax). The user can edit every field then click Save, which calls `invoice.create` — the new record must appear in the table. Show a loading/processing state while the server action runs.

## Acceptance criteria

- [x] Drop zone accepts PDF, JPG, PNG, WEBP; rejects other file types with an error message
- [x] Fallback file input button triggers the same flow as drag-and-drop
- [x] Dropping a file calls the server action and opens the review form
- [x] Review form shows all fields pre-populated (stub values are fine at this stage)
- [x] User can edit every field before saving
- [x] Saving calls `invoice.create` and the record appears in the table without a page reload
- [x] Processing/loading state is visible while the server action runs

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

## Completion

Created `extract-invoice.ts` server action (`"use server"`) that validates MIME type and returns stub data. Created `InvoiceDropZone` client component with `dragover`/`drop`/`dragleave` handlers plus a hidden `<input type="file">` fallback. On drop/select, calls `extractInvoice(formData)` with "Processing…" state; on success, opens a review Dialog pre-populated with all 7 fields (merchant, date, amount, currency, category, description, tax), all editable. Saving calls `orpc.invoice.create()` then triggers `onCreated()` to refresh the table.

Refactored `InvoiceTable` to accept `invoices`/`loading`/`onEdit`/`onDelete` as props (removed self-fetching). Created `InvoiceSection` client orchestrator that owns the list state and wires `InvoiceDropZone` + `InvoiceTable` together. Updated `page.tsx` to render `<InvoiceSection />`. Also added `z.coerce.date()` override in `insertInvoiceSchema` so ISO strings from JSON RPC are accepted for the date field. All 33 tests pass.
