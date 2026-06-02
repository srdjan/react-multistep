# Changelog

## 8.0.0

Major release: ESM-only packaging, React 18 + 19 support, a tightened public API,
and removal of the orphaned server module. The `signalParent` step contract is
unchanged in spirit. All consumer-facing breaking changes are listed below with
migration notes.

### Packaging

- **ESM only.** The package no longer ships a CommonJS bundle. `exports` resolves
  `import` to `./dist/index.js` (ESM) with types at `./dist/index.d.ts`. CommonJS
  consumers must use a dynamic `import()`.
- **React 18 and 19.** `peerDependencies.react` widened from the exact `18.3.1`
  to `^18.2.0 || ^19.0.0`.
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
| `setStepValidity` | removed (use `signalParent`) |
| `ChildState.goto` + redirect | removed (use `onValidationError` + `goToStep`) |

- **`signalParent` is now optional** in `StepComponentProps` (it is injected, not
  passed in JSX). Call it with optional chaining: `signalParent?.({ isValid })`.

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
function Step({ signalParent }: StepComponentProps<{ title: string }>) {
  useEffect(() => signalParent?.({ isValid }), [isValid, signalParent]);
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
- `signalParent({ isValid: false, goto: N })` -> `signalParent?.({ isValid: false })`
  and redirect from the parent via `onValidationError`.

### Internal

- Test suite runs on a homegrown runner (no vitest / testing-library); `src` and
  `test` are type-checked in CI via `npm run typecheck`.
- The single example app (`examples/client-side`) is TypeScript and builds
  directly from `src`.
