# Plan: Amortization Calculator

> Source PRD: prds/0001-amortization-calculator/PRD.md

## Architectural decisions

- **Route**: `/tools/amortization` — `src/app/tools/amortization/page.tsx` outside the `(app)` authenticated group
- **Authentication**: None — fully public, no session check
- **Layout**: Minimal `<main>` with consistent padding; no sidebar or navbar; two-column on desktop, stacked on mobile
- **Math model**: Pure TS function `calculateAmortization()` in colocated `lib/amortization.ts`, using `decimal.js-light` for precision
- **State**: `useState` for inputs and results; `localStorage` key `"amortization-inputs"` for persistence
- **Charts**: recharts via existing `ChartContainer` wrapper (`src/components/ui/chart.tsx`)
- **No backend**: No API routes, server actions, or database involvement

---

## Phase 1: Core math + page scaffold

**User stories**: 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 17, 18

### What to build

Stand up the `/tools/amortization` route with a working input form (loan amount, term years, term months, interest rate), Calculate and Clear buttons, and a summary result section (monthly payment, total payments, total interest). Wire the pure `calculateAmortization()` function end-to-end: inputs → computation → displayed formatted USD values. The page is publicly accessible, mobile-responsive, and visually consistent with the app's shadcn/ui style. No charts or table yet.

### Acceptance criteria

- [ ] `/tools/amortization` loads without authentication
- [ ] User can enter loan amount, term (years + months), and annual interest rate
- [ ] Clicking Calculate computes the correct monthly payment, total payments, and total interest
- [ ] Results are formatted as USD currency (`$1,687.71` style)
- [ ] Clicking Clear resets inputs to defaults and hides results
- [ ] Layout stacks vertically on mobile and splits into two columns on desktop (≥ md breakpoint)
- [ ] `calculateAmortization()` is a pure function unit-tested with Vitest covering at least: standard 30-year mortgage, 15-year loan, zero-interest edge case
- [ ] Page uses shadcn/ui `Card`, `Input`, `Label`, `Button` components

---

## Phase 2: localStorage persistence

**User stories**: 16

### What to build

On page mount, read saved inputs from `localStorage` key `"amortization-inputs"` and populate the form. On each successful Calculate, write the validated inputs back to `localStorage`. Handles first-visit (no stored value) and malformed stored JSON gracefully.

### Acceptance criteria

- [ ] Inputs are restored from `localStorage` on page load when a previous session exists
- [ ] Inputs are saved to `localStorage` after each successful Calculate
- [ ] No crash or console error on first visit (empty localStorage)
- [ ] No crash or console error when stored JSON is malformed (corrupted key)
- [ ] Clear button does NOT wipe localStorage (inputs remain available on next visit)

---

## Phase 3: Amortization schedule table

**User stories**: 12, 13, 14

### What to build

Below the summary section, add a full-width amortization schedule table with two tabs: Annual Schedule and Monthly Schedule. Annual shows one row per year (Year, Interest paid, Principal paid, Ending Balance). Monthly shows one row per month (Month #, Interest, Principal, Ending Balance). All monetary values formatted as USD. Table is scrollable on mobile.

### Acceptance criteria

- [ ] Two tabs rendered — Annual Schedule and Monthly Schedule
- [ ] Annual tab shows correct yearly aggregated Interest, Principal, and Ending Balance for all years
- [ ] Monthly tab shows correct per-month Interest, Principal, and Ending Balance for every month of the loan
- [ ] All monetary columns formatted as USD
- [ ] Table scrolls horizontally on narrow viewports
- [ ] Switching tabs does not re-trigger the calculation

---

## Phase 4: Charts

**User stories**: 10, 11

### What to build

Add two charts to the right column (above or beside the summary): a donut/pie chart showing the Principal vs. Interest proportion of total cost, and a line chart with yearly data points for Ending Balance, Cumulative Interest, and Payment over the loan lifetime. Both charts use `ChartContainer` and recharts, styled with the app's chart color tokens.

### Acceptance criteria

- [ ] Donut chart renders with two segments: Principal (total payments minus total interest) and Interest (total interest)
- [ ] Donut chart labels/legend identify each segment
- [ ] Line chart renders three lines: Ending Balance, Cumulative Interest, Payment — one point per year
- [ ] Line chart X-axis shows year numbers; Y-axis shows formatted dollar amounts (abbreviated: `$200K`)
- [ ] Both charts are responsive within their container
- [ ] Charts only render after Calculate is clicked (hidden when no results)
- [ ] Charts use the existing `ChartContainer` component and app color tokens

