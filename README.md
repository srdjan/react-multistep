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
