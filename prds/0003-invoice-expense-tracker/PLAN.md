# Plan: Invoice Expense Tracker

> Source PRD: prds/0003-invoice-expense-tracker/PRD.md

## Architectural decisions

- **Route**: `/invoice` inside `(tools)` route group — shares `ToolsLayout` (sidebar + nav)
- **Schema**: New `invoice` table — dual-ID pattern (bigint PK + nanoId), `numeric` for amount/tax, free-text varchar for category
- **Key models**: `invoice` (merchant, date, amount, currency, category, description, tax)
- **AI transport**: Client → Next.js server action → Ollama HTTP API (`http://localhost:11434`). No client-to-Ollama direct calls.
- **File handling**: FormData to server action, base64-encoded in memory, forwarded to Ollama. Nothing written to disk.
- **PDF handling**: Convert first page to image server-side before sending to Ollama vision model.
- **State**: No global state manager — local React state in the page component, oRPC for server data.

---

## Phase 1: Foundation — schema, API, page scaffold

**User stories**: 13 (see all invoices)

### What to build

Add the `invoice` table to the Drizzle schema, wire up a full oRPC invoice router (create, list, update, delete), and scaffold the `/invoice` page as an empty shell inside the `(tools)` route group. By the end of this phase you can create and retrieve invoice records end-to-end — the page exists at the correct URL and the API is fully operational, even though the UI shows nothing yet.

### Acceptance criteria

- [ ] `invoice` table exists in the DB schema with all required fields (merchant, date, amount, currency, category, description, tax) using the project's dual-ID pattern
- [ ] oRPC invoice router exposes `create`, `list`, `update`, `delete` procedures
- [ ] `invoice.list` returns all records ordered by date descending
- [ ] `invoice.update` and `invoice.delete` operate by nanoId
- [ ] `/invoice` route renders without errors (placeholder heading is sufficient)
- [ ] CRUD router tests pass

---

## Phase 2: Invoice table UI

**User stories**: 13, 14, 15

### What to build

Build the `InvoiceTable` component using TanStack Table. It fetches all invoices from `invoice.list` and renders columns for merchant, date, amount, currency, category, description, tax, and an actions column. The actions column has inline edit (populates a form modal/drawer) and delete (with confirmation). Changes call `invoice.update` or `invoice.delete` and refresh the list. This phase is demoable by seeding a record directly in the DB and verifying it appears, edits, and deletes correctly.

### Acceptance criteria

- [ ] Table renders all saved invoices with correct columns
- [ ] Delete removes the row after confirmation and refreshes the list
- [ ] Inline edit pre-populates all fields and saves via `invoice.update`
- [ ] Empty state shown when no invoices exist
- [ ] Loading state shown while data is fetching

---

## Phase 3: Drop zone + review form (stub extraction)

**User stories**: 1, 2, 10, 11, 12, 16, 18

### What to build

Add the `InvoiceDropZone` component above the table. It accepts drag-and-drop and a fallback file input for PDF, JPG, PNG, and WEBP files. On drop, it calls a server action that returns a **stub** extraction result (empty strings / zeroes) — no Ollama yet. The result populates a review form where the user can fill in or correct all fields before clicking Save, which calls `invoice.create` and refreshes the table. This makes the full user flow exercisable before AI is wired in.

### Acceptance criteria

- [ ] Drop zone accepts PDF, JPG, PNG, WEBP and rejects other types with an error message
- [ ] Fallback file `<input>` button works the same as drag-and-drop
- [ ] Dropping a file triggers the server action and opens the review form
- [ ] Review form shows all invoice fields (merchant, date, amount, currency, category, description, tax) pre-populated with stub data
- [ ] User can edit every field in the review form
- [ ] Saving the form calls `invoice.create` and the new record appears in the table
- [ ] Processing/loading state shown while the server action is running

---

## Phase 4: Ollama extraction

**User stories**: 3, 4, 5, 6, 7, 8, 9, 16, 17

### What to build

Replace the stub in the server action with a real Ollama service module. The module accepts a file buffer and MIME type, base64-encodes it, and sends it to `http://localhost:11434/api/generate` using `llama3.2-vision` with a structured extraction prompt. The response is parsed and validated against the invoice Zod schema. PDFs are converted to an image of the first page server-side before sending. The review form is now pre-populated with real AI-extracted values. Clear error messages are shown if Ollama is unreachable or returns unusable output.

### Acceptance criteria

- [ ] Dropping a real invoice PDF or image populates the review form with AI-extracted merchant, date, amount, currency, category, description, and tax
- [ ] PDF first page is converted to an image before being sent to Ollama
- [ ] Malformed or incomplete Ollama responses are handled gracefully (partial data shown, no crash)
- [ ] If Ollama is unreachable, a clear error message is shown (not a generic crash)
- [ ] Ollama service unit tests cover prompt construction, JSON parsing, and error paths with a mocked fetch
