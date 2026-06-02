/**
 * Minimal, dependency-free test harness for react-multistep.
 *
 * Replaces vitest + @testing-library/* with a small runner we own. It provides
 * just the surface the existing tests use:
 *   - describe / it / expect (with .not) and a focused set of matchers
 *   - vi.fn() mock functions
 *   - a testing-library-style DOM shim (render / screen / within / fireEvent /
 *     userEvent) backed by react-dom + jsdom
 *
 * The runner is driven by test/run.mjs, which registers jsdom globals, bundles
 * this file plus the test files with esbuild, then calls runAll().
 */
import * as React from "react";
import { createRoot } from "react-dom/client";
import type { ReactElement } from "react";
import { isDeepStrictEqual } from "node:util";

// react 18.3 exposes act on the React namespace, but @types/react 18.2 predates
// the type. Reach it through a narrow cast rather than pulling in extra types.
type ActCallback = () => void | Promise<void>;
const act = (React as unknown as { act: (cb: ActCallback) => Promise<unknown> }).act;

const actSync = (cb: () => void): void => {
  // For a synchronous callback, act() flushes passive effects synchronously and
  // rethrows any render-phase error before returning, so we can ignore the
  // returned thenable. A throw here propagates to the caller (used by toThrow).
  void act(cb);
};

const actAsync = async (cb: () => Promise<void>): Promise<void> => {
  await act(cb);
};

// --- registry --------------------------------------------------------------

interface TestEntry {
  path: string[];
  fn: () => void | Promise<void>;
}

const tests: TestEntry[] = [];
const describeStack: string[] = [];

export const describe = (name: string, fn: () => void): void => {
  describeStack.push(name);
  try {
    fn();
  } finally {
    describeStack.pop();
  }
};

export const it = (name: string, fn: () => void | Promise<void>): void => {
  tests.push({ path: [...describeStack, name], fn });
};

// --- mocks (vi.fn) ---------------------------------------------------------

type AnyFn = (...args: unknown[]) => unknown;
interface Mock extends AnyFn {
  mock: { calls: unknown[][] };
}

const fn = (impl?: AnyFn): Mock => {
  const calls: unknown[][] = [];
  const mockFn = ((...args: unknown[]): unknown => {
    calls.push(args);
    return impl ? impl(...args) : undefined;
  }) as Mock;
  mockFn.mock = { calls };
  return mockFn;
};

export const vi = { fn };

// --- value helpers ---------------------------------------------------------

const norm = (s: string | null | undefined): string => (s ?? "").replace(/\s+/g, " ").trim();

const isElementLike = (v: unknown): v is Element =>
  typeof v === "object" && v !== null && "nodeType" in v && (v as Node).nodeType === 1;

const format = (v: unknown): string => {
  if (typeof v === "string") return JSON.stringify(v);
  if (v === null) return "null";
  if (v === undefined) return "undefined";
  if (isElementLike(v)) {
    const label = v.getAttribute("aria-label");
    return `<${v.tagName.toLowerCase()}${label ? ` aria-label="${label}"` : ""}>${norm(v.textContent)}</>`;
  }
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
};

// --- DOM shim: render + cleanup -------------------------------------------

interface ReactRoot {
  render(node: ReactElement): void;
  unmount(): void;
}

interface RenderResult {
  container: HTMLElement;
  rerender: (ui: ReactElement) => void;
}

const roots: Array<{ root: ReactRoot; container: HTMLElement }> = [];

export const render = (ui: ReactElement): RenderResult => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container) as unknown as ReactRoot;
  // Track before rendering so cleanup tears it down even if render throws.
  roots.push({ root, container });
  actSync(() => root.render(ui));
  return {
    container,
    rerender: (next: ReactElement) => actSync(() => root.render(next)),
  };
};

const cleanup = (): void => {
  while (roots.length > 0) {
    const entry = roots.pop();
    if (!entry) break;
    try {
      actSync(() => entry.root.unmount());
    } catch {
      // ignore teardown failures
    }
    entry.container.remove();
  }
};

// --- DOM shim: queries -----------------------------------------------------

interface RoleOptions {
  selected?: boolean;
  name?: string;
}

const accessibleName = (el: Element): string => {
  const label = el.getAttribute("aria-label");
  if (label !== null) return norm(label);
  return norm(el.textContent);
};

const allByRole = (root: ParentNode, role: string, opts?: RoleOptions): Element[] => {
  let els = Array.from(root.querySelectorAll(`[role="${role}"]`));
  if (opts?.selected !== undefined) {
    els = els.filter((el) => el.getAttribute("aria-selected") === String(opts.selected));
  }
  if (opts?.name !== undefined) {
    const wanted = norm(opts.name);
    els = els.filter((el) => accessibleName(el) === wanted);
  }
  return els;
};

const allByLabelText = (root: ParentNode, text: string): Element[] => {
  const wanted = norm(text);
  return Array.from(root.querySelectorAll("[aria-label]")).filter(
    (el) => norm(el.getAttribute("aria-label")) === wanted
  );
};

const allByText = (root: ParentNode, text: string): Element[] => {
  const wanted = norm(text);
  const matches = Array.from(root.querySelectorAll("*")).filter(
    (el) => norm(el.textContent) === wanted
  );
  // Keep only the innermost matches (drop ancestors that wrap another match).
  return matches.filter((el) => !matches.some((other) => other !== el && el.contains(other)));
};

const describeOpts = (opts?: RoleOptions): string => {
  if (!opts) return "";
  const parts: string[] = [];
  if (opts.name !== undefined) parts.push(`name: ${JSON.stringify(opts.name)}`);
  if (opts.selected !== undefined) parts.push(`selected: ${opts.selected}`);
  return parts.length > 0 ? ` { ${parts.join(", ")} }` : "";
};

const single = (els: Element[], describeQuery: string): Element => {
  if (els.length === 0) throw new Error(`Unable to find ${describeQuery}`);
  if (els.length > 1) throw new Error(`Found ${els.length} elements matching ${describeQuery}`);
  return els[0];
};

const optional = (els: Element[], describeQuery: string): Element | null => {
  if (els.length > 1) throw new Error(`Found ${els.length} elements matching ${describeQuery}`);
  return els[0] ?? null;
};

const makeQueries = (getRoot: () => ParentNode) => ({
  getByRole: (role: string, opts?: RoleOptions): Element =>
    single(allByRole(getRoot(), role, opts), `role "${role}"${describeOpts(opts)}`),
  getAllByRole: (role: string, opts?: RoleOptions): Element[] => {
    const els = allByRole(getRoot(), role, opts);
    if (els.length === 0) throw new Error(`Unable to find role "${role}"${describeOpts(opts)}`);
    return els;
  },
  getByLabelText: (text: string): Element =>
    single(allByLabelText(getRoot(), text), `label text "${text}"`),
  queryByLabelText: (text: string): Element | null =>
    optional(allByLabelText(getRoot(), text), `label text "${text}"`),
  getByText: (text: string): Element => single(allByText(getRoot(), text), `text "${text}"`),
  queryByText: (text: string): Element | null =>
    optional(allByText(getRoot(), text), `text "${text}"`),
});

export const screen = makeQueries(() => document.body);
export const within = (el: ParentNode) => makeQueries(() => el);

// --- DOM shim: events ------------------------------------------------------

const viewOf = (el: Element): Window => {
  const view = el.ownerDocument.defaultView;
  if (!view) throw new Error("element is not attached to a document with a window");
  return view;
};

export const fireEvent = {
  keyDown: (el: Element, init: { key: string }): void => {
    const view = viewOf(el);
    actSync(() => {
      el.dispatchEvent(
        new view.KeyboardEvent("keydown", { bubbles: true, cancelable: true, key: init.key })
      );
    });
  },
};

const click = async (el: Element): Promise<void> => {
  const view = viewOf(el);
  await actAsync(async () => {
    el.dispatchEvent(new view.MouseEvent("click", { bubbles: true, cancelable: true }));
  });
};

const userEvent = {
  setup: () => ({ click }),
};

export default userEvent;

// --- expect ----------------------------------------------------------------

const makeMatchers = (actual: unknown, negate: boolean) => {
  const check = (pass: boolean, message: string): void => {
    if (pass === negate) {
      throw new Error(`expected ${negate ? "NOT " : ""}${message}`);
    }
  };

  return {
    toBe: (expected: unknown): void =>
      check(Object.is(actual, expected), `${format(actual)} to be ${format(expected)}`),

    toEqual: (expected: unknown): void =>
      check(isDeepStrictEqual(actual, expected), `${format(actual)} to equal ${format(expected)}`),

    toHaveLength: (len: number): void => {
      const v = actual as { length?: number } | null;
      check(v?.length === len, `${format(actual)} to have length ${len} (got ${v?.length})`);
    },

    toContain: (expected: unknown): void => {
      let pass = false;
      if (typeof actual === "string") pass = actual.includes(String(expected));
      else if (Array.isArray(actual)) pass = actual.some((x) => isDeepStrictEqual(x, expected));
      check(pass, `${format(actual)} to contain ${format(expected)}`);
    },

    toThrow: (expected?: string): void => {
      if (typeof actual !== "function") throw new Error("toThrow expects a function");
      // React logs render-phase errors to console.error before rethrowing; mute
      // it so the expected-throw case does not pollute the run output.
      const origError = console.error;
      console.error = (): void => {};
      let didThrow = false;
      let thrown: unknown;
      try {
        (actual as AnyFn)();
      } catch (e) {
        didThrow = true;
        thrown = e;
      } finally {
        console.error = origError;
      }
      const msgOk =
        expected === undefined || (thrown instanceof Error && thrown.message.includes(expected));
      const detail = didThrow
        ? `(threw ${format(thrown instanceof Error ? thrown.message : thrown)})`
        : "(did not throw)";
      check(
        didThrow && msgOk,
        `function to throw${expected !== undefined ? ` ${JSON.stringify(expected)}` : ""} ${detail}`
      );
    },

    toHaveBeenCalledWith: (...args: unknown[]): void => {
      const m = actual as Mock | null;
      const calls = m?.mock?.calls ?? [];
      check(
        calls.some((call) => isDeepStrictEqual(call, args)),
        `mock to have been called with ${format(args)} (received ${format(calls)})`
      );
    },

    toBeInTheDocument: (): void => {
      const pass = isElementLike(actual) && document.body.contains(actual);
      check(pass, "element to be in the document");
    },

    toBeDisabled: (): void => {
      const el = actual as { disabled?: boolean; hasAttribute?: (n: string) => boolean } | null;
      const pass = el?.disabled === true || el?.hasAttribute?.("disabled") === true;
      check(pass, "element to be disabled");
    },

    toHaveTextContent: (text: string): void => {
      const el = actual as { textContent?: string | null } | null;
      check(
        norm(el?.textContent).includes(norm(text)),
        `${format(actual)} text to contain ${format(text)}`
      );
    },

    toHaveAttribute: (name: string, value?: string): void => {
      const el = actual as Element | null;
      const has = el?.hasAttribute?.(name) === true;
      const pass = value === undefined ? has : has && el?.getAttribute(name) === value;
      check(pass, `element to have attribute ${name}${value !== undefined ? `="${value}"` : ""}`);
    },
  };
};

export const expect = (actual: unknown) => {
  const matchers = makeMatchers(actual, false);
  return Object.assign(matchers, { not: makeMatchers(actual, true) });
};

// --- runner ----------------------------------------------------------------

export const runAll = async (): Promise<number> => {
  let passed = 0;
  const failures: Array<{ name: string; detail: string }> = [];

  for (const t of tests) {
    const name = t.path.join(" > ");
    try {
      await t.fn();
      passed += 1;
      console.log(`  ✓ ${name}`);
    } catch (error) {
      const detail = error instanceof Error ? (error.stack ?? error.message) : String(error);
      failures.push({ name, detail });
      console.log(`  ✗ ${name}`);
    } finally {
      cleanup();
    }
  }

  if (failures.length > 0) {
    console.log("");
    for (const f of failures) {
      console.log(`✗ ${f.name}`);
      console.log(`    ${f.detail.split("\n").join("\n    ")}`);
    }
  }

  console.log(`\n${passed} passed, ${failures.length} failed, ${tests.length} total`);
  return failures.length;
};
