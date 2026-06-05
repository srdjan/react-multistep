# react-multistep roadmap

Status: **v8.0.0 is in active development and not yet released.** This roadmap
captures improvement opportunities for the v8 line before it ships, plus work to
defer to later minors.

> **Milestone 1 (the six "settle before ship" foundations + CI) is implemented and
> green**: React-19-only floor (`^19.2.0`), `useReportValidity` replacing the
> `cloneElement`/`signalParent` injection, the structured `StepValidity` union,
> `keepMounted` (default) + persisted per-step lifecycle, `useId`-derived
> `stepId`/`panelId` step metadata, the scoped headless CSS split (`tokens.css` /
> `chrome.css`), and a `.github/workflows/ci.yml` gate.
>
> **Milestone 2 (the additive accessibility + completion layer) is implemented and
> green** (typecheck / lint / 63 tests / build all pass): `useMultiStepA11y()`
> prop-getters (`getStepListProps` / `getStepProps` / `getPanelProps` /
> `getPreviousButtonProps` / `getNextButtonProps` / `getCompleteButtonProps` /
> `getErrorRegionProps`) wiring the wizard/`aria-current` pattern; `onComplete` +
> `complete()` + `canComplete` + `isFirst`/`isLast`/`progress`/`visitedSteps`/
> `completedSteps`/`currentStepError`; a live-region error announcer; and
> self-contained focus management (`focusOnStepChange`). The example chrome now runs
> entirely on the prop-getters.
>
> **Milestone 3 (internal hardening + the remaining additive polish) is largely
> implemented and green** (typecheck / lint / build all pass): the async
> `beforeStepChange` guard (`StepChangeEvent`, veto-on-`false`/throw, awaited,
> with an `isNavigating` flag on the API + state slice); `prefers-reduced-motion`
> in `chrome.css` plus a `useReducedMotion()` value export; collapsing the
> controlled-sync and `SYNC_STEPS` effects into render-time reconciliation (both
> `useEffect` calls removed, the StrictMode double-fire and concurrent-tear hazard
> gone); and type-level tests (`test/types.test-d.ts`). The `navRef` snapshot was
> **kept** by design - it is the standard latest-ref pattern, correct for its
> post-commit callers, and moving it onto `useEffectEvent` would add effect-ordering
> coupling for no correctness gain.
>
> **Remaining:** the deferred bucket below (compound `MultiStep.Step` API,
> conditional/branch flow, controlled validity + Standard Schema, React 19 form
> Actions, URL/history adapter, unstyled compound chrome, three-context collapse,
> homegrown-harness replacement).

Because v8 is unreleased, the cost of breaking changes is inverted: breaking and
foundational changes are nearly free to make now and become a full major bump once
v8 ships. The recommendations are therefore gated around _"settle before v8.0.0
ships"_ (breaking-shaped, do now) vs _"additive, can land in v8.0.0 or any later
minor."_

`Breaking` ratings are relative to the current v8 working API - they affect the
example app, tests, and draft docs only; nothing is published yet. `Effort` is
S/M/L. `Priority` is P0 (must-have for a credible v8) / P1 / P2.

## How this was produced

A multi-agent analysis pass examined the codebase across six dimensions
(architecture/API, React 19 modernization, validation model, navigation features,
accessibility/headless ergonomics, packaging/DX/testing/CSS), adversarially verified
each finding against the source, and synthesized the ranked list below. Every stated
limitation was confirmed against the code - e.g. `signalParent`/`cloneElement` only
reaches direct children; inactive steps are unmounted so `steps[].isValid` /
`isStepValid(i)` are stale-false for unvisited steps; the `tablist`/`tab`/`tabpanel`
ARIA is structurally impossible because only one panel mounts; no CI runs the quality
gate; `react-multistep/styles` ships a global reset.

## Overall assessment

The v7 -> v8 migration landed the headless pivot cleanly: the server module was
extracted, the package is ESM-only on React 18/19, and the reducer + split-context +
slice-hook architecture is genuinely well-built for a small library. But the current
v8 draft under-delivers on what "headless" implies: it ships zero accessibility
primitives, teaches a structurally-impossible tabs ARIA pattern, strands focus on
every transition, and exposes a per-step validity array that is stale-false for any
unvisited step. The internal smells (cloneElement injection forcing an optional
`signalParent`, the hand-rolled `navRef` snapshot, three contexts to dodge unmeasured
re-renders) are real but secondary to those user-facing correctness gaps. There is no
CI exercising the build/test/typecheck or the React 19 peer. v8 is structurally sound
but unfinished - the accessibility and validation contracts should be made honest
before it ships.

## Theme 1 - Accessibility & headless ergonomics (the actual product)

A headless wizard whose API cannot be made accessible has not delivered its core
value. These items are coupled: prop-getters carry the id wiring, focus ref, and live
region, and should ship as one accessibility layer.

| Recommendation | Breaking | Effort | Priority |
| --- | --- | --- | --- |
| **Ship accessible prop-getters** - `getStepListProps` / `getStepProps` / `getPanelProps` / `getNextButtonProps` / `getPreviousButtonProps` (Downshift / React-Aria / Radix style). Both current references (README + `WizardChrome.tsx`) hand-assemble ARIA and get it wrong identically (no id / `aria-controls` / `aria-labelledby` linkage, no roving tabindex, no keyboard handling). Additive; carries the `useId`, focus, and live-region wiring below. | minor | L | **P0** |
| **Replace the broken tabs pattern with the wizard / `aria-current` pattern**, wired with `useId`. Only `currentChild` mounts, so `tablist`/`tab`/`tabpanel` can never conform (no panel for `aria-controls` to point at; nav is gated + linear, the opposite of freely-reachable tabs). Reframe the canonical chrome around a progress nav with `aria-current="step"`, drop `role="tab"` / `aria-selected`, and have the library generate stable `useId`-derived `stepId` / `panelId` on `Step` metadata so consumers can link step -> panel correctly. | major | M | **P0** |
| **Manage focus on step change** - `focusOnStepChange?: 'panel' \| 'heading' \| false` (default `'panel'`) plus a returned `panelRef`. Today the focused element unmounts on every transition, dropping keyboard / screen-reader users to document start - a WCAG 2.4.3 Focus Order failure on every step. Rides on the `getPanelProps()` ref. | minor | M | **P0** |
| **Live-region error announcer** - `getErrorRegionProps() -> { role: 'status', 'aria-live': 'polite', 'aria-atomic': true }`. A blocked advance only disables Next and fires `onValidationError(index)` with no text, so screen-reader users get no signal about why navigation was refused. Pairs with the structured validation result in Theme 2 (one supplies the text, this the channel). | minor | M | **P0** |
| **Derived navigation helpers** on the state slice - `isFirst`, `isLast`, `progress`, `visitedSteps`, `completedSteps`. Every consumer recomputes `isLast` / first-step-disable today and has no way to build a progress bar or breadcrumb. Keep them on the state slice so nav-only consumers retain re-render isolation. | minor | S | **P1** |
| **Optional unstyled compound chrome** (`react-multistep/wizard`: `Wizard.StepList` / `Step` / `Panel` / `Previous` / `Next` / `ErrorRegion`) built on the prop-getters - an accessible-by-default path while hook-only purists pay nothing. Capstone; depends on getters / focus / live-region landing first. | none | L | **P2** |
| **Honor `prefers-reduced-motion`** in CSS and surface a `prefersReducedMotion` flag. `base.css` has a hover transition and zero reduced-motion handling, and the API exposes no motion signal. Cheap, fully additive insurance before any step-transition animation lands. | none | S | **P2** |

## Theme 2 - Validation model: from a binary boolean to a real engine

The library's entire job is validation control, yet validity is a single synchronous
boolean: no message, no async / pending state, no completion event, and a per-step
array that lies about unvisited steps. The structured result, `keepMounted` lifecycle,
and `onComplete` reinforce each other and should land together.

| Recommendation | Breaking | Effort | Priority |
| --- | --- | --- | --- |
| **`onComplete` / `onFinish` + `complete()` + `isLast` / `canComplete`.** `next()` on the last step silently no-ops; last-step detection lives only in example chrome. For a multi-step _form_ library this is the single most important missing callback - mostly additive and independently shippable. Do first. | minor | S | **P0** |
| **Structured validation result** replacing binary `isValid`: `type StepValidity = { status: 'valid' } \| { status: 'invalid'; errors?; message? } \| { status: 'pending' }`, threaded through the reducer. Enables async / pending ("checking..."), field-level errors, and feeds the live-region announcer - without bundling a schema library. Keep a thin boolean `isValid` getter for compatibility. | major | L | **P0** |
| **Make per-step validity real** - a `mode: 'unmount' \| 'keepMounted'` prop that renders all steps and hides inactive ones (`hidden` attribute), plus a persisted `pristine \| visited \| valid \| invalid` lifecycle in the reducer so the forward gate iterates `from+1..to` (restoring v6 multi-step-jump safety). Today inactive steps never run their validity effect, so `steps[i].isValid` and `isStepValid(i)` are stale-false for every unvisited step and in-step `useState` is lost on back / forward. Bold default: `keepMounted`. | major | M | **P0** |
| **Async `beforeStepChange` / `canLeave` guard** - `(e: { from; to; direction }) => boolean \| void \| Promise<...>` that navigation awaits, aborting on `false`; plus an `isNavigating` flag. The transition seam for save-draft, server-side validation, and unsaved-changes confirmation that consumers currently fake by racing their own effect against dispatch. | minor | M | **P1** |
| **Controlled validity + Standard Schema** - `stepValidity?: StepValidity[]` mirroring the controlled-`activeStep` path, plus optional per-step `schema` via the library-agnostic `~standard` interface (no bundled validator). Lower-priority half of this theme; overlaps the controlled path. | minor | L | **P2** |

## Theme 3 - Validity reporting channel: kill cloneElement injection

The single most-cited structural smell. Injecting `signalParent` by cloning each
_direct_ child breaks through any wrapper, forces optional chaining everywhere, and is
invisible from a function signature.

| Recommendation | Breaking | Effort | Priority |
| --- | --- | --- | --- |
| **Replace cloneElement injection with a context `useReportValidity` hook.** `React.cloneElement` injects `signalParent` onto the immediate element only, so wrapping a step in an `ErrorBoundary` / `memo` / layout silently breaks validity - which is exactly why `signalParent` is typed optional and every real step writes `signalParent?.({ isValid })`. A hook that reads the step's index from a per-step context and dispatches `SET_STEP_VALID` composes through any wrapper depth, makes the reporter a non-optional hook return, and deletes `childrenWithProps` / `cloneElement`. The reducer machinery already exists; the net-new work is the per-step index context. Merge with the structured payload: `useReportValidity(result: StepValidity)`. | major | M | **P0** |
| **Compound API with typed `Step` metadata** (`MultiStep.Step` / `.StepList` / `.Panel`) - replaces untyped `child.props?.title` reflection, gives steps a stable string `id` (reorder-safe controlled nav, a real skippable model), and lets the component statically reject non-`Step` children. Enables id-based nav and conditional flow; pairs with the index-providing wrapper the validity hook needs anyway. | major | L | **P1** |
| **Restore conditional / non-linear flow (skip + branch)** - per-step `isEnabled?: (ctx) => boolean`, stable-id `goToStep(id \| index)`, and an optional `resolveNext?: (from, state) => id \| index`. A v6 differentiator dropped with the server module. The boldest reclamation; downstream of the compound API's stable ids and the persisted lifecycle. | major | L | **P2** |

## Theme 4 - React 19 modernization & internal hardening

Mostly non-breaking internal refactors that remove footguns and concurrency hazards;
the React 19 floor is the one breaking change that gates the rest.

| Recommendation | Breaking | Effort | Priority |
| --- | --- | --- | --- |
| **Drop React 18: React-19-only package, peer `^19.2.0`.** The peer claims `^18.2 \|\| ^19` but devDeps / types pin React 18, so React 19 is asserted but never typechecked or tested. Straddling two majors blocks every React 19 primitive at once (`useEffectEvent`, ref-as-prop, `use()`, Actions). `^19.2.0` specifically because `useEffectEvent` only stabilized as a non-experimental export in React 19.2. Since v8 is unreleased, this is the cheapest moment to set the floor; v7 stays the React-18 line. | major | S | **P0** |
| **Retire the `navRef` manual snapshot** via reducer dispatch + `useEffectEvent`. The snapshot is a render-phase side effect (`navRef.current = nav` every render) that is not concurrent-safe (a torn render under `useTransition` can leave it pointing at uncommitted state) and is guarded only by a comment invariant. Move the gating into the reducer (`goToStep = useCallback(s => dispatch({ type: 'GO_TO', step: s }), [])`) and route the genuinely external bits (`onStepChange` / `onValidationError`, controlled `activeStep`) through `useEffectEvent`. | none | M | **P1** |
| **Collapse the controlled-sync + `SYNC_STEPS` effects into render-time derivation.** Both are derive-in-effect anti-patterns over values already known at render; they double-fire under StrictMode and re-run on every concurrent commit. Replace with the React-recommended previous-value-during-render latch, removing the only two `useEffect` calls and a concurrent-tear hazard. Preserve the drop-the-prop fallback carefully. | none | M | **P1** |
| **Collapse the three-context split into one context + a selector hook** (`useSyncExternalStore`). Three contexts / hooks / not-within-provider guards exist to let nav-only consumers skip re-renders - but state here changes at user pace (clicking Next), so the savings are speculative and, per the project's own measure-don't-assume rule, unmeasured. The split is also what forces the `navRef` snapshot. **Benchmark the split vs a single context first**; this rec is gated on confirming it fails to earn its complexity. | minor | M | **P2** |
| **React 19 form Actions** - optional `<MultiStep.Step action={...}>` that advances on a successful action result and surfaces `useFormStatus` pending. Gives pending UI, error payloads, and progressive enhancement for free. Opinionated; must reconcile with per-step unmount. An optional layer on the structured-result + `keepMounted` work. | major | L | **P2** |
| **Optional URL / history adapter** - `useMultiStepHistory({ param, mode })` reading the index from a URL param, calling `goToStep` on `popstate`, pushing / replacing on change; the core stays router-agnostic. The controlled-mode hatch already makes this possible but non-trivial. | none | M | **P2** |

## Theme 5 - Packaging, CI, testing & CSS hygiene

CI is the foundation that protects every other change; the shipped "headless"
stylesheet currently mutates the consumer's whole page.

| Recommendation | Breaking | Effort | Priority |
| --- | --- | --- | --- |
| **Real CI pipeline** (build / lint / typecheck / test on push + PR) with a React 18 / 19 matrix and `npm pack --dry-run`. Today the only workflows are CodeQL (deprecated `@v2` / `@v3` action pins) and Codeball (a discontinued product); the full quality gate runs only in `prepack` on the author's machine at publish time, so a PR that breaks the build, the declarations, or a test goes green, and React 19 compatibility is never exercised. Refresh the CodeQL pins, delete Codeball. Foundation - do first. | none | S | **P0** |
| **Make the shipped CSS truly headless** - split `styles/tokens.css` (the documented `--multistep-*` contract, scoped under `.multistep`) from `styles/chrome.css` (reset + component classes), scope the global `@layer reset` (`*`, `button`, `:focus-visible`, `:root` `color-scheme`) under `.multistep-container`, promote the ~15-token surface (only 5 documented) to a semver-governed table, and pick ONE example styling story (today the example imports `base.css` in one file and a separate JS style object in another). The reset currently collides with Tailwind preflight / normalize - the opposite of headless on a package that markets headless as its core value. | major | M | **P1** |
| **Type-level tests** (`test/types.test-d.ts`, `expectTypeOf` / `tsd`) run against the emitted `dist/index.d.ts` in CI - assert `useMultiStepState` excludes nav, a `StepComponentProps<{ email }>` step requires `email` but rejects `signalParent` in JSX, and `@ts-expect-error` on `goToStep('1')`. `typecheck` only proves the source compiles, not that the emitted `.d.ts` encodes the slice contracts. | none | S | **P1** |
| **Harden the exports map** - ship `declarationMap: true` + `--sourcemap=linked` (both currently off, no `.map` files, no go-to-definition into the `.tsx` or debugging into the bundle - nearly free to add); decide the CJS-`require` story explicitly (optional throwing shim). | minor | S | **P2** |
| **Deliberate test-harness decision + broaden examples + fix doc drift.** `test/harness.ts` + `run.mjs` (~500 lines) reimplement a subset of vitest + Testing Library with partial matchers (`toThrow` substring-only, no `toHaveBeenCalledTimes` / `waitFor` / `findBy`, click-only `userEvent`) and no coverage - adopt vitest + @testing-library + jsdom, or keep it and record the decision in an ADR plus add the async matchers the validation work needs. Separately, there is exactly one example (no controlled-mode, async-validation, RHF + Zod, or Next.js App Router) and `CLAUDE.md` is stale (says v6.1.x while `package.json` is 8.0.0). | none | M | **P2** |

## Release gating

### Settle before v8.0.0 ships (breaking-shaped - nearly free now, a major bump later)

- Drop React 18 -> React-19-only (peer `^19.2.0`)
- Replace cloneElement injection with `useReportValidity`
- Structured `StepValidity` result (status + errors + pending)
- `keepMounted` render mode + persisted step lifecycle
- Wizard / `aria-current` semantics + `useId`-derived step ids (replaces the tabs pattern)
- Headless CSS split + scoped reset + token contract

### Additive - can land in v8.0.0 or any later minor (no major bump needed)

- CI pipeline (do early regardless - it guards everything above)
- `onComplete` / `complete()` / `isLast` / `canComplete`
- Accessible prop-getters, focus management, live-region announcer
- Derived nav helpers; type-level tests; sourcemaps / declaration maps
- `beforeStepChange` guard; reduced-motion; navRef / effects internal hardening

### Defer past v8.0.0 (additive, build on the above)

Compound `MultiStep.Step` API; conditional / branch flow; controlled validity +
Standard Schema; React 19 form Actions; URL / history adapter; unstyled compound
chrome; three-context collapse; homegrown-harness replacement.
