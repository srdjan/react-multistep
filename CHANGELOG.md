# Changelog

## 8.0.0 (UNRELEASED)

The current state of the v8 line. On top of the packaging and API cleanup below,
v8 rebuilds the step contract and the runtime foundation. These are the breaking
foundation changes:

### Step contract: `useReportValidity` replaces `signalParent`

- **`signalParent` is removed entirely.** Steps no longer receive an injected
  callback. A step reports its validity by calling the new `useReportValidity()`
  hook from within its own subtree and invoking the returned callback, typically
  from an effect. The callback is stable (memoized on the report channel + step
  index). The `ChildState` and `SignalParent` types are gone.
- **Structured `StepValidity`.** The boolean `{ isValid }` is replaced by a
  discriminated union: `{ status: "valid" }`, `{ status: "invalid"; message?;
  errors? }`, or `{ status: "pending" }`. Every step starts at
  `{ status: "pending" }`, which is **not** valid, so the forward gate is blocked
  until a step reports `valid`.
- `useReportValidity` throws `useReportValidity must be used within a MultiStep step`
  if called outside a step subtree.
- **Forward gate.** `goToStep(target)` for `target > active` requires every step
  in `[active, target)` to be `valid`; otherwise `onValidationError(firstInvalidIndex)`
  fires and navigation is aborted. Backward navigation is always allowed;
  out-of-range targets are ignored.

### Render mode: `keepMounted` by default

- New **`mode?: "unmount" | "keepMounted"`** prop, defaulting to `"keepMounted"`.
  In `keepMounted`, every step stays mounted; inactive steps are wrapped in a
  hidden container (`hidden` + `display: none`) so they leave the visual and a11y
  tree but remain in the DOM. This preserves each step's in-step state across
  navigation and runs each step's validity effect from mount, making per-step
  validity honest before a step is ever visited. `"unmount"` renders only the
  active step (the pre-v8 behavior), discarding inactive state.

### Richer step metadata + aria id wiring

- Each `Step` now carries `status` (`StepStatus`: `"pristine" | "visited" |
  "valid" | "invalid"`), `tabId`, and `panelId` in addition to `index`,
  `isActive`, `isValid`, and `title`. `isValid` is now derived
  (`=== status === "valid"`). `tabId`/`panelId` come from a single `useId()` base,
  so they are stable per mount and SSR-safe; wire them into `role="tab"` /
  `role="tabpanel"` markup with `aria-current="step"` for the active step.

### CSS split + scoped reset

- The stylesheet is split: `react-multistep/styles/tokens.css` (the global
  `:root --multistep-*` custom properties) and `react-multistep/styles/chrome.css`
  (the scoped reset + component styles). `react-multistep/styles` remains the
  combined back-compat bundle.
- **The reset no longer leaks.** Reset and component rules are scoped under
  `.multistep-container`, so consumers must render their chrome inside an element
  with that class for the reset, focus ring, and component styles to apply.

### Peer dependency

- **`peerDependencies.react` is now `^19.2`.** The widened `^18.2.0 || ^19.0.0`
  range is superseded; v8 targets React 19.2+.

---

The sections below describe the earlier v8 packaging and API cleanup that the
foundation changes above build on.

Major release: ESM-only packaging, a tightened public API, and removal of the
orphaned server module. All consumer-facing changes are listed below with
migration notes.

### Packaging

- **ESM only.** The package no longer ships a CommonJS bundle. `exports` resolves
  `import` to `./dist/index.js` (ESM) with types at `./dist/index.d.ts`. CommonJS
  consumers must use a dynamic `import()`.
- **React 19.2+.** `peerDependencies.react` is `^19.2` (see the foundation
  section above for the final peer range).
- Single `dist/` output (the old `build/` + `dist/` two-tree layout is gone).
  `package.json` adds `"type": "module"`, `"sideEffects": ["**/*.css"]`,
  `"engines": { "node": ">=18" }`, and `"files": ["dist"]`.
- The optional stylesheet is unchanged: `import "react-multistep/styles"`.

### API

| v7 | v8 |
| --- | --- |
| `useStepNavigation()` | `useMultiStepNavigation()` |
| `useStepList()` | `useMultiStep().steps` / `useMultiStepState().steps` |
| `MultiStepContext` (raw export) | removed - use `useMultiStep()` |
| `MultiStepContextValue` (type) | `MultiStepApi` |
| `MultiStepContextStep` (type) | `Step` |
| `initialStep` prop | `defaultStep` prop |
| `setStepValidity` | removed (use `useReportValidity`) |
| `ChildState.goto` + redirect | removed (use `onValidationError` + `goToStep`) |

- The step validity channel is `useReportValidity()` (see the foundation section
  above), not an injected prop.

### Removed: server module

The `react-multistep/server` export was removed from the published package in v7;
in v8 the source is removed from this repository entirely and lives in a separate
package, [react-multistep-server](https://github.com/srdjan/react-multistep-server).

### Migration

Step components:

```tsx
// before (v7)
function Step({ signalParent }: StepComponentProps<{ title: string }>) {
  useEffect(() => signalParent({ isValid }), [isValid, signalParent]);
}

// after (v8)
import { useReportValidity } from "react-multistep";

function Step(_props: StepComponentProps<{ title: string }>) {
  const report = useReportValidity();
  useEffect(() => {
    report(isValid ? { status: "valid" } : { status: "invalid" });
  }, [report, isValid]);
}
```

Chrome / consumer components:

```tsx
// before
const { steps } = useMultiStepState();
const { next, previous, goToStep } = useStepNavigation();

// after
const { steps } = useMultiStepState();
const { next, previous, goToStep } = useMultiStepNavigation();
```

Props and drop-ins:

- `initialStep={n}` -> `defaultStep={n}`.
- `useStepList()` -> `useMultiStepState().steps`.
- `useContext(MultiStepContext)` -> `useMultiStep()`.
- `signalParent({ isValid: false, goto: N })` -> `report({ status: "invalid" })`
  from `useReportValidity()` and redirect from the parent via `onValidationError`.

### Internal

- Test suite runs on a homegrown runner (no vitest / testing-library); `src` and
  `test` are type-checked in CI via `npm run typecheck`.
- The single example app (`examples/client-side`) is TypeScript and builds
  directly from `src`.
