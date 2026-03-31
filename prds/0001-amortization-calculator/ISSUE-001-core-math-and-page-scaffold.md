---
id: "001"
title: Core math + page scaffold
prd: "0001"
status: closed
type: afk
blocked_by: []
created: 2026-03-31
---

## Parent PRD

prds/0001-amortization-calculator/PRD.md

## What to build

Stand up `/tools/amortization` as a public Next.js App Router page (outside the `(app)` auth group). Build the `calculateAmortization()` pure function in `src/app/tools/amortization/lib/amortization.ts` using `decimal.js-light`. Wire inputs → computation → displayed results end-to-end.

**Files to create:**
- `src/app/tools/amortization/page.tsx` — root page, `"use client"`, owns state
- `src/app/tools/amortization/lib/amortization.ts` — pure calculation function
- `src/app/tools/amortization/components/amortization-inputs.tsx` — form section
- `src/app/tools/amortization/components/amortization-summary.tsx` — summary card
- `src/app/tools/amortization/__tests__/amortization.test.ts` — Vitest unit tests

The layout is two-column on desktop (inputs left, summary right), stacked on mobile. No charts or table yet. No auth, no API calls.

## Acceptance criteria

- [ ] `/tools/amortization` loads without authentication (no session check or redirect)
- [ ] User can enter loan amount, term (years + months separately), and annual interest rate
- [ ] Clicking Calculate computes and displays the correct monthly payment, total payments, and total interest
- [ ] All monetary values formatted as USD (`$1,687.71` style) via `Intl.NumberFormat`
- [ ] Clicking Clear resets inputs to defaults and hides results
- [ ] Layout is two-column on desktop (≥ `md` breakpoint), single-column on mobile
- [ ] Page uses shadcn/ui `Card`, `Input`, `Label`, `Button` components — consistent with app style
- [ ] `calculateAmortization()` is a pure exported function unit-tested with Vitest covering:
  - Standard 30-year mortgage (e.g. $200k at 6%)
  - 15-year loan
  - Zero-interest edge case (equal principal splits)
  - Verifies `monthlyPayment`, `totalPayments`, `totalInterest`, and at least one schedule row

## Blocked by

None — can start immediately.

## User stories addressed

- User story 1 (public access, no login)
- User story 2 (loan amount input)
- User story 3 (term in years + months)
- User story 4 (annual interest rate)
- User story 5 (Calculate button)
- User story 6 (Clear button)
- User story 7 (monthly payment display)
- User story 8 (total payments display)
- User story 9 (total interest display)
- User story 15 (USD formatting)
- User story 17 (mobile responsive)
- User story 18 (shadcn/ui style)

## Completion

Built the `/tools/amortization` public page with full end-to-end calculation wired in.

**Key decisions:**
- `calculateAmortization()` in `lib/amortization.ts` uses `decimal.js-light` for precision; handles zero-interest edge case with equal principal splits.
- `AmortizationInputs` component manages loan amount (with `$` prefix), term years/months (grid), and annual rate (with `%` suffix) using native `<Input>` + `<Label>` shadcn components.
- `AmortizationSummary` renders monthly payment prominently plus total payments and total interest in a `<Card>`.
- `page.tsx` is `"use client"` and owns all state; shows a dashed placeholder when no result is computed yet.
- Layout is `grid-cols-1 md:grid-cols-2` — stacks on mobile, two-column on desktop.

**Files created:**
- `src/app/tools/amortization/page.tsx`
- `src/app/tools/amortization/lib/amortization.ts`
- `src/app/tools/amortization/components/amortization-inputs.tsx`
- `src/app/tools/amortization/components/amortization-summary.tsx`
- `src/app/tools/amortization/__tests__/amortization.test.ts` (5 tests, all green)
