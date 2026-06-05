# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **react-multistep**, a published npm package (v8.x) providing a headless
React component for multi-step forms. The component owns step state, validation
gating, and navigation; the consumer renders all UI (step indicators, prev/next
buttons, panels). It is written in TypeScript and ships as an ESM-only build
targeting React 19.2+.

## Common Development Commands

```bash
npm install        # Install dependencies
npm run build      # esbuild ESM bundle + tsc declarations + copy CSS -> ./dist
npm run typecheck  # tsc over src (NodeNext) and src+test (Bundler)
npm run lint       # eslint over src and test
npm test           # homegrown runner (test/run.mjs): jsdom + react-dom
npm run format     # prettier write over src and test
npm run prepack    # lint + typecheck + test + build (runs before publish)
```

There is a single `dist/` output. There is no separate `build/` tree and no
CommonJS bundle.

### Build pipeline (`npm run build`)

One script does three things:

1. **esbuild** bundles `src/index.ts` to `dist/index.js` as ESM
   (`--format=esm`), with a linked sourcemap, automatic JSX
   (`--jsx=automatic`), and `react` / `react/jsx-runtime` kept external (the peer
   dependency is never bundled).
2. **tsc** emits declarations only (`--emitDeclarationOnly --outDir dist`):
   `dist/index.d.ts` plus a declaration map.
3. A small Node one-liner copies `multistep.css`, `tokens.css`, and `chrome.css`
   from `src/styles/` into `dist/`.

### Working with the Example App

```bash
cd examples/client-side
npm install
npm run dev        # esbuild dev server at http://localhost:8000
```

The single canonical example (`examples/client-side`) is TypeScript and builds
directly from `src`.

## Architecture

### Headless component

The package's default export is `MultiStep` (`src/MultiStep.tsx`). It renders no
chrome. Its job is to:

- Parse `children` into an array of step elements (`React.Children.toArray` +
  `isValidElement`), throwing if there are zero valid children.
- Hold all wizard state in a `useReducer` (`src/MultiStep.tsx`): the active step,
  a per-step `StepValidity[]`, a per-step `visited` boolean array, and the total
  step count. Actions: `SYNC_STEPS`, `SET_ACTIVE`, `SET_STEP_VALIDITY`.
- Support both controlled (`activeStep` + `onStepChange`) and uncontrolled
  (`defaultStep`) operation, with clamping to the valid range. Prop-into-state
  reconciliation (step-count changes, controlled-value sync) happens during
  render via a `reconcile()` helper and stored previous-value refs, not in
  effects, so there are no `useEffect` calls for it and no StrictMode double-fire.
- Derive a `steps: Step[]` metadata array and expose the full `MultiStepApi`
  through context.
- Render steps according to `mode` (see Render mode below), wrapping each rendered
  step in `StepIndexProvider` so `useReportValidity` can resolve its index.

### The validity contract: `useReportValidity`

There is **no injected prop**. A step reports its validity by calling the
`useReportValidity()` hook (`src/MultiStepContext.tsx`) from inside its own
subtree:

```tsx
const report = useReportValidity();
useEffect(() => {
  report({ status: "valid" }); // or { status: "invalid", message?, errors? } / { status: "pending" }
}, [report /* , ...deps */]);
```

The returned callback is stable (memoized on the report channel + step index) and
dispatches `SET_STEP_VALIDITY` into the reducer. `useReportValidity` reads
`StepIndexContext` and `ReportValidityContext`; if either is null it throws the
exact string `useReportValidity must be used within a MultiStep step`.

`StepValidity` (`src/interfaces.ts`) is a discriminated union:
`{ status: "valid" }` | `{ status: "invalid"; message?; errors? }` |
`{ status: "pending" }`. Every step's initial validity is `{ status: "pending" }`,
which is not valid, so the forward gate is blocked until a step reports `valid`.

### Forward gate

`goToStep(target)` (`src/MultiStep.tsx`) allows backward navigation freely and
ignores out-of-range targets. For `target > active`, it requires every step in
`[active, target)` to have status `valid`; if any is not, it calls
`onValidationError(firstInvalidIndex)` and aborts. `next()` and `previous()` go
through `goToStep`. `complete()` finishes the wizard: when the active step is the
last step and `valid` (`canComplete`), it fires `onComplete?()`; otherwise it
calls `onValidationError(activeStep)`. All navigation callbacks (including
`complete`) read every dynamic value from a ref (`navRef`) so they stay
referentially stable across renders.

### Step-change guard (`beforeStepChange`)

An optional `beforeStepChange?: (event: StepChangeEvent) => boolean | void |
Promise<boolean | void>` prop runs after the forward validity gate passes but
before a step change commits (`StepChangeEvent` = `{ from, to, direction }`,
`direction` being `"next" | "previous" | "jump"`). Returning `false` (or a
rejected/throwing guard, which is caught and swallowed) vetoes the change;
anything else proceeds. The guard is awaited inside `goToStep`; while an async
guard is in flight `isNavigating` is `true` and overlapping navigation calls are
dropped. A navigation with no guard commits synchronously and never flips
`isNavigating`. The public signatures stay `(step: number) => void`; `complete()`
does not run the guard.

### Render mode (`keepMounted` / `unmount`)

`mode?: "unmount" | "keepMounted"` defaults to `"keepMounted"`.

- **`keepMounted`**: every step is rendered and stays mounted; inactive steps are
  wrapped in `<div hidden style={{ display: "none" }}>` (keyed by index, no
  class), removing them from the visual + a11y tree but keeping them in the DOM.
  Consequence: every step's validity effect runs from mount (even inactive ones),
  in-step state is preserved across navigation, and the DOM contains all step
  subtrees at once.
- **`unmount`**: only the active step is rendered, still wrapped in
  `StepIndexProvider`. When focus management is on (the default), the active step
  is additionally wrapped in a `<div tabIndex={-1}>` for the focus target; with
  `focusOnStepChange={false}` it renders bare with no wrapper div. Inactive state
  is discarded.

### Focus management

`focusOnStepChange?: "panel" | "heading" | false` (default `"panel"`) moves focus
when the active step changes (`src/MultiStep.tsx`). Focus is self-contained:
MultiStep owns `activeWrapperRef` (the active step's wrapper `<div>`, which always
carries `tabIndex={-1}`) and `prevActiveRef`, rather than routing through
`getPanelProps`, so `keepMounted`'s several mounted panels never collide on one
consumer ref. A `useLayoutEffect` keyed on `[activeChild, focusOnStepChange]`
reads then immediately writes `prevActiveRef.current`, returning early when the
active step did not change (guards initial mount and no-op re-renders so focus is
never stolen). When `focusOnStepChange === "heading"` it focuses the first
`h1`-`h6` inside the wrapper, falling back to the wrapper; `"panel"` (and any
non-`false` value) focuses the wrapper itself; `false` skips focusing. In
`keepMounted`, the active wrapper gets the ref + `tabIndex={-1}` while inactive
wrappers keep their hidden treatment.

### The three context hooks

The API is split across three contexts (`src/MultiStepContext.tsx`) so navigation
consumers can avoid re-rendering on state changes:

- **`useMultiStep(): MultiStepApi`** - the full API.
- **`useMultiStepState()`** - read-only slice: `activeStep`, `stepCount`, `steps`,
  `currentStepValid`, `isStepValid`, `isNavigating`, plus the derived fields
  `isFirst`, `isLast`, `progress`, `canComplete`, `visitedSteps`,
  `completedSteps`, `currentStepError`.
- **`useMultiStepNavigation()`** - actions: `goToStep`, `next`, `previous`,
  `complete` (referentially stable).

All three throw `use<Name> must be used within a MultiStep component` if used
outside `MultiStep`.

### Derived state fields

Computed in `MultiStep.tsx` and surfaced on the state slice + full API:
`isFirst` (`activeStep === 0`), `isLast` (`activeStep === stepCount - 1`),
`progress` (`stepCount <= 1 ? 1 : activeStep / (stepCount - 1)`), `canComplete`
(`isLast && currentStepValid`), `visitedSteps` (memoized `number[]` of indices
with `status !== "pristine"`), `completedSteps` (memoized `number[]` of indices
with `status === "valid"`), and `currentStepError` (the active step's
`validity.message` when its status is `invalid`, else `undefined` - and `undefined`
even when invalid if no message was reported). `complete` lives on the navigation
slice, the rest on the state slice.

### A11y prop-getters: `useMultiStepA11y`

`useMultiStepA11y(): MultiStepA11y` (`src/MultiStepContext.tsx`) calls
`useMultiStep()` internally (so it throws the same
`useMultiStep must be used within a MultiStep component` outside a provider) and
returns memoized prop-getters: `getStepListProps`, `getStepProps(index, ...)`,
`getPanelProps`, `getPreviousButtonProps`, `getNextButtonProps`,
`getCompleteButtonProps`, `getErrorRegionProps`. Each takes an optional `overrides`
arg merged via the internal `mergeProps` helper: base `onClick` runs first then
the override's, `className` is concatenated with a single space, `style` is shallow
`{...base, ...override}`, every other override value wins, and when `overrides` is
omitted the base object is returned by reference. The getters implement the wizard
/ `aria-current` pattern, not `role="tab"`: the list is `role="list"` +
`aria-label="Progress"`, the active step carries `aria-current="step"`, the panel
is `role="region"` + `aria-labelledby` + `tabIndex={-1}`, the error region is
`role="status"` `aria-live="polite"` `aria-atomic={true}`. `getStepProps` emits a
`data-status` attribute (the step's `StepStatus`, typed via
`StepButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { "data-status"?: StepStatus }`)
and disables a step via a local `canNavigateTo(index)` that mirrors the forward
gate over `steps[].status`. `getCompleteButtonProps` sets no `aria-label`. The
return type `MultiStepA11y` is exported as a type from the package index.

`MultiStepProvider` takes both a `value: MultiStepApi` and a `report` channel.
`StepIndexProvider`, `StepIndexContext`, and `ReportValidityContext` exist
internally; only the public hooks and `MultiStep` are exported from the package
index.

### Step metadata

Each `Step` (`src/MultiStepContext.tsx`): `{ index, isActive, status, isValid,
title?, stepId, panelId }`. `status` is `StepStatus` (`"pristine" | "visited" |
"valid" | "invalid"`); it derives from the reported validity plus visited state
(`valid`/`invalid` mirror the report; `pending` -> `visited` if landed on else
`pristine`). `isValid` is derived (`status === "valid"`). `stepId` and `panelId`
are `${base}-step-${index}` / `${base}-panel-${index}` from a single `useId()`
base, so they are stable across renders and SSR-safe. Note: React 19 types
`element.props` as `unknown`; `readTitle()` narrows the optional `title` with an
`in` check and a typed cast (never `any`).

## Public API surface

Runtime exports (`src/index.ts`): `MultiStep` (default), `useMultiStep`,
`useMultiStepState`, `useMultiStepNavigation`, `useMultiStepA11y`,
`useReportValidity`, `useReducedMotion`.

Type exports: `MultiStepProps`, `StepComponentProps`, `StepValidity`,
`StepStatus`, `StepChangeEvent` (from `src/interfaces.ts`); `MultiStepApi`,
`Step`, `MultiStepA11y` (from `src/MultiStepContext.tsx`).

`MultiStepProps`: `children`, `activeStep?`, `defaultStep?` (0),
`mode?` (`"keepMounted"`), `onStepChange?`, `beforeStepChange?`,
`onValidationError?`, `onComplete?`, `focusOnStepChange?` (`"panel"`).

## CSS

Source CSS lives in `src/styles/` and is copied verbatim into `dist/`:

- `tokens.css` - global `:root { --multistep-* }` custom properties, in the `base`
  cascade layer.
- `chrome.css` - the reset (`reset` layer) and component styles (`components`
  layer), both **scoped under `.multistep-container`** so the reset never leaks to
  the host page. Consumers must put the `multistep-container` class on their outer
  chrome element for these to apply.
- `multistep.css` - combined back-compat bundle that `@import`s tokens + chrome
  with the canonical `reset, base, components` layer order.

`chrome.css` also carries a top-level `@media (prefers-reduced-motion: reduce)`
block, scoped under `.multistep-container *`, that neutralizes transitions and
animations. It is deliberately un-layered so it wins the cascade over the reset
layer's hover transition (do not move it into a `@layer`). For JS-driven motion,
the `useReducedMotion(): boolean` hook (`src/useReducedMotion.ts`, a
`useSyncExternalStore` over `matchMedia`, SSR/no-DOM safe) reports the preference
and needs no `MultiStep` ancestor.

`package.json` exports map: `./styles` -> `dist/multistep.css`,
`./styles/tokens.css` -> `dist/tokens.css`, `./styles/chrome.css` ->
`dist/chrome.css`. `sideEffects` is `["**/*.css"]`.

## Build / packaging facts

- `"type": "module"`; the package is ESM only. `exports["."]` resolves `import`
  to `./dist/index.js` with `types` at `./dist/index.d.ts`. CommonJS is not
  supported (no `require` condition, no CJS bundle).
- `peerDependencies.react` is `^19.2`. `engines.node` is `>=20`. `files` is
  `["dist"]`.
- `tsconfig.json`: target ES2020, module/resolution NodeNext, `jsx: react-jsx`,
  strict + `noUncheckedIndexedAccess`, declaration + declaration maps, `outDir`
  `./dist`. `tsconfig.test.json` extends it with `module: ESNext` /
  `moduleResolution: Bundler` and includes `test`.

## Tests: homegrown runner

There is no vitest or testing-library. `npm test` runs `test/run.mjs`, which:

1. Registers a jsdom DOM on `globalThis` before importing react-dom (order
   matters: react-dom reads `navigator`/`document` at import time), and sets
   `IS_REACT_ACT_ENVIRONMENT = true`.
2. Discovers `*.test.tsx?` files and bundles them + the harness with esbuild,
   keeping `react`/`react-dom` external so Node resolves the single installed copy
   (a shared React instance is required for context/hooks to work).
3. Imports the bundle (which registers the tests) and runs them.

Test files: `test/MultiStep.test.tsx`, `test/api.test.tsx`, and the type-level
`test/types.test-d.ts` (type-checked by `npm run typecheck`, skipped by the
runtime runner via its `.test-d.ts` suffix), with `test/harness.ts` as the
assertion/render harness.

## Conventions

- No injected props into steps; validity flows only through `useReportValidity`.
- Never use `any` or cast to `any`; narrow `unknown` (see `readTitle`).
- All public hooks throw a precise, tested error string when misused; preserve
  those exact strings.
- Inline styles are not used; styling is the optional, layered, scoped CSS above.
