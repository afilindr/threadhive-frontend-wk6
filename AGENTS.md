# ThreadHive Frontend Agent Guide

## Project Shape

- This is a React 19 application built and served with Vite.
- `src/pages/` owns screen-level composition; `src/components/` owns reusable UI; `src/services/` owns data access; `data/dummyData.js` is the current data source.
- Keep component styles beside their component in a matching `.css` file. Reuse the existing CSS custom properties and `data-theme="dark"` theme mechanism.
- Use `App.jsx` for application-level state and navigation unless a more local owner is clearly appropriate. Avoid adding a routing or state library without a concrete need.

## Commands

- `npm run dev` starts the Vite development server.
- `npm run build` creates a production build.
- `npm run lint` runs the ESLint flat configuration.
- `npm test` runs Vitest once; tests use jsdom and React Testing Library.
- `npm run preview` serves the production build locally.

Vitest is configured to load `tests/setup.js`, but that file and test files may not exist yet. Add the setup file when introducing tests rather than changing the test configuration casually.

## Implementation Conventions

- Prefer React-Bootstrap components (`Container`, `Row`, `Col`, `Card`, `Button`, `Form`, and similar) over equivalent raw HTML when a component exists.
- Prefer Bootstrap utility classes for layout and spacing. Add custom CSS only for component-specific appearance or behavior; avoid inline styles, unnecessary wrappers, and `!important`.
- Preserve responsive layout, semantic HTML, keyboard access, visible focus states, useful labels, and `aria-*` attributes where needed. Use Bootstrap Icons through the existing icon setup.
- Keep async data fetching in the service layer and call services from components with `useEffect` and local state, following the existing patterns. Services currently return dummy data and should remain easy to replace with an API later.
- Keep props and state local to the narrowest owner that needs them. Existing navigation and selected-thread flows use state and prop callbacks rather than a global store.
- Follow the existing JavaScript/JSX style and import paths. Do not introduce TypeScript, a new formatter, or a new dependency unless the task requires it.

## Validation

- After UI or logic changes, run `npm run lint` and `npm run build`.
- For behavior changes, add focused Vitest/React Testing Library coverage under `tests/` when the test setup is available, then run `npm test`.
- Do not treat a successful build as proof of runtime behavior; manually exercise changed flows with the Vite dev server when practical.

See [resources/prompts.md](resources/prompts.md) for the project’s fuller frontend and AI-assisted development notes.

## Styling
1. React-Bootstrap components over raw HTML:
   - Card instead of div wrappers
   - Button instead of button
   - Badge instead of span with badge classes
   - Form components instead of raw inputs
   - Container / Row / Col for layout

2. Prefer Bootstrap utility classes over custom CSS:
   - Spacing: m-*, p-*, gap-*, mb-*, mt-*
   - Layout: d-flex, justify-content-*, align-items-*
   - Typography: fw-bold, text-muted, small
   - Borders: border, rounded, shadow-sm
   - Backgrounds: bg-light, bg-body-tertiary

3. Do NOT:
   - Invent unnecessary custom CSS classes
   - Use inline styles unless unavoidable
   - Add unnecessary wrapper divs
   - Over-nest layout structures

4. Maintain:
   - Responsiveness
   - Proper spacing rhythm (prefer gap-2, gap-3, mb-3)
   - Clear visual hierarchy and semantic structure
   - Accessibility (aria-label, proper button types)
