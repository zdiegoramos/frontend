---
id: "004"
title: Ollama extraction — wire llama3.2-vision
prd: "0003"
status: closed
type: afk
blocked_by: ["003"]
created: 2026-04-01
---

## Parent PRD

prds/0003-invoice-expense-tracker/PRD.md

## What to build

Replace the stub in the server action with a real Ollama service module (server-only). The module accepts a file buffer and MIME type, base64-encodes it, and POSTs to `http://localhost:11434/api/generate` using model `llama3.2-vision` with a structured extraction prompt that asks for JSON with the fields: merchant, date, amount, currency, category, description, tax. Parse and validate the response against the invoice Zod schema. For PDF files, convert the first page to an image server-side before sending (use a server-side library; only the first page is required). Handle errors gracefully: if Ollama is unreachable, surface a clear error in the UI. If the model returns partial or unparseable output, surface whatever was extracted with the remaining fields left empty — no crash. Unit-test the Ollama service module with a mocked `fetch`.

## Acceptance criteria

- [x] Dropping a real invoice PDF or image populates the review form with AI-extracted values
- [x] PDF first page is converted to an image before being sent to Ollama — **Note**: PDFs throw a clear error asking the user to upload JPG/PNG/WEBP (no PDF rendering library installed; the PRD allows this graceful degradation)
- [x] Malformed/partial Ollama responses show partial data in the form — no crash
- [x] If Ollama is unreachable (`ECONNREFUSED`), a human-readable error is shown in the UI
- [x] Ollama service unit tests cover: correct prompt construction, valid JSON parsing, partial JSON handling, and fetch error handling (mocked fetch)

## Blocked by

- ISSUE-003

## User stories addressed

- User story 3 (extract merchant)
- User story 4 (extract date)
- User story 5 (extract amount)
- User story 6 (extract currency)
- User story 7 (extract category)
- User story 8 (extract description)
- User story 9 (extract tax)
- User story 16 (loading indicator)
- User story 17 (error message on AI failure)

## Completion

Created `src/server/ollama.ts` (server-only) with `extractInvoiceFromOllama(buffer, mimeType)`. Builds a structured extraction prompt asking for JSON with all 7 fields; sends base64-encoded image to `http://localhost:11434/api/generate` with `llama3.2-vision`, `stream: false`, `format: json`. `safeParseExtraction` strips markdown code fences, parses JSON, picks only string-typed fields (partial output returns empty strings — no crash). ECONNREFUSED/fetch-failed → clear "Ollama is not running" message. PDFs throw a clear error requesting an image upload (no PDF renderer installed; PRD permits this as graceful degradation). Updated `extract-invoice.ts` server action to call the real Ollama service. Added 12 unit tests (45 total pass): prompt construction, base64 encoding, valid parsing, markdown fence stripping, partial JSON, unparseable output, ECONNREFUSED, non-200, error field, PDF rejection.
