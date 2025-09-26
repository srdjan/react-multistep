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

### Previous MultiStep major version, v5.4.0

```
Version 5.x.x is in a maintenance mode, the new development is ongoing on v6.x.x. Version (v5.x.x) bug fixes will still be available on NPM, if you would like to open a PR for a fix or make a fork, git checkout branch v5.x.x. The new version, v6.0.0 has a multiple improvements (see below) and is not backwards compatible.
```

## What's New in v6.0.0

Version 6.0.0 is a **complete rewrite** with modern React patterns and architecture. This is a **breaking change** from v5.x.x.

### 🎨 Headless Component Architecture

v6 is now **headless** - the `MultiStep` component manages state and logic, but **you control the UI**. This gives you complete flexibility over how steps, navigation, and progress indicators look and behave.

**Before (v5):** Built-in navigation UI with limited customization
```jsx
<MultiStep showNavigation activeStep={0} prevButton={...} nextButton={...}>
  {/* steps */}
</MultiStep>
```

**Now (v6):** Bring your own UI, powered by the `useMultiStep` hook
```jsx
<MultiStep>
  <StepOne title="Personal Info" />
  <StepTwo title="Address" />
</MultiStep>
```

### 🪝 useMultiStep Hook

The **`useMultiStep` hook** is the core of v6. Any component inside `<MultiStep>` can access wizard state and navigation:

```tsx
import { useMultiStep } from 'react-multistep';

function CustomNavigation() {
  const {
    activeStep,      // Current step index (0-based)
    stepCount,       // Total number of steps
    steps,           // Array of step metadata
    next,            // Go to next step
    previous,        // Go to previous step
    goToStep,        // Jump to specific step
    currentStepValid // Is current step valid?
  } = useMultiStep();

  return (
    <nav>
      <button onClick={previous} disabled={activeStep === 0}>
        Back
      </button>
      <span>Step {activeStep + 1} of {stepCount}</span>
      <button onClick={next} disabled={!currentStepValid}>
        Next
      </button>
    </nav>
  );
}
```

**Key capabilities:**
- Access wizard state from any nested component
- Build custom navigation (tabs, progress bars, breadcrumbs)
- Implement complex flows (skip steps, conditional navigation)
- Full TypeScript support

### 🔄 Context-Based State Management

v6 uses React Context internally, eliminating prop drilling:

- **Automatic state injection:** Every child receives `signalParent` callback
- **Decoupled architecture:** Navigation UI doesn't need to be at the top level
- **Flexible composition:** Mix and match custom chrome components

### ✅ Validation Pattern

Steps control their own validity via the `signalParent` callback:

```tsx
function AddressStep({ signalParent }) {
  const [zip, setZip] = useState('');

  useEffect(() => {
    // Signal validity whenever state changes
    signalParent({ isValid: zip.length === 5 });
  }, [zip, signalParent]);

  return <input value={zip} onChange={(e) => setZip(e.target.value)} />;
}
```

**Automatic enforcement:**
- Next button disabled when `isValid: false`
- Can't jump forward to invalid steps
- Optional `onValidationError` callback

### 🎨 Optional Modern CSS

v6 includes an **optional** modern CSS stylesheet with:
- Mobile-first responsive design (container queries)
- Automatic dark mode (`color-scheme: light dark`)
- Fluid typography with `clamp()`
- Touch-optimized tap targets (44px)
- CSS custom properties for easy theming

```jsx
import 'react-multistep/styles'; // Optional!
```

### 📦 Smaller & More Flexible

- **Core:** 10.3kb (logic only)
- **CSS:** 4.4kb (optional)
- **Total:** ~15kb vs ~45kb in v5

### 🔧 Migration from v5

**Removed:**
- `showNavigation` prop
- `prevButton` / `nextButton` props
- Built-in navigation UI
- Style props (`prevStyle`, `nextStyle`, etc.)

**Added:**
- `useMultiStep` hook
- `signalParent` callback for validation
- Context-based architecture
- Optional modern CSS import
- TypeScript-first design

**See the example app** for a complete working implementation.

#

### Instructions

To use this module in your app run:

```sh
npm install react-multistep
```

next, import it inside of your app:

```jsx
import MultiStep from "react-multistep";
```

and then, in your application, you add your custom components/forms this way:

```jsx
<MultiStep>
  <StepOne title="Step 1" />
  <StepTwo title="Step 2" />
</MultiStep>;
```

Because v6 is headless, you provide the surrounding chrome yourself. A minimal
layout might be:

```tsx
import { MultiStep, useMultiStep } from 'react-multistep';

function WizardChrome({ children }: { children: React.ReactNode }) {
  const { steps, activeStep, goToStep, next, previous, currentStepValid } = useMultiStep();

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
        {activeStep < steps.length - 1 && (
          <button onClick={next} disabled={!currentStepValid}>Next</button>
        )}
      </div>
    </div>
  );
}

function StepOne({ signalParent }: any) {
  const [value, setValue] = useState('');

  useEffect(() => {
    signalParent?.({ isValid: value.trim().length > 0 });
  }, [value, signalParent]);

  return (
    <WizardChrome>
      <input value={value} onChange={(event) => setValue(event.target.value)} />
    </WizardChrome>
  );
}
```

### MultiStep API

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `children` | `React.ReactNode` | – | Steps to render. Each child is cloned and receives a `signalParent` prop. |
| `activeStep` | `number` | uncontrolled | Controls the active step index. Leave undefined for internal state. |
| `initialStep` | `number` | `0` | Starting step when using internal state. |
| `onStepChange` | `(step: number) => void` | `undefined` | Fires whenever the active step changes (manual or programmatic). |
| `onValidationError` | `(activeStep: number) => void` | `undefined` | Called when the user tries to advance while the current step is invalid. |

Each child receives a `signalParent` callback used to report validation state:

```js
props.signalParent({ isValid: boolean, goto?: number });
```

If `isValid` is `false`, the Next button is disabled and step jumping forward is blocked. The optional `goto` field lets you hint which step should become active (for example, jump back to the first invalid step in a summary view).

### Reading wizard state with `useMultiStep`

Any descendant of `MultiStep` can call the hook to inspect navigation state or drive custom controls:

```tsx
import { useMultiStep } from "react-multistep";

function StepFour(props) {
  const { activeStep, stepCount, next, previous, steps, currentStepValid } = useMultiStep();

  return (
    <div>
      <p>{`Step ${activeStep + 1} of ${stepCount}`}</p>
      <button onClick={previous} disabled={activeStep === 0}>Prev</button>
      <button onClick={next} disabled={!currentStepValid}>Next</button>
      {/* ... */}
    </div>
  );
}
```

The hook returns the following shape:

- `activeStep`: current index (0-based)
- `stepCount`: total number of registered steps
- `steps`: array describing each step `{ index, isActive, isValid, title }`
- `goToStep(step)`: programmatically navigate to any step (respects validation rules)
- `next()` / `previous()`: shortcuts for relative navigation
- `setStepValidity(index, isValid)`: manually toggle a step’s validity (useful for async workflows)
- `isStepValid(index)`: read cached validity for any step
- `currentStepValid`: convenience boolean for the active step

### Validation workflow

When the child form component needs to control the Next button, call `signalParent` inside your component whenever validity changes:

```tsx
useEffect(() => {
  props.signalParent({ isValid: formIsValid });
}, [formIsValid, props.signalParent]);
```

The example app demonstrates a reusable chrome component that consumes the
hook and renders the navigation UI for each step.

### Styling with Modern CSS

Version 6.0.0 includes an optional modern CSS stylesheet with mobile-first, responsive design:

```jsx
// Import the optional stylesheet
import 'react-multistep/styles';
```

**Features:**
- **Mobile-first responsive design** with container queries
- **Automatic dark mode** support via `color-scheme: light dark`
- **Fluid typography** using `clamp()` for adaptive sizing
- **Touch-optimized** tap targets (44px minimum)
- **CSS custom properties** for easy theming
- **Modern CSS features**: `@layer`, `light-dark()`, logical properties
- **Backward compatible**: Works without the CSS, enhanced with it

**Customization:**

All styles use CSS custom properties with sensible defaults:

```css
:root {
  --multistep-primary: #1EAEDB;
  --multistep-inactive: silver;
  --multistep-bg: #f1f1f141;
  --multistep-spacing-md: clamp(2rem, 3vw, 4rem);
  --multistep-button-size: clamp(2.5rem, 5vw, 4rem);
  /* ...and more */
}
```

Override any variable in your own CSS to customize colors, spacing, or typography. The component adapts automatically to small screens (mobile) and large screens (desktop) without media queries using container queries.

## Instructions for local development

#### If you would like to explore further, contribute a PR or just try the included code example:

Start by cloning the repo locally:

```sh
git clone https://github.com/srdjan/react-multistep.git
```

then:

```sh
cd react-multistep            // (1) navigate to the project folder
npm install                   // (2) install dependencies
npm run build                 // (3) build the component
```

On a successful build, try the example app:

```sh
cd ../example                 // (1) navigate to the example folder
npm install                   // (2) install dependencies
npm run build                 // (3) build the example
npm start                     // (4) start the local server
```

Now, you can open the example in your favorite browser...
