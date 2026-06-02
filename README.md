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
major release that ships **ESM only**, supports **React 18 and 19**, and tightens
the public API. The step contract (`signalParent`) is unchanged from v6/v7.

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

Peer dependency: `react` `^18.2.0 || ^19.0.0`. The package is ESM only - import it
from an ESM context (modern bundlers, Node with `"type": "module"`). CommonJS
consumers must use a dynamic `import()`.

```jsx
import MultiStep from "react-multistep";
```

## Usage

Because the component is headless, you provide the surrounding chrome (step
indicators, prev/next buttons). Each step reports its own validity through the
injected `signalParent` callback; MultiStep uses that to enable forward
navigation.

```tsx
import { useState, useEffect } from "react";
import MultiStep from "react-multistep";
import {
  useMultiStepState,
  useMultiStepNavigation,
  type StepComponentProps,
} from "react-multistep";

function WizardChrome({ children }: { children: React.ReactNode }) {
  const { steps, activeStep, stepCount, currentStepValid } = useMultiStepState();
  const { goToStep, next, previous } = useMultiStepNavigation();

  return (
    <div>
      <ol role="tablist" aria-label="Wizard steps">
        {steps.map((step) => (
          <li key={step.index}>
            <button
              role="tab"
              aria-selected={step.index === activeStep}
              onClick={() => goToStep(step.index)}
            >
              {step.title ?? `Step ${step.index + 1}`}
            </button>
          </li>
        ))}
      </ol>
      <div role="tabpanel">{children}</div>
      <div>
        <button onClick={previous} disabled={activeStep === 0}>Prev</button>
        {activeStep < stepCount - 1 && (
          <button onClick={next} disabled={!currentStepValid}>Next</button>
        )}
      </div>
    </div>
  );
}

function NameStep({ signalParent }: StepComponentProps<{ title: string }>) {
  const [value, setValue] = useState("");

  // signalParent is injected by MultiStep; call it with optional chaining.
  useEffect(() => {
    signalParent?.({ isValid: value.trim().length > 0 });
  }, [value, signalParent]);

  return (
    <WizardChrome>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
    </WizardChrome>
  );
}

function App() {
  return (
    <MultiStep>
      <NameStep title="Name" />
      {/* ...more steps */}
    </MultiStep>
  );
}
```

## MultiStep props

| Prop                | Type                           | Default      | Description                                                          |
| ------------------- | ------------------------------ | ------------ | ------------------------------------------------------------------- |
| `children`          | `React.ReactNode`              | -            | Steps to render, one child per step.                                |
| `activeStep`        | `number`                       | uncontrolled | Controlled active step index (0-based). Pair with `onStepChange`.   |
| `defaultStep`       | `number`                       | `0`          | Starting step for uncontrolled mode.                                |
| `onStepChange`      | `(step: number) => void`       | `undefined`  | Fires whenever the active step changes (manual or programmatic).    |
| `onValidationError` | `(step: number) => void`       | `undefined`  | Called when the user tries to advance while the current step is invalid. |

## The step contract

Each step receives an injected `signalParent` callback and reports its validity:

```ts
signalParent?.({ isValid: boolean });
```

When `isValid` is `false`, forward navigation (Next, jumping ahead, programmatic
`next()`/`goToStep` past the current step) is blocked and `onValidationError` fires
with the current step index. Backward navigation is always allowed.

Extend `StepComponentProps` to type your own step props. `signalParent` is optional
in the type because MultiStep injects it - you do not pass it in JSX:

```ts
import type { StepComponentProps } from "react-multistep";

type AccountStepProps = StepComponentProps<{ plan: Plan }>;
```

## Hooks

Any descendant of `MultiStep` can read wizard state and drive navigation through
three hooks:

- **`useMultiStep(): MultiStepApi`** - the full API (state + navigation) in one
  object. Convenient for chrome that needs everything.
- **`useMultiStepState()`** - read-only state slice: `activeStep`, `stepCount`,
  `steps`, `currentStepValid`, `isStepValid`. Re-renders only when state changes.
- **`useMultiStepNavigation()`** - navigation actions: `goToStep`, `next`,
  `previous`.

`MultiStepApi` (the return type of `useMultiStep`):

```ts
interface MultiStepApi {
  activeStep: number;
  stepCount: number;
  steps: Step[]; // { index, isActive, isValid, title }
  currentStepValid: boolean;
  isStepValid: (index: number) => boolean;
  goToStep: (step: number) => void;
  next: () => void;
  previous: () => void;
}
```

All three hooks throw if used outside a `MultiStep` component.

## Styling with optional CSS

A modern, mobile-first stylesheet ships as an optional import (container queries,
automatic dark mode via `color-scheme`, fluid typography, 44px tap targets):

```jsx
import "react-multistep/styles";
```

Customize via CSS custom properties:

```css
:root {
  --multistep-primary: #1eaedb;
  --multistep-inactive: silver;
  --multistep-bg: #f1f1f141;
  --multistep-spacing-md: clamp(2rem, 3vw, 4rem);
  --multistep-button-size: clamp(2.5rem, 5vw, 4rem);
}
```

The component works without the CSS; the stylesheet is purely additive.

## Migrating from v7

v8 is a breaking release. The step contract (`signalParent`) is unchanged in
spirit, but the surrounding API was tightened:

- **Hooks renamed/removed.** `useStepNavigation` -> **`useMultiStepNavigation`**.
  `useStepList` and the raw `MultiStepContext` export are **removed** - use
  `useMultiStep()` / `useMultiStepState().steps`.
- **Types renamed.** `MultiStepContextValue` -> **`MultiStepApi`**;
  `MultiStepContextStep` -> **`Step`**.
- **Prop renamed.** `initialStep` -> **`defaultStep`** (React-convention parity
  with `defaultValue`).
- **`setStepValidity` removed** from the public surface. Validity flows only
  through `signalParent`.
- **`goto` removed.** `ChildState` is now `{ isValid }`. For redirect-on-invalid,
  use `onValidationError(step)` plus `goToStep`.
- **`signalParent` is optional in `StepComponentProps`.** Call it with optional
  chaining: `signalParent?.({ isValid })`.
- **ESM only.** The package no longer ships a CommonJS build; `exports` resolves
  `import` to `./dist/index.js` (ESM) with types at `./dist/index.d.ts`.
- **React 18 and 19** are both supported via the widened peer range.
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
