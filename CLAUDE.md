# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **react-multistep**, a published npm package (v6.1.x) providing a responsive React component for multi-step forms with validation control. The package is built with TypeScript and uses esbuild for bundling.

## Common Development Commands

### Building the Library
```bash
npm install              # Install dependencies
npm run build            # TypeScript compilation (tsc) → ./build
npm run bundle           # esbuild bundling → ./dist
npm run prepublishOnly   # Full build pipeline (build + bundle)
```

The build pipeline:
1. `npm run build` - Compiles TypeScript (src → build) with type declarations
2. `npm run bundle` - Bundles with esbuild (build → dist) as CommonJS, excluding React peer dependency

### Working with the Example App
```bash
cd examples/client-side
npm install
npm run dev              # Builds library, bundles example, serves with esbuild
```

Example build workflow:
- `build:lib` - Runs the root `npm run build` to compile the library
- `build:app` - Bundles the example with esbuild (`dist/app.js`)
- `dev` - Builds the library once, then runs esbuild in watch + serve mode

## Architecture

### Core Component Structure

**Single Component Pattern**: The library exports a single `MultiStep` component that:
- Accepts child components as steps (each with optional `title` prop)
- Injects a `signalParent` callback into each child for validation control
- Manages top navigation (step indicators) and bottom navigation (prev/next buttons)
- Uses inline styles (customizable via `styles` prop)

**State Management**:
- `activeChild` - Current step index (0-based)
- `childIsValid` - Boolean controlled by child components via `signalParent`
- `topNavState` - Array of "doing"/"todo" states for step indicators
- `bottomNavState` - Prev/Next button disabled states + visibility

### Key Files

- `src/MultiStep.tsx` - Main component with all logic
- `src/interfaces.ts` - TypeScript type definitions (`MultiStepProps`, `MultiStepStyles`, `ChildState`)
- `src/baseStyles.js` - Default inline styles (plain JS object)
- `src/index.js` - Package entry point (exports MultiStep + interfaces + BaseStyles)

### Child Component Validation Pattern

**Critical Feature**: Child components receive `signalParent(childState: ChildState)` prop:
```typescript
interface ChildState {
  isValid: boolean;  // Controls Next button enabled/disabled
  goto: number;      // (Note: currently unused in implementation)
}
```

When `isValid: false`, the Next button is disabled and clicking other steps is blocked. This enables form validation per step.

## Build Output Structure

```
build/          # TypeScript compilation output (.js + .d.ts + .d.ts.map)
dist/           # esbuild bundle output (CommonJS for npm distribution)
dist/index.js   # Main entry point (specified in package.json)
```

**package.json exports**:
- `main`: `dist/index.js` (CommonJS bundle)
- `types`: `build/index.d.ts` (TypeScript declarations)

## Version Notes

This is **v6.0.0-alpha**, a major rewrite. Key differences from v5:
- Simplified API (removed `prevButton`/`nextButton` props, now handled internally)
- `signalParent` callback pattern for validation control
- `styles` prop for customization (previously had individual style props)
- Children now require `signalParent` to be called for proper Next button control

## TypeScript Configuration

**tsconfig.json settings**:
- Target: ES2015, CommonJS modules
- JSX: react-jsx (new transform)
- Output: `./build` with declarations and declaration maps
- Strict type checking enabled

## Development Workflow

1. Make changes in `src/`
2. Run `npm run build` to compile TypeScript
3. Run `npm run bundle` to create distribution bundle
4. Test in example app: `cd example && npm run build && npm start`
5. Before publishing: `npm run prepublishOnly` (runs automatically on `npm publish`)

## Important Implementation Details

- **React.cloneElement** pattern: Children are cloned to inject `signalParent` prop dynamically
- **Inline styles**: Component uses React.CSSProperties objects (no CSS files)
- **No external dependencies**: Pure React implementation (peer dependency only)
- **esbuild configuration**: Uses `--external:react` to exclude from bundle, `--loader:.js=jsx` for JSX, `--define:process.env.NODE_ENV` for production builds
