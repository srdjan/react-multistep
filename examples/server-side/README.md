# Server-Side Multi-Step Wizard Example

This example demonstrates the server-side module (`react-multistep/server`) with HTMX integration.

## Features

- ✅ **Light FP Architecture**: Pure functions, Result types, ports pattern
- ✅ **HATEOAS-driven**: Server controls navigation affordances
- ✅ **Progressive enhancement**: Works without JavaScript
- ✅ **Type-safe**: Full TypeScript support
- ✅ **Zero client-side logic**: All state managed server-side

## Architecture

```
Pure Core                    Adapters                  HTTP
──────────────────────       ────────────────────      ────────────────
wizard.ts (pure logic)   →   session.ts (storage)  →   http.ts (routes)
renderer.ts (pure HTML)  →   ports.ts (interfaces) →   middleware.ts
types.ts (ADTs)
```

## Running the Example

### Quick Start

From the project root:

```bash
npm run example:server
```

This will:
1. Build the TypeScript source (`npm run build`)
2. Compile the example (`esbuild`)
3. Start the server on `http://localhost:8000`

Then visit: **http://localhost:8000/wizard/test-session-123**

### Manual Setup

```bash
# Build the project
npm run build

# Compile the example
npx esbuild examples/server-side/example.ts --platform=node --format=cjs --outfile=examples/server-side/example.js

# Run the server
node examples/server-side/example.js
```

## API Routes

- `GET /wizard/:sessionId` - Initialize wizard
- `POST /wizard/:sessionId/submit` - Submit current step
- `POST /wizard/:sessionId/next` - Navigate to next step
- `POST /wizard/:sessionId/previous` - Navigate to previous step
- `POST /wizard/:sessionId/goto/:index` - Jump to specific step

### Customizing the HTML Shell

`createWizardHandler` accepts an optional fourth argument that lets you
restructure the rendered markup while reusing the core wizard building blocks.

```ts
import { createWizardHandler } from "react-multistep/server";

const handler = createWizardHandler(config, store, clock, {
  containerId: "wizard-shell",
  template: ({ containerId, indicators, stepContent, navigation }) => `
    <main id="${containerId}" class="wizard-layout">
      <aside class="wizard-sidebar">${indicators}</aside>
      <section class="wizard-panel">${stepContent}${navigation}</section>
    </main>
  `,
  renderNavigation: () => '<nav class="wizard-actions">…</nav>',
});
```

Available options:

- `containerId` – override the wrapper element ID (default `wizard-content`)
- `template(ctx)` – full control over layout using rendered fragments
- `renderNavigation` / `renderStepIndicators` – drop in custom components

All wizard routes continue to return HTML for successful requests and JSON for
errors. Error responses automatically pick sensible HTTP status codes (`422`
for validation failures, `404` for missing sessions/steps, `409` when
navigation is blocked, `500` for renderer/store failures), so front-ends can
react appropriately.

## Light FP Compliance

✅ **No classes** - Only types + functions
✅ **Result types** - All fallible operations return `Result<T, E>`
✅ **Ports pattern** - Dependencies injected as interfaces
✅ **Pure core** - Zero I/O in domain logic
✅ **Immutability** - All public types readonly
✅ **ADTs** - Discriminated unions for errors

## Learn More

See the main README for complete API documentation.
