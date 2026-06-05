# Responsive React multistep form component

</br>
</br>

## Take it for a [**SPIN!**](http://srdjan.github.io/react-multistep/) :dizzy:

</br>

<kbd>
<img border=width="500px" height="300px" src="https://raw.githubusercontent.com/srdjan/react-multistep/master/assets/react-multistep.png"/>
</kbd>

</br>
</br>
</br>

#### List of contributors :raised_hands:

<a href = "https://github.com/srdjan/react-multistep/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=srdjan/react-multistep" alt="AWESOME CONTRIBUTORS" />
</a>

</br>
</br>
</br>

## Current Version: v8.0.0

`react-multistep` is a **headless** React component for multi-step forms: it owns
step state, validation gating, and navigation, while you render the UI. v8 is a
major release that ships **ESM only**, targets **React 19.2+**, and rebuilds the
step contract around the `useReportValidity` hook and a structured `StepValidity`
type. The injected `signalParent` prop is gone.

See [Migrating from v7](#migrating-from-v7) for the full list of breaking changes,
or `CHANGELOG.md`.

### Previous major versions

- **v6.x** - the headless rewrite (still installable; pin `6.1.0` if you need the
  old `react-multistep/server` export).
- **v5.x** - maintenance mode on branch `v5.x.x`.

## Install

```sh
npm install react-multistep
```

Peer dependency: `react` `^19.2`. The package is ESM only - import it from an ESM
context (modern bundlers, Node with `"type": "module"`). CommonJS is not
supported.

```jsx
import MultiStep from "react-multistep";
```

## Usage

Because the component is headless, you provide the surrounding chrome (step
indicators, prev/next buttons). A step reports its own validity by calling the
`useReportValidity` hook from inside its own subtree; MultiStep uses that to gate
forward navigation. No prop is injected into your steps.

```tsx
import { useState, useEffect } from "react";
import MultiStep, {
  useReportValidity,
  type StepComponentProps,
} from "react-multistep";

function NameStep(_props: StepComponentProps<{ title: string }>) {
  const report = useReportValidity();
  const [value, setValue] = useState("");

  // The callback from useReportValidity is stable; report from an effect
  // whenever the step's validity changes. Initial validity is { status: "pending" }.
  useEffect(() => {
    report(value.trim().length > 0 ? { status: "valid" } : { status: "invalid" });
  }, [report, value]);

  // WizardChrome is the accessible chrome defined under "Building the chrome" below.
  return (
    <WizardChrome>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
    </WizardChrome>
  );
}

function App() {
  return (
    <MultiStep mode="unmount">
      <NameStep title="Name" />
      {/* ...more steps */}
    </MultiStep>
  );
}
```

The chrome reads wizard state and drives navigation through the hooks below. It
must render inside a `MultiStep` child because the hooks read context created by
`MultiStep`. See [the wizard pattern](#the-wizard-pattern-step-list-and-panel) for
a fully wired, accessible chrome and the `mode="unmount"` composition.

## MultiStep props

| Prop                | Type                                | Default         | Description                                                          |
| ------------------- | ----------------------------------- | --------------- | ------------------------------------------------------------------- |
| `children`          | `React.ReactNode`                   | -               | Steps to render, one child per step. At least one is required.      |
| `activeStep`        | `number`                            | uncontrolled    | Controlled active step index (0-based). Pair with `onStepChange`.   |
| `defaultStep`       | `number`                            | `0`             | Starting step for uncontrolled mode.                                |
| `mode`              | `"unmount" \| "keepMounted"`        | `"keepMounted"` | How inactive steps are rendered. See [Render mode](#render-mode).   |
| `onStepChange`      | `(step: number) => void`            | `undefined`     | Fires whenever the active step changes (manual or programmatic).    |
| `beforeStepChange`  | `(event: StepChangeEvent) => boolean \| void \| Promise<boolean \| void>` | `undefined` | Guard awaited before a step change commits. Return `false` (or throw/reject) to veto. See [Guarding step changes](#guarding-step-changes-beforestepchange). |
| `onValidationError` | `(step: number) => void`            | `undefined`     | Called with the first invalid step index when a forward jump is gated. |
| `onComplete`        | `() => void`                        | `undefined`     | Fires when `complete()` succeeds on the last step. See [Completion](#completion). |
| `focusOnStepChange` | `"panel" \| "heading" \| false`     | `"panel"`       | Where focus moves on step change. See [Focus management](#focus-management). |

### Render mode

`mode` controls what happens to inactive steps.

- **`"keepMounted"` (default)** keeps every step mounted at all times. Inactive
  steps are wrapped in a hidden container (`hidden` + `display: none`) so they
  leave the visual and accessibility tree but stay in the DOM. Because they stay
  mounted, each step's local state survives navigating away and back, and each
  step's validity effect runs from mount. That makes per-step validity honest:
  the forward gate can know whether step 3 is valid before the user ever lands on
  it, instead of treating unvisited steps as a blank.
- **`"unmount"`** renders only the active step. Inactive subtrees are unmounted,
  so their state and any validity they reported are discarded when you leave them.
  Use this when steps are expensive, or when you specifically want each step to
  start fresh.

## The step contract

A step reports its validity by calling `useReportValidity()` from within its own
subtree. The hook returns a stable callback; call it with a `StepValidity`
whenever the step's validity changes, typically from an effect.

```tsx
import { useReportValidity } from "react-multistep";

function AccountStep() {
  const report = useReportValidity();
  useEffect(() => {
    report({ status: "valid" });
  }, [report /* , ...your validity deps */]);
  // ...
}
```

`StepValidity` is a discriminated union:

```ts
type StepValidity =
  | { status: "valid" }
  | { status: "invalid"; message?: string; errors?: Record<string, string> }
  | { status: "pending" };
```

Every step starts at `{ status: "pending" }`. **Pending is not valid**, so the
forward gate is blocked until a step reports `{ status: "valid" }`. Report
`{ status: "invalid" }` (optionally with a `message` or per-field `errors`) for a
failed step, and `{ status: "pending" }` while a decision is still in flight (for
example, async validation).

Forward navigation - Next, jumping ahead, programmatic `next()` / `goToStep(target)`
where `target > active` - requires every step between the current one and the
target (exclusive) to be `valid`. If any is not, MultiStep calls
`onValidationError(firstInvalidIndex)` and does not move. Backward navigation is
always allowed; out-of-range targets are ignored.

`useReportValidity` throws `useReportValidity must be used within a MultiStep step`
if called outside a step subtree.

Extend `StepComponentProps` to type your own step props. Steps no longer receive
any injected prop, so the helper just adds the optional `title`:

```ts
import type { StepComponentProps } from "react-multistep";

type AccountStepProps = StepComponentProps<{ plan: Plan }>;
```

## Hooks

Any descendant of `MultiStep` can read wizard state and drive navigation:

- **`useMultiStep(): MultiStepApi`** - the full API (state + navigation) in one
  object. Convenient for chrome that needs everything.
- **`useMultiStepState()`** - read-only state slice: `activeStep`, `stepCount`,
  `steps`, `currentStepValid`, `isStepValid`, `isNavigating`, plus the derived
  fields `isFirst`, `isLast`, `progress`, `canComplete`, `visitedSteps`,
  `completedSteps`, and `currentStepError`. Re-renders only when state changes.
- **`useMultiStepNavigation()`** - navigation actions: `goToStep`, `next`,
  `previous`, `complete`. Referentially stable, so chrome that only navigates can
  skip re-rendering on state changes.

Three more hooks round out the surface: **`useReportValidity()`** is for step
components rather than chrome (see [The step contract](#the-step-contract)),
**`useMultiStepA11y()`** returns prop-getters that wire the accessible chrome for
you (see [Accessible chrome with prop-getters](#accessible-chrome-with-prop-getters)),
and **`useReducedMotion()`** reports the user's motion preference (see
[Reduced motion](#reduced-motion)). `useReducedMotion` works anywhere, not only
inside a `MultiStep` subtree.

`MultiStepApi` (the return type of `useMultiStep`):

```ts
interface MultiStepApi {
  activeStep: number;
  stepCount: number;
  steps: Step[];
  currentStepValid: boolean;
  isStepValid: (index: number) => boolean;
  isFirst: boolean; // activeStep === 0
  isLast: boolean; // activeStep === stepCount - 1
  progress: number; // 0..1, 1 when there is one step or fewer
  canComplete: boolean; // isLast && currentStepValid
  visitedSteps: number[]; // indices with status !== "pristine"
  completedSteps: number[]; // indices with status === "valid"
  currentStepError?: string; // active step's invalid message, else undefined
  isNavigating: boolean; // true only while an async beforeStepChange is in flight
  goToStep: (step: number) => void;
  next: () => void;
  previous: () => void;
  complete: () => void;
}
```

The derived read-only fields (`isFirst`, `isLast`, `progress`, `canComplete`,
`visitedSteps`, `completedSteps`, `currentStepError`) live on the state slice
returned by `useMultiStepState()`; `complete` lives on the navigation slice
returned by `useMultiStepNavigation()`. `progress` is `activeStep / (stepCount - 1)`,
and `1` for a single-step (or zero-step) wizard. `currentStepError` is a string
only when the active step's status is `invalid` (its `validity.message`, which
may itself be `undefined`); every other status yields `undefined`. `visitedSteps`
and `completedSteps` are derived from `steps[].status`: visited is
`status !== "pristine"`, completed is `status === "valid"`. `isNavigating` is
`true` only while an asynchronous `beforeStepChange` guard is in flight (see
[Guarding step changes](#guarding-step-changes-beforestepchange)); a navigation
with no guard, or one whose guard is synchronous, commits without ever flipping
it. Read it to disable controls or show a spinner while a guard resolves.

Each entry in `steps` is a `Step`:

```ts
interface Step {
  index: number;
  isActive: boolean;
  status: StepStatus; // "pristine" | "visited" | "valid" | "invalid"
  isValid: boolean; // derived: status === "valid"
  title?: React.ReactNode;
  stepId: string; // stable id for the step indicator/button element
  panelId: string; // stable id for the step panel element
}
```

`status` derives from the reported validity plus whether the step has been
visited: `valid`/`invalid` mirror the reported status; a `pending` step is
`visited` once landed on, otherwise `pristine`. `stepId` and `panelId` are derived
from a single `useId()` base, so they are stable across renders and SSR-safe -
read them, do not hardcode them.

The three chrome hooks (and `useMultiStepA11y`) throw if used outside a
`MultiStep` component; `useReportValidity` throws if used outside a step subtree.

## The wizard pattern (step list and panel)

The `stepId` and `panelId` on each `Step` exist so you can wire an accessible
step-list / panel relationship without minting your own ids. This is a wizard,
not a WAI-ARIA tablist: each indicator is a `<button>` with `id={step.stepId}`,
`aria-controls={step.panelId}`, and `aria-current="step"` on the active step
(absent otherwise). The step list itself is a `role="list"`, and the panel is a
`role="region"` with `id={step.panelId}` and `aria-labelledby={activeStepId}`
pointing back at the active step's button. There is no `role="tab"`,
`role="tablist"`, or `aria-selected` - those belong to a true tablist with its own
keyboard contract.

This pattern is operated with Tab to reach a step button and Enter or Space to
activate it - no arrow keys, by design. A real WAI-ARIA tablist would instead
require you to add roving `tabindex` and arrow-key handling so the whole list is a
single Tab stop; the step-list pattern keeps each button independently
Tab-reachable and avoids that machinery.

```tsx
import MultiStep, {
  useMultiStepState,
  useMultiStepNavigation,
} from "react-multistep";

function WizardChrome({ children }: { children: React.ReactNode }) {
  const { steps, activeStep, stepCount, currentStepValid } = useMultiStepState();
  const { goToStep, next, previous } = useMultiStepNavigation();
  const active = steps[activeStep];

  return (
    <div className="multistep-container">
      <ol role="list" aria-label="Progress" className="multistep-top-nav">
        {steps.map((step) => (
          <li key={step.index} className="multistep-top-nav-step">
            <button
              id={step.stepId}
              aria-controls={step.panelId}
              aria-current={step.isActive ? "step" : undefined}
              className="multistep-step-button"
              onClick={() => goToStep(step.index)}
            >
              {step.title ?? `Step ${step.index + 1}`}
            </button>
          </li>
        ))}
      </ol>

      <div
        role="region"
        id={active?.panelId}
        aria-labelledby={active?.stepId}
        className="multistep-section"
      >
        {children}
      </div>

      <div className="multistep-nav-buttons">
        <button
          className="multistep-button multistep-button-prev"
          onClick={previous}
          disabled={activeStep === 0}
        >
          Prev
        </button>
        {activeStep < stepCount - 1 && (
          <button
            className="multistep-button multistep-button-next"
            onClick={next}
            disabled={!currentStepValid}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
```

Because the chrome hooks read context created by `MultiStep`, render
`WizardChrome` from inside each step (or from a component rendered by a step),
not as an ancestor of `MultiStep`. When the chrome owns the active panel, use
`mode="unmount"` so only the active step's chrome and step/panel ids are mounted:

```tsx
function AccountStep() {
  return <WizardChrome>{/* step fields */}</WizardChrome>;
}

function App() {
  return (
    <MultiStep mode="unmount">
      <AccountStep title="Account" />
      {/* ...more steps */}
    </MultiStep>
  );
}
```

The scoped reset and focus styles in the optional stylesheet only apply inside
an element with the `multistep-container` class, so keep that class on your
outer wrapper.

## Accessible chrome with prop-getters

The hand-rolled aria above is correct but verbose, and easy to get subtly wrong.
**`useMultiStepA11y()`** returns a set of prop-getters that build the accessible
chrome for you. Each getter returns a typed props object you spread onto an
element; the getters compose your own handlers and classes on top (your `onClick`
runs after the built-in one, `className` is concatenated, `style` is shallow
merged, every other override wins). The getters implement the wizard /
`aria-current` pattern, not `role="tab"`/`role="tablist"`: the step list is a
`role="list"` labelled `Progress`, the active step carries `aria-current="step"`,
and the panel is a `role="region"` labelled by its step button.

```tsx
import MultiStep, { useMultiStepA11y, useMultiStepState } from "react-multistep";

function WizardChrome({ children }: { children: React.ReactNode }) {
  const a11y = useMultiStepA11y();
  const { steps, activeStep } = useMultiStepState();

  return (
    <div className="multistep-container">
      <ol {...a11y.getStepListProps()} className="multistep-top-nav">
        {steps.map((step) => (
          <li key={step.index} className="multistep-top-nav-step">
            <button
              {...a11y.getStepProps(step.index)}
              className="multistep-step-button"
            >
              {step.title ?? `Step ${step.index + 1}`}
            </button>
          </li>
        ))}
      </ol>

      <div {...a11y.getPanelProps()} className="multistep-section">
        {children}
      </div>

      <p {...a11y.getErrorRegionProps()}>{steps[activeStep]?.status === "invalid" ? "Fix the highlighted fields" : ""}</p>

      <div className="multistep-nav-buttons">
        <button {...a11y.getPreviousButtonProps()}>Prev</button>
        <button {...a11y.getNextButtonProps()}>Next</button>
        <button {...a11y.getCompleteButtonProps()}>Done</button>
      </div>
    </div>
  );
}

function App() {
  return (
    <MultiStep mode="unmount">
      <AccountStep title="Account" />
      {/* ...more steps */}
    </MultiStep>
  );
}
```

Use `mode="unmount"` whenever getter-built chrome is rendered inside each step:
under the default `keepMounted` every mounted step renders its own chrome, so the
`useId`-derived ids are duplicated across the DOM and the non-active steps' chrome
points `aria-controls` at panels that are hidden, leaving those references
dangling. Unmounting inactive steps keeps exactly one set of ids live at a time.

The getters and what they set:

| Getter                       | Element        | What it wires                                                                                                                   |
| ---------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `getStepListProps(overrides?)`     | the step list  | `role="list"`, `aria-label="Progress"`.                                                                                   |
| `getStepProps(index, overrides?)`  | a step button  | `id={stepId}`, `type="button"`, `aria-current` (`"step"` on the active step, else absent), `aria-controls={panelId}`, `data-status` (the step's `StepStatus`), `disabled` when the forward gate blocks that step, and an `onClick` that calls `goToStep(index)`. |
| `getPanelProps(overrides?)`        | the active panel | `id={panelId}`, `role="region"`, `aria-labelledby={stepId}`, `tabIndex={-1}`.                                            |
| `getPreviousButtonProps(overrides?)` | the Prev button | `type="button"`, `aria-label="Previous step"`, `disabled` when on the first step, `onClick` calls `previous()`.        |
| `getNextButtonProps(overrides?)`   | the Next button | `type="button"`, `aria-label="Next step"`, `disabled` when the current step is not valid or already the last step, `onClick` calls `next()`. |
| `getCompleteButtonProps(overrides?)` | the Done button | `type="button"`, `disabled` unless `canComplete`, `onClick` calls `complete()`. No `aria-label` is set - supply your own label or text. |
| `getErrorRegionProps(overrides?)`  | a live region   | `role="status"`, `aria-live="polite"`, `aria-atomic={true}` - pair it with `currentStepError` for an announced message. |

`getStepProps` disables a step button using the same forward-gate semantics as
navigation: stepping back or to the active step is always allowed; jumping ahead
to index `i` requires every step in `[activeStep, i)` to be `valid`. The
`data-status` attribute carries the step's `StepStatus` so you can style
`pristine`/`visited`/`valid`/`invalid` states in CSS. `useMultiStepA11y` must be
called inside a `MultiStep` subtree; outside one it throws
`useMultiStep must be used within a MultiStep component`.

The step list is a `role="list"` of buttons, so it is operated with Tab to reach
a step and Enter/Space to activate it. There are no arrow keys by design - this
is the wizard/`aria-current` pattern, not a WAI-ARIA tablist (which would require
you to add roving tabindex and arrow-key handling yourself).

Note: `getCompleteButtonProps` is the one button getter that sets no `aria-label`
(a Done/Finish button normally carries visible text). If you render an icon-only
complete button, pass your own `aria-label` through the overrides, e.g.
`getCompleteButtonProps({ "aria-label": "Finish" })`.

## Completion

`complete()` (on the navigation slice and wired by `getCompleteButtonProps`)
finishes the wizard. It fires `onComplete()` only when the active step is the last
step and that step is `valid` (`canComplete` is `true`); otherwise it calls
`onValidationError(activeStep)` and does nothing else. Like `next` / `previous`
it is referentially stable.

```tsx
function App() {
  return (
    <MultiStep mode="unmount" onComplete={() => submitForm()}>
      <AccountStep title="Account" />
      {/* ...more steps */}
    </MultiStep>
  );
}
```

Read `canComplete` from `useMultiStepState()` to drive a submit button's enabled
state, or let `getCompleteButtonProps` set `disabled` for you.

## Guarding step changes (`beforeStepChange`)

`beforeStepChange` is an optional guard that runs after the forward validity gate
passes but before a step change commits. Use it for the transition seam:
save-draft, server-side validation, or an unsaved-changes confirmation.

```tsx
import type { StepChangeEvent } from "react-multistep";

<MultiStep
  beforeStepChange={async (event: StepChangeEvent) => {
    if (event.direction === "previous") return; // never block going back
    const saved = await saveDraft(event.from);
    if (!saved) return false; // veto: stay on the current step
  }}
>
  {/* steps */}
</MultiStep>;
```

The guard receives a `StepChangeEvent`:

```ts
interface StepChangeEvent {
  from: number; // the current active step
  to: number; // the requested step
  direction: "next" | "previous" | "jump"; // adjacent moves vs. anything else
}
```

`direction` is `"next"` when `to === from + 1`, `"previous"` when
`to === from - 1`, and `"jump"` otherwise.

Veto semantics: returning `false` (or a promise that resolves to `false`) aborts
the change - the active step does not move and `onStepChange` does not fire.
Returning anything else, including `undefined`, lets the change proceed. A guard
that throws, or returns a rejected promise, is caught and also aborts: the error
is swallowed, so surface your own UI from inside the guard.

Async behavior: the guard is awaited. While an asynchronous guard is in flight,
`isNavigating` is `true` (read it from `useMultiStepState()` or the full API).
Overlapping navigation calls are dropped while a guard is pending, so a second
click cannot start a competing transition. A synchronous navigation (no guard
supplied) commits immediately and never flips `isNavigating`. The public
navigation signatures are unchanged - `goToStep`, `next`, and `previous` stay
`(step: number) => void` / `() => void` and are fire-and-forget; the async work
happens internally.

`complete()` does **not** run `beforeStepChange` - completion is a terminal
action, not a step change. The gate ordering is: range check, then the forward
validity gate (`onValidationError` fires here and `beforeStepChange` is not
reached), then `beforeStepChange`, then commit.

## Focus management

When the active step changes, MultiStep moves focus so keyboard and screen-reader
users land on the new step instead of being stranded on the button they clicked.
`focusOnStepChange` controls the target:

- **`"panel"` (default)** focuses the active step's panel wrapper (a `tabIndex={-1}`
  container MultiStep renders around the active step). That wrapper is unlabeled -
  a bare `<div>` with no `role` and no `aria-labelledby` - so a screen reader may
  move focus there without announcing the new step. For an announced transition,
  prefer `"heading"` and give each step a heading (a visually-hidden one is fine).
- **`"heading"`** focuses the first heading (`h1`-`h6`) inside the active step,
  falling back to the panel wrapper if the step has no heading.
- **`false`** disables focus management entirely.

Focus is self-contained inside MultiStep: it owns the wrapper ref rather than
routing through `getPanelProps`, so `keepMounted`'s several mounted panels never
collide on one ref. Focus moves before paint (a layout effect) and is never
stolen on the initial mount - only on an actual step change. Note that in
`unmount` mode the default `"panel"` setting wraps the active step in an extra
`<div tabIndex={-1}>`; pass `focusOnStepChange={false}` if you need the active
step rendered without that wrapper.

## Styling with optional CSS

A modern, mobile-first stylesheet ships as an optional import (container queries,
automatic dark mode via `color-scheme` and `light-dark()`, fluid typography, 44px
tap targets). The CSS is split into two layers you can import together or apart:

- **`react-multistep/styles/tokens.css`** - the design tokens only. Declares the
  global `:root { --multistep-* }` custom properties (in the `base` cascade
  layer). Pull this in alone if you want the tokens but bring your own chrome
  styling.
- **`react-multistep/styles/chrome.css`** - the component styles plus a reset.
  Both the reset and the components live in cascade layers (`reset`, `components`)
  and are **scoped to `.multistep-container`**, so the reset never leaks onto the
  host page. Your chrome's outer element must carry the `multistep-container`
  class for the reset, focus ring, and component styles to apply.
- **`react-multistep/styles`** - the combined back-compat bundle (tokens + chrome,
  in the canonical `reset, base, components` layer order). Equivalent to importing
  both of the above.

```jsx
// everything (back-compat):
import "react-multistep/styles";

// or split, e.g. tokens globally + chrome only where the wizard renders:
import "react-multistep/styles/tokens.css";
import "react-multistep/styles/chrome.css";
```

Customize via CSS custom properties (defined globally in the `tokens` import):

```css
:root {
  --multistep-primary: #1eaedb;
  --multistep-inactive: silver;
  --multistep-bg: #f1f1f141;
  --multistep-spacing-md: clamp(2rem, 3vw, 4rem);
  --multistep-button-size: clamp(2.5rem, 5vw, 4rem);
}
```

The component works without any CSS; the stylesheets are purely additive.

## Reduced motion

The optional `chrome.css` honors `prefers-reduced-motion: reduce`. A top-level
`@media (prefers-reduced-motion: reduce)` block, scoped under
`.multistep-container *` (and its `::before` / `::after`), forces every
transition and animation duration to `0.01ms !important` and caps
`animation-iteration-count` at `1`. Because it is scoped to the container it
never touches the host page, and the `!important` overrides the hover transition
in the reset layer. The combined `react-multistep/styles` bundle `@import`s
`chrome.css`, so it inherits the block; importing `chrome.css` directly gets it
too.

For JS-driven motion (anything CSS cannot reach), read the preference reactively
with **`useReducedMotion()`**:

```tsx
import { useReducedMotion } from "react-multistep";

function StepTransition({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  return <div style={{ transition: reduced ? "none" : "opacity 200ms" }}>{children}</div>;
}
```

`useReducedMotion(): boolean` is a value export from the package root. It is
backed by `useSyncExternalStore` over
`window.matchMedia("(prefers-reduced-motion: reduce)")`, so it re-renders when
the preference changes at runtime. It is SSR / no-DOM safe: when `window` or
`matchMedia` is unavailable the subscribe is a no-op and both the client and
server snapshots return `false`. Unlike the chrome hooks it does not require a
`MultiStep` ancestor.

## Migrating from v7

v8 is a breaking release that rebuilds the step contract and the package
foundation:

- **`signalParent` is gone.** Steps no longer receive an injected callback. Call
  `const report = useReportValidity()` inside the step and invoke `report(validity)`
  from an effect. The `ChildState` and `SignalParent` types are removed; importing
  them will fail to resolve.
- **Validity is structured.** Replace the boolean `{ isValid }` with the
  `StepValidity` union: `report({ status: "valid" })`,
  `report({ status: "invalid", message?, errors? })`, or `report({ status: "pending" })`.
  Every step starts `pending`, so steps that previously relied on defaulting to
  valid must now report `valid` explicitly.
- **`mode` prop added.** Inactive steps are kept mounted by default
  (`mode="keepMounted"`). With the default, all step subtrees are in the DOM at
  once (inactive ones hidden), so each step's validity effect runs from mount.
  Pass `mode="unmount"` for the old "only the active step is rendered" behavior.
- **Richer step metadata.** Each `Step` now also carries `status` (`StepStatus`),
  `stepId`, and `panelId`. `isValid` is now derived (`status === "valid"`), not a
  raw channel. Wire `stepId` onto each step button and `panelId` onto the panel
  (with `aria-current` / `aria-controls` / `aria-labelledby`) instead of minting
  ids by hand.
- **Hooks renamed/removed.** `useStepNavigation` -> **`useMultiStepNavigation`**.
  `useStepList` and the raw `MultiStepContext` export are **removed** - use
  `useMultiStep()` / `useMultiStepState().steps`.
- **Types renamed.** `MultiStepContextValue` -> **`MultiStepApi`**;
  `MultiStepContextStep` -> **`Step`**.
- **Prop renamed.** `initialStep` -> **`defaultStep`** (React-convention parity
  with `defaultValue`).
- **`setStepValidity` removed** from the public surface. Validity flows only
  through `useReportValidity`.
- **`goto` removed.** For redirect-on-invalid, use `onValidationError(step)` plus
  `goToStep`.
- **CSS split + scoped reset.** The reset no longer leaks: it is scoped under
  `.multistep-container`, which your chrome's outer element must carry. New
  subpath imports `react-multistep/styles/tokens.css` and
  `react-multistep/styles/chrome.css` complement the combined `react-multistep/styles`.
- **ESM only, React 19.2+.** The package ships ESM only; `exports` resolves
  `import` to `./dist/index.js` with types at `./dist/index.d.ts`. The `react`
  peer is now `^19.2`.
- **Server module moved.** The `react-multistep/server` export (removed from the
  package in v7) now lives in a separate repository,
  [react-multistep-server](https://github.com/srdjan/react-multistep-server) (a
  Deno-native app).

## Local development

Clone, install, and build:

```sh
git clone https://github.com/srdjan/react-multistep.git
cd react-multistep
npm install
npm run build      # esbuild ESM bundle + tsc declarations + CSS -> ./dist
```

Other scripts:

```sh
npm test           # homegrown runner (test/run.mjs): jsdom + react-dom, no vitest
npm run typecheck  # tsc over src (NodeNext) and test (Bundler)
npm run lint       # eslint over src and test
```

Run the example app (a single canonical TypeScript client example that builds
straight from `src`):

```sh
cd examples/client-side
npm install
npm run dev        # esbuild dev server at http://localhost:8000
```

## License

MIT
