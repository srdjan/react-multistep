// Homegrown test runner entry point (replaces vitest).
//
// 1. Registers a jsdom DOM on globalThis (order matters: react-dom reads
//    `navigator` and `document` at import time).
// 2. Discovers test files and bundles them + the harness with esbuild,
//    keeping react/react-dom external so node resolves the single installed
//    copy (a shared React instance is required for context/hooks).
// 3. Imports the bundle (which registers every test) and runs them.
import { build } from "esbuild";
import { JSDOM } from "jsdom";
import { readdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const testDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(testDir, "..");

// --- 1. jsdom globals ------------------------------------------------------

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/",
  pretendToBeVisual: true,
});
const { window } = dom;

// Copy every DOM global jsdom exposes, but never clobber a global node already
// owns (process, console, timers, Event/EventTarget, ...). This adds document,
// window, HTMLElement, MouseEvent, KeyboardEvent, getComputedStyle, etc.
for (const key of Object.getOwnPropertyNames(window)) {
  if (key in globalThis) continue;
  const descriptor = Object.getOwnPropertyDescriptor(window, key);
  if (!descriptor) continue;
  try {
    Object.defineProperty(globalThis, key, descriptor);
  } catch {
    // some accessors are not redefinable; skip them
  }
}

// `navigator` is a read-only getter on modern node, so a plain assignment
// throws in ESM. Define it explicitly; react-dom's dev build reads
// navigator.userAgent at import time.
Object.defineProperty(globalThis, "navigator", {
  value: window.navigator,
  configurable: true,
  writable: true,
});

// Required by react's act() so it does not warn about an unconfigured env.
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// --- 2. discover + bundle --------------------------------------------------

const findTestFiles = (dir) => {
  const found = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      found.push(...findTestFiles(full));
    } else if (/\.test\.tsx?$/.test(entry.name)) {
      found.push(full);
    }
  }
  return found;
};

const testFiles = findTestFiles(testDir).sort();
if (testFiles.length === 0) {
  console.error("No test files found under", testDir);
  process.exit(1);
}

const importList = testFiles
  .map((file) => `import ${JSON.stringify("./" + relative(testDir, file).split("\\").join("/"))};`)
  .join("\n");
const entryContents = `${importList}\nexport { runAll } from './harness';\n`;

const outfile = join(repoRoot, ".test-cache", "bundle.mjs");

await build({
  stdin: {
    contents: entryContents,
    resolveDir: testDir,
    loader: "tsx",
    sourcefile: "test-entry.tsx",
  },
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node18",
  jsx: "automatic",
  outfile,
  external: ["react", "react-dom", "react-dom/client", "react/jsx-runtime"],
  define: { "process.env.NODE_ENV": '"test"' },
  // The package's sideEffects field lists only CSS, so esbuild treats the .tsx
  // test files as side-effect-free and would drop the bare `import "./x.test.tsx"`
  // entries as dead code. Their top-level describe()/it() calls ARE the side
  // effect that registers the tests, so ignore sideEffects annotations here.
  ignoreAnnotations: true,
  logLevel: "warning",
});

// --- 3. run ----------------------------------------------------------------

const { runAll } = await import(pathToFileURL(outfile).href);
const failures = await runAll();
process.exit(failures > 0 ? 1 : 0);
