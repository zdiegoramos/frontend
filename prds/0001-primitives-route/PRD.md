---
id: "0001"
title: Primitives Route
status: draft
created: 2026-04-01
---

## Problem Statement

The project has a growing library of form input primitives in `src/components/form`, but there is no dedicated place to browse, discover, or interact with them. Developers working on the project have no visual reference for what each component looks like or how it behaves, forcing them to trace through existing form pages or read source code to understand available building blocks.

## Solution

Add a `/primitives` route to the app that serves as a component gallery. It presents all form primitives in a navigable grid. Clicking any card navigates to a detail sub-route (`/primitives/[slug]`) where a full interactive demo of that component is shown inside a minimal self-contained form.

The route follows the same structural pattern as `/forms` and `/tools`: a sidebar listing all primitives, and a main content area.

## User Stories

1. As a developer, I want to navigate to `/primitives` and see all available form primitives in a grid, so that I can quickly discover what building blocks exist.
2. As a developer, I want each grid card to show the primitive's name, a short description, and a relevant icon, so that I can understand the component's purpose at a glance without reading code.
3. As a developer, I want to click a primitive card and be taken to `/primitives/[slug]`, so that I can see a full interactive demo of that component.
4. As a developer, I want the detail page to render the actual component in a working form, so that I can interact with it (type, select, pick a date, etc.) and understand its real behavior.
5. As a developer, I want a sidebar on all `/primitives/*` routes listing every primitive by name, so that I can navigate between them without going back to the grid.
6. As a developer, I want the active primitive to be highlighted in the sidebar, so that I know where I am.
7. As a developer, I want a back link in the sidebar to `/primitives`, so that I can return to the grid at any time.
8. As a developer, I want the `/primitives` route to be accessible within the existing authenticated app layout, so that it is consistent with other app sections.
9. As a developer, I want the layout to be responsive, so that the sidebar hides on mobile just like `/forms` and `/tools`.

## Implementation Decisions

- The route lives inside `src/app/(app)/primitives/` following the existing `(app)` route group convention.
- A `layout.tsx` wraps the section with the shared wireframe, the new `PrimitivesSidebar`, and section navigation — matching the `FormsSidebar` / `ToolsSidebar` pattern.
- A `page.tsx` at `/primitives` renders a responsive grid of primitive cards (name + description + icon).
- A `[slug]/page.tsx` at `/primitives/[slug]` renders an interactive demo for the matched primitive.
- A nav config file (e.g. `src/components/nav/primitives.ts`) defines the list of primitives: slug, name, description, icon, and a reference to which component to demo.
- Each detail demo is a small, self-contained component that creates its own `useAppForm` instance with a single field matching the primitive being shown.
- The slug matches the component's canonical name lowercased and hyphenated (e.g. `text-input`, `date-range-input`, `phone-number-input`).
- Icons come from Lucide React, matched semantically to each input type.
- No new database schema, API routes, or authentication changes are required.

## Testing Decisions

Good tests verify external behavior (what the user sees and can do), not implementation details (which component is rendered internally).

- The nav config (primitives list) should be tested: correct slug, name, and icon fields present for each primitive.
- The slug-to-component mapping should be tested: given a known slug, the correct demo component is returned; given an unknown slug, a 404 or fallback is shown.
- No tests are needed for the demo components themselves — they are thin wrappers over the already-tested primitives.
- Prior art: no existing component unit tests found; follow the Vitest setup already in the project.

## Out of Scope

- Code snippet display (showing the source of each primitive on the detail page).
- Search or filtering of primitives on the grid page.
- Non-form primitives (buttons, cards, badges, etc.) — only `src/components/form` components for now.
- Dark/light mode toggle specific to this route.
- Any changes to the existing form components themselves.

## Further Notes

- The 16 form component files in `src/components/form` map to approximately 14 discrete primitives (some files like `index.tsx` and `field-info.tsx` are infrastructure, not standalone demos; `phone/` directory contains `PhoneNumberInput` and `CountryCodeInput`).
- The `FormFooter` and `SubscribeButton` components are form-level helpers, not field primitives — they may be included as "form helpers" or excluded; for now they are out of scope.
- Future: the route can be extended to include non-form UI primitives as the design system grows.
