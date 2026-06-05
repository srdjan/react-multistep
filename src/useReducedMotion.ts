import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

// SSR / no-DOM safe: when window or matchMedia is unavailable, subscribe is a
// no-op and both snapshots report false.
const getMatcher = (): MediaQueryList | null => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return null;
  return window.matchMedia(QUERY);
};

const subscribe = (onChange: () => void): (() => void) => {
  const matcher = getMatcher();
  if (!matcher) return () => {};
  matcher.addEventListener("change", onChange);
  return () => matcher.removeEventListener("change", onChange);
};

const getSnapshot = (): boolean => getMatcher()?.matches ?? false;

const getServerSnapshot = (): boolean => false;

/**
 * Reactively reports whether the user has requested reduced motion via the
 * prefers-reduced-motion media query. Returns false during SSR and in any
 * environment without window.matchMedia. Pairs with the CSS reduced-motion
 * block so consumers can also gate JS-driven animations.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
