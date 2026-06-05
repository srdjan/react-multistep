# v8.0.0 release plan

Execution plan to finish and ship `react-multistep@8.0.0`, then drain the polish
and deferred backlog. Strategy and rationale live in `ROADMAP.md`; this file is
the task-level checklist. Phases are ordered; within a phase, items are
independent unless a dependency is noted.

Current state: all six "settle before ship" breaking foundations and the entire
additive-for-8.0.0 bucket are implemented and green (typecheck / lint / 83 tests /
build all pass; `npm pack --dry-run` produces a clean 31.7 kB tarball). What
remains is doc correctness, the release mechanics, and optional polish.

---

## Phase 0 - Done

- [x] `/simplify` refactor: shared `firstBlockingStep` gate (`src/gate.ts`),
      single `canComplete` snapshot, dead `isNavigating` field removed, redundant
      bounds check dropped, focus-fallback unified, `direction` type reuse.
      (commit `9dbfaef`)
- [x] Dead `base.css` shim removed (commit `824501a`) and its two stale ROADMAP
      mentions scrubbed (commit `0d80560`).
- [x] CJS decision recorded: **CommonJS is not supported** - ESM only, no
      `require` condition, no CJS bundle. Wording updated in `README.md`,
      `CLAUDE.md`, `CHANGELOG.md`.
- [x] Server module confirmed live: `react-multistep-server` exists locally at
      `../react-multistep-server` and is pushed to GitHub
      (`origin/main`, in sync). It is a Deno-native project on Deno Deploy, not an
      npm package, so the README link resolves.

## Phase 1 - Pre-release doc correctness (blockers for a credible publish)

- [ ] **Fix the contributors badge link** - `README.md:20` points at
      `github.com/react-multistep/graphs/contributors` (missing the owner). Change
      to `github.com/srdjan/react-multistep/graphs/contributors`. One line.
- [ ] **Reword the server-module note** - `README.md:681-683` calls the extracted
      module a "separate package"; it is a Deno repository, not an npm package.
      Change "separate package" to "separate repository" (link unchanged - it is
      live). One line.
- [ ] **Verify or refresh the demo link** - `README.md:6` ->
      `http://srdjan.github.io/react-multistep/` (plain http, served from the
      `gh-pages` branch, which predates the v8 headless rewrite). Either rebuild
      `gh-pages` from `examples/client-side`, switch to https, or drop the link
      until refreshed. Manual check required.
- [ ] **Finalize the CHANGELOG** - `CHANGELOG.md:3` is `## 8.0.0 (UNRELEASED)`.
      Replace `(UNRELEASED)` with the release date; read the Migration section
      (lines ~199-240) once against the final API and confirm it names
      `useReportValidity`, `beforeStepChange`, `useReducedMotion`, and the
      `useMultiStepA11y` getters.
- Acceptance: every external link in `README.md` resolves; CHANGELOG carries a
  date and an accurate migration guide.

## Phase 2 - Optional polish (land in 8.0.0 or a later minor)

- [ ] **Broaden examples.** Today there is one example (`examples/client-side`),
      and it already covers controlled `activeStep`, `mode="unmount"`, the async
      `beforeStepChange` guard, and `onComplete`. Add, in priority order:
  - [ ] a **`keepMounted` (default mode)** example - the default is currently
        never demonstrated;
  - [ ] a **schema-validation** example (React Hook Form + Zod, or a Standard
        Schema step) exercising `useReportValidity` with real field errors;
  - [ ] an **SSR / Next.js App Router** example proving `useId`-derived ids and
        the no-`useEffect` reconciliation are SSR-safe.
  - Each is independent and additive; ship whichever are ready.
- [ ] **Test-harness ADR.** Decide: adopt vitest + @testing-library + jsdom, or
      keep `test/run.mjs` + `harness.ts` and add async matchers (`waitFor`,
      `findBy`, call-count). Record the decision in `docs/adr/` either way. See the
      deferred-backlog row in `ROADMAP.md`.
- Acceptance: a consumer can copy an example for their actual stack (default mode,
  schema lib, SSR); the harness choice is written down, not implicit.

## Phase 3 - Release mechanics

- [ ] **Run the full gate**: `npm run prepack` (lint + typecheck + test + build).
      Already green; re-run immediately before tagging.
- [ ] **Confirm tarball contents**: `npm pack --dry-run` - expect `dist/` only
      (bundle + sourcemap + per-file `.d.ts` including `gate.d.ts` + the three CSS
      files), `README.md`, `LICENSE.md`, `package.json`.
- [ ] **Tag and publish**: finalize `version` (already `8.0.0`), `git tag v8.0.0`,
      `npm publish` (public). Decide dist-tag: `latest` vs an initial `next`.
- [ ] **Push the branch**: there are currently **ten unpushed commits on
      `master`** (the eight v8 commits plus today's refactor + docs). `git push`
      carries the whole v8 line; push tags too.
- [ ] **Coordinate the server repo**: `react-multistep-server` is already on
      GitHub; if it should also be reachable as a package or have a tagged
      release, do that in its own repo so the README reference stays honest.
- [ ] **Refresh `gh-pages`** if the demo link is kept (ties to Phase 1).
- Acceptance: `npm view react-multistep@8.0.0` resolves; a fresh
      `npm install react-multistep` in an ESM React 19.2 app imports and renders;
      `master` and tags are on the remote.

## Phase 4 - Post-v8.0.0 backlog

Tracked in `ROADMAP.md` under "Post-v8.0.0 backlog (deferred, detailed)":
compound `MultiStep.Step` API; conditional / branch flow; controlled validity +
Standard Schema; React 19 form Actions; URL / history adapter; unstyled compound
chrome; three-context collapse (gated on a benchmark first); homegrown-harness
replacement. Each is an independent additive minor.

---

## Open decisions for the maintainer

1. Release date for the CHANGELOG, and `latest` vs `next` dist-tag for the first
   8.0.0 publish.
2. Keep, rebuild, or drop the `gh-pages` demo.
3. Which Phase 2 examples block the 8.0.0 announcement vs slip to 8.1.
