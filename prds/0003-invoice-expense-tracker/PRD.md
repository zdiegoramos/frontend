---
id: "0003"
title: Invoice Expense Tracker
status: draft
created: 2026-04-01
---

## Problem Statement

Tracking personal expenses from invoices and receipts is tedious. Users must manually enter data from PDFs and photos into a spreadsheet or app. There is no fast, local-first way to drop a file and immediately have structured expense data ready to review.

## Solution

A `/invoice` page that accepts drag-and-drop uploads of PDF and image files (JPG, PNG, WEBP). Each file is sent to a locally running Ollama vision model (`llama3.2-vision`) via a server action. The model extracts structured expense fields, which are reviewed and saved to the database. A table below the drop zone shows all recorded invoices with inline editing and delete.

## User Stories

1. As a user, I want to drag and drop a PDF invoice onto the page so that I don't have to manually open a file picker.
2. As a user, I want to drag and drop an image (JPG, PNG, WEBP) of a receipt so that I can process handwritten or photographed invoices.
3. As a user, I want the AI to automatically extract the merchant name from my invoice so that I don't have to type it.
4. As a user, I want the AI to extract the invoice date so that my expense records are accurately dated.
5. As a user, I want the AI to extract the total amount so that I can see how much I spent.
6. As a user, I want the AI to extract the currency so that multi-currency expenses are handled correctly.
7. As a user, I want the AI to auto-classify a category (Food, Travel, Software, Utilities, etc.) so that my expenses are organized without manual effort.
8. As a user, I want the AI to generate a short description of what was purchased so that I have context for each expense.
9. As a user, I want the AI to extract the tax amount so that I can separate net and gross costs.
10. As a user, I want to review the extracted fields before saving so that I can correct AI mistakes.
11. As a user, I want to edit any field in the extracted result so that I can fix incorrect extractions.
12. As a user, I want to save the extracted invoice to the database so that my expense history is persisted.
13. As a user, I want to see all my recorded invoices in a table so that I can review my expense history.
14. As a user, I want to edit any field of a saved invoice inline so that I can correct mistakes after saving.
15. As a user, I want to delete a saved invoice so that I can remove duplicate or erroneous entries.
16. As a user, I want to see a loading indicator while the AI is processing so that I know the file was received.
17. As a user, I want to see an error message if the AI fails to extract data so that I understand what went wrong.
18. As a user, I want to drop multiple files in sequence so that I can process a batch of receipts.

## Implementation Decisions

### Modules

- **Ollama service**: A server-only module that accepts a file buffer and MIME type, converts it to base64, sends it to `http://localhost:11434/api/generate` with `llama3.2-vision`, and parses the JSON response into structured invoice fields.
- **`extractInvoice` server action**: Receives FormData from the client (file upload), validates the file type, calls the Ollama service, and returns the extracted fields. Does not persist to the database — that is a separate step after user review.
- **`invoice` database table**: Stores persisted invoice records with fields: merchant, date, amount, currency, category, description, tax, plus the standard nanoId / bigint PK / timestamps pattern.
- **oRPC invoice router**: CRUD operations — create, list, update (by nanoId), delete (by nanoId). Follows the same pattern as existing routers (widget, bug, etc.).
- **`InvoiceDropZone` component**: Client component. Handles drag-and-drop (`dragover`, `drop` events) and a fallback file `<input>`. Displays a preview of the dropped file name and the processing state. On drop, calls the server action and surfaces the result in a review form.
- **Review form**: Inline form pre-populated with AI-extracted fields. User can edit any field before clicking Save. On save, calls the oRPC `invoice.create` procedure.
- **`InvoiceTable` component**: TanStack Table showing all saved invoices. Columns: merchant, date, amount, currency, category, description, tax, actions (edit/delete). Inline editing via cell renderers backed by `invoice.update`. Delete calls `invoice.delete` with confirmation.
- **`/invoice` page**: Composes `InvoiceDropZone` + `InvoiceTable`. Lives in the `(tools)` route group.

### Architectural decisions

- **Route**: `/invoice` under `(tools)` group, shares `ToolsLayout` (sidebar + nav).
- **AI transport**: Server action → Ollama HTTP API. The client never talks to Ollama directly.
- **File handling**: Files are passed as `FormData` to the server action. No file is persisted to disk — it is read into memory, base64-encoded, and forwarded to Ollama inline.
- **PDF support**: PDFs are rendered to a base64 image server-side before sending to Ollama, since the vision model expects image input. We use the `pdf2pic` or equivalent approach if needed; alternatively treat single-page PDFs as images directly if Ollama supports PDF mime type in the future. For the initial implementation, convert PDF to image using a server-side library.
- **Schema pattern**: Follows the dual-ID pattern (bigint PK + nanoId) with `withTimezone` timestamps, matching all other tables. `amount` and `tax` stored as `numeric` (decimal string) to avoid floating point errors.
- **Category**: Stored as a free-text `varchar`, not a PG enum, since AI-generated categories are open-ended and may evolve.
- **Validation**: Zod schemas auto-generated via drizzle-zod, same as other tables. AI extraction output is also validated against the schema before presenting to the user.

## Testing Decisions

Good tests verify external behavior through the module's public interface, not internal implementation. They should remain valid if the implementation changes.

- **Ollama service**: Unit test the prompt construction and JSON parsing. Mock the `fetch` call to Ollama. Verify that valid model output is correctly parsed into structured fields, and that malformed output is gracefully handled (partial data returned, no crash).
- **`extractInvoice` server action**: Integration test with a mocked Ollama service. Verify it rejects unsupported file types and returns structured data for valid inputs.
- **oRPC invoice router**: Integration tests following the pattern in the existing widget/bug routers. Verify create, list, update, delete against the real DB (using `DB_MOCK=true` or a test DB).
- **Prior art**: `src/app/(tools)/tools/amortization/__tests__/amortization.test.ts` for pure logic tests; existing oRPC handler patterns for API tests.

## Out of Scope

- Multi-user support — no authentication or user-scoped data for this feature.
- Bulk export (CSV, PDF report) of expense history.
- Charts or spending summaries.
- Recurring expense detection.
- Email-to-invoice ingestion.
- Cloud AI fallback if Ollama is not running.
- Line-item extraction (only totals, not individual line items).

## Further Notes

- Ollama must be installed and `llama3.2-vision` pulled (`ollama pull llama3.2-vision`) for extraction to work. The UI should surface a clear error if Ollama is unreachable.
- The `llama3.2-vision` model requires ~8GB of RAM. M1 MacBook Pro is the target hardware.
- PDF-to-image conversion may require a native dependency (e.g., `poppler`). If this adds too much friction, we can accept PDF but display a warning that multi-page PDFs will only process the first page.
