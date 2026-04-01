# Plan: Primitives Route

> Source PRD: prds/0001-primitives-route/PRD.md

## Architectural decisions

- **Routes**: `/primitives` (grid) and `/primitives/[slug]` (detail demo), both inside `src/app/(app)/primitives/`
- **Nav config**: A single primitives nav config file in `src/components/nav/` defines the canonical list — slug, name, description, icon. This is the single source of truth for sidebar, grid, and slug resolution.
- **Demo components**: Each primitive gets one self-contained demo component that owns its own `useAppForm` instance with a single field.
- **Slug format**: lowercase, hyphenated component name (e.g. `text-input`, `date-range-input`)
- **Auth/layout**: Route lives inside `(app)` group — no auth changes. Layout follows `FormsSidebar`/`ToolsSidebar` pattern exactly.
- **Schema**: None — no database or API changes.

---

## Phase 1: Route scaffold with one primitive end-to-end

**User stories**: 1, 2, 3, 4, 5, 6, 7, 8, 9

### What to build

Stand up the full `/primitives` route structure with a single primitive (`text-input`) working end-to-end. This covers every layer: nav config, layout with sidebar, grid page with one card, and a detail page with a live interactive demo.

By the end of this phase the route is fully navigable and demonstrates the complete pattern — adding more primitives in Phase 2 is purely additive.

### Acceptance criteria

- [ ] Navigating to `/primitives` renders a grid page with at least one card (TextInput)
- [ ] The card shows the primitive name, a short description, and a Lucide icon
- [ ] Clicking the card navigates to `/primitives/text-input`
- [ ] The detail page renders a working `TextInput` inside a minimal form (field is interactive)
- [ ] A `PrimitivesSidebar` is visible on both the grid and detail pages
- [ ] The sidebar lists at least the one primitive and highlights the active route
- [ ] The sidebar contains a back link to `/primitives`
- [ ] Layout matches the existing `/forms` section style (wireframe wrapper, responsive sidebar)
- [ ] No TypeScript errors (`tsc --noEmit` passes)

---

## Phase 2: All remaining primitives

**User stories**: 1, 2, 3, 4, 5, 6

### What to build

Extend the nav config and add demo components for every remaining form primitive. Each primitive gets a card on the grid and a working detail page. The sidebar automatically reflects the full list since it is driven by the nav config.

Primitives to add (13 remaining after TextInput):
- `text-area-input`
- `card-number-input`
- `cvv-input`
- `currency-input`
- `decimal-input`
- `date-input`
- `date-range-input`
- `select-input`
- `choice-input`
- `username-input`
- `phone-number-input`
- `country-code-input`
- `text-input-raw`

### Acceptance criteria

- [ ] All 14 primitives appear as cards on the `/primitives` grid
- [ ] Each card has a distinct Lucide icon semantically matching the input type
- [ ] Every primitive has a working detail page at `/primitives/[slug]`
- [ ] Each detail demo renders the actual component inside a minimal form (interactive)
- [ ] Unknown slugs (e.g. `/primitives/does-not-exist`) show a 404 or not-found state
- [ ] The sidebar lists all 14 primitives in alphabetical or logical order
- [ ] No TypeScript errors (`tsc --noEmit` passes)
