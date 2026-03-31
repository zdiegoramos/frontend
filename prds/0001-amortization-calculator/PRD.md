---
id: "0001"
title: Amortization Calculator
status: draft
created: 2026-03-31
---

## Problem Statement

Users need a quick, static tool to calculate loan amortization schedules — understanding how principal and interest break down month-by-month and year-by-year over the life of a loan. There is currently no such tool in the app, and users must rely on external sites that don't match the app's design language or remember their previous inputs.

## Solution

A fully client-side amortization calculator page at `/tools/amortization` (publicly accessible, no authentication required). Users enter loan parameters, click Calculate, and immediately see:

- A summary card with the monthly payment, total payments, and total interest
- A donut/pie chart showing Principal vs. Interest proportion
- A line chart (yearly data points) showing Balance, Cumulative Interest, and Payment over time
- A paginated amortization schedule table with Annual and Monthly Schedule tabs

Inputs are persisted to `localStorage` so they are restored on the next visit. No backend or database involvement.

## User Stories

1. As a visitor, I want to access the amortization calculator without logging in, so that I can use it as a free public tool.
2. As a user, I want to enter a loan amount, so that the calculator uses my specific debt as the starting point.
3. As a user, I want to set the loan term in years and months, so that I can model flexible repayment periods.
4. As a user, I want to enter an annual interest rate as a percentage, so that the calculator uses my lender's rate.
5. As a user, I want to click a Calculate button to trigger the computation, so that I control when results update.
6. As a user, I want to click a Clear button to reset all inputs to defaults, so that I can start over quickly.
7. As a user, I want to see my monthly payment amount prominently displayed, so that I immediately understand my cash-flow impact.
8. As a user, I want to see the total of all payments over the life of the loan, so that I understand the full cost.
9. As a user, I want to see the total interest paid, so that I can understand the cost of borrowing.
10. As a user, I want to see a pie/donut chart showing the principal vs. interest proportion, so that I get a visual sense of how much of my payoff goes to interest.
11. As a user, I want to see a line chart with yearly data points for Balance, Cumulative Interest, and Payment over time, so that I can visualize how the loan behaves across its lifetime.
12. As a user, I want to switch between Annual Schedule and Monthly Schedule tabs on the amortization table, so that I can view the detail I need.
13. As a user, I want the annual schedule to show Year, Interest paid, Principal paid, and Ending Balance per year, so that I can track the loan year by year.
14. As a user, I want the monthly schedule to show Month, Interest, Principal, and Ending Balance per month, so that I can track the loan at a fine-grained level.
15. As a user, I want currency values formatted as USD (e.g. `$1,687.71`), so that the output is human-readable.
16. As a user, I want my last-entered inputs (loan amount, term, interest rate) restored when I return to the page, so that I don't have to re-enter them each visit.
17. As a user, I want the calculator to work on mobile, so that I can use it from my phone.
18. As a user, I want the page to use the same visual style as the rest of the app (shadcn/ui components, Tailwind, Geist font), so that it feels cohesive.

## Implementation Decisions

### Route & Layout
- **Route**: `/tools/amortization` — a new Next.js App Router `page.tsx` under `src/app/tools/amortization/`
- **Layout**: No shared `(app)` layout; this route lives outside the authenticated route group. Uses a simple, minimal layout (plain `<main>` with consistent padding) without sidebar or navbar — matching the public nature of the tool. A small "Tools" breadcrumb or title header suffices.
- **Authentication**: None — no session check, no redirect.

### Amortization Math Module
- A pure TypeScript function `calculateAmortization(params)` in a colocated `lib/amortization.ts` file.
- Uses `decimal.js-light` (already in the project via recharts, and available directly) for precise decimal arithmetic.
- Input: `{ loanAmount, termYears, termMonths, annualInterestRate }` (all numbers).
- Output: `{ monthlyPayment, totalPayments, totalInterest, monthlySchedule: MonthlyRow[], yearlySchedule: YearlyRow[] }` where each row contains period, interest, principal, endingBalance, and cumulativeInterest.
- This function is pure and exportable — easy to unit test in isolation.

### State & localStorage
- Component state managed with `useState` for inputs and results.
- On mount, read saved inputs from `localStorage` key `"amortization-inputs"`.
- On Calculate, write validated inputs to `localStorage`.
- No framework for persistence — plain `localStorage.getItem/setItem`.

### Components
- **`AmortizationInputs`**: Form section with labeled inputs for loan amount, term (years + months separately), and interest rate. Uses existing `<Input>` and `<Label>` from shadcn/ui. A "Calculate" button (primary) and "Clear" button (ghost).
- **`AmortizationSummary`**: Summary card showing Monthly Payment (large), Total Payments, Total Interest. Uses `<Card>` from shadcn/ui.
- **`AmortizationPieChart`**: Donut pie chart (Principal vs. Interest) using `PieChart` from recharts via the existing `ChartContainer` wrapper.
- **`AmortizationLineChart`**: Line chart with yearly Balance, Cumulative Interest, and Payment lines using `LineChart` from recharts via `ChartContainer`.
- **`AmortizationTable`**: Tabs (Annual / Monthly) with a scrollable table. Uses `<Tabs>`, `<Table>` from shadcn/ui.
- All components are colocated in `src/app/tools/amortization/` (file-based colocation, not a shared `components/` folder since this is a single-use tool).

### Layout Composition
- Two-column layout on desktop: inputs (left) + summary + charts (right). Stacks vertically on mobile.
- Table below the two-column section, full width.

### No Backend
- No API calls, no database, no server actions.
- The page can be marked `"use client"` since it is entirely interactive.

### Number Formatting
- Currency values use `Intl.NumberFormat` with `style: "currency"`, `currency: "USD"`.
- Interest rate displayed as a plain number with `%` suffix.

## Testing Decisions

- **What to test**: Only external behavior of the pure `calculateAmortization` function — given inputs, verify `monthlyPayment`, `totalPayments`, `totalInterest`, and specific rows of the schedule match expected values. Do not test React component internals or DOM.
- **Test file location**: `src/app/tools/amortization/__tests__/amortization.test.ts` following the existing `src/lib/__tests__/` pattern.
- **Test framework**: Vitest (already configured in `vitest.config.ts`).
- **Prior art**: `src/lib/__tests__/` for pure function tests.
- **What NOT to test**: React rendering, localStorage persistence, chart rendering.

## Out of Scope

- Extra payments (additional monthly/yearly principal payments) — not included in this version.
- Export to PDF or print stylesheet.
- Saving/comparing multiple loan scenarios.
- Server-side rendering with database persistence.
- Authentication or user accounts.
- Internationalization (currency other than USD, non-English labels).

## Further Notes

- `decimal.js-light` is already a transitive dependency (via recharts). It should be importable directly.
- The existing `money.ts` utils in `src/lib/money.ts` may have relevant formatting helpers — check before writing new ones.
- The `ChartContainer` component in `src/components/ui/chart.tsx` handles theming and responsive sizing — use it for both charts.
