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

<a href = "https://github.com/react-multistep/graphs/contributors">
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
context (modern bundlers, Node with `"type": "module"`). CommonJS consumers must
use a dynamic `import()`.

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
`MultiStep`. See [the wizard pattern](#the-wizard-pattern-tabs-and-panels) for a
fully wired, accessible chrome and the `mode="unmount"` composition.

## MultiStep props

| Prop                | Type                            | Default         | Description                                                          |
| ------------------- | ------------------------------- | --------------- | ------------------------------------------------------------------- |
| `children`          | `React.ReactNode`               | -               | Steps to render, one child per step. At least one is required.      |
| `activeStep`        | `number`                        | uncontrolled    | Controlled active step index (0-based). Pair with `onStepChange`.   |
| `defaultStep`       | `number`                        | `0`             | Starting step for uncontrolled mode.                                |
| `mode`              | `"unmount" \| "keepMounted"`    | `"keepMounted"` | How inactive steps are rendered. See [Render mode](#render-mode).   |
| `onStepChange`      | `(step: number) => void`        | `undefined`     | Fires whenever the active step changes (manual or programmatic).    |
| `onValidationError` | `(step: number) => void`        | `undefined`     | Called with the first invalid step index when a forward jump is gated. |

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
  `steps`, `currentStepValid`, `isStepValid`. Re-renders only when state changes.
- **`useMultiStepNavigation()`** - navigation actions: `goToStep`, `next`,
  `previous`. Referentially stable, so chrome that only navigates can skip
  re-rendering on state changes.

A fourth hook, **`useReportValidity()`**, is for step components rather than
chrome; see [The step contract](#the-step-contract).

`MultiStepApi` (the return type of `useMultiStep`):

```ts
interface MultiStepApi {
  activeStep: number;
  stepCount: number;
  steps: Step[];
  currentStepValid: boolean;
  isStepValid: (index: number) => boolean;
  goToStep: (step: number) => void;
  next: () => void;
  previous: () => void;
}
```

Each entry in `steps` is a `Step`:

```ts
interface Step {
  index: number;
  isActive: boolean;
  status: StepStatus; // "pristine" | "visited" | "valid" | "invalid"
  isValid: boolean; // derived: status === "valid"
  title?: React.ReactNode;
  tabId: string; // for role="tab" id wiring
  panelId: string; // for role="tabpanel" id wiring
}
```

`status` derives from the reported validity plus whether the step has been
visited: `valid`/`invalid` mirror the reported status; a `pending` step is
`visited` once landed on, otherwise `pristine`. `tabId` and `panelId` are derived
from a single `useId()` base, so they are stable across renders and SSR-safe -
read them, do not hardcode them.

The three chrome hooks throw if used outside a `MultiStep` component;
`useReportValidity` throws if used outside a step subtree.

## The wizard pattern (tabs and panels)

The `tabId` and `panelId` on each `Step` exist so you can wire a standard,
accessible tabs/panels relationship without minting your own ids. Each indicator
is a `role="tab"` with `id={step.tabId}` and `aria-controls={step.panelId}`; the
active panel carries `id` of the active step's `panelId`, `role="tabpanel"`, and
`aria-labelledby={activeTabId}`. Mark the current step with `aria-current="step"`
in addition to `aria-selected` so the active step is exposed to assistive tech
even outside a strict tablist reading.

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
      <ol role="tablist" aria-label="Wizard steps" className="multistep-top-nav">
        {steps.map((step) => (
          <li key={step.index} className="multistep-top-nav-step">
            <button
              role="tab"
              id={step.tabId}
              aria-controls={step.panelId}
              aria-selected={step.isActive}
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
        role="tabpanel"
        id={active?.panelId}
        aria-labelledby={active?.tabId}
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
`mode="unmount"` so only the active step's chrome and tab/panel ids are mounted:

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
  `tabId`, and `panelId`. `isValid` is now derived (`status === "valid"`), not a
  raw channel. Wire `tabId`/`panelId` into your `role="tab"` / `role="tabpanel"`
  markup instead of minting ids by hand.
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
  package in v7) now lives in a separate package,
  [react-multistep-server](https://github.com/srdjan/react-multistep-server).

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
