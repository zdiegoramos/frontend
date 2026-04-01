---
id: "004"
title: Ollama extraction — wire llama3.2-vision
prd: "0003"
status: open
type: afk
blocked_by: ["003"]
created: 2026-04-01
---

## Parent PRD

prds/0003-invoice-expense-tracker/PRD.md

## What to build

Replace the stub in the server action with a real Ollama service module (server-only). The module accepts a file buffer and MIME type, base64-encodes it, and POSTs to `http://localhost:11434/api/generate` using model `llama3.2-vision` with a structured extraction prompt that asks for JSON with the fields: merchant, date, amount, currency, category, description, tax. Parse and validate the response against the invoice Zod schema. For PDF files, convert the first page to an image server-side before sending (use a server-side library; only the first page is required). Handle errors gracefully: if Ollama is unreachable, surface a clear error in the UI. If the model returns partial or unparseable output, surface whatever was extracted with the remaining fields left empty — no crash. Unit-test the Ollama service module with a mocked `fetch`.

## Acceptance criteria

- [ ] Dropping a real invoice PDF or image populates the review form with AI-extracted values
- [ ] PDF first page is converted to an image before being sent to Ollama
- [ ] Malformed/partial Ollama responses show partial data in the form — no crash
- [ ] If Ollama is unreachable (`ECONNREFUSED`), a human-readable error is shown in the UI
- [ ] Ollama service unit tests cover: correct prompt construction, valid JSON parsing, partial JSON handling, and fetch error handling (mocked fetch)

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
