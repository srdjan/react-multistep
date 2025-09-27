/**
 * SessionStore adapter implementations.
 * These contain I/O but wrap results in Result types.
 */

import type { SessionStore } from "../ports";
import type { SessionId, WizardSession, Result, WizardError } from "../types";
import { ok, err } from "../types";

// ============================================================================
// IN-MEMORY ADAPTER (for testing/development)
// ============================================================================

export const inMemorySessionStore = (): SessionStore => {
  const store = new Map<SessionId, WizardSession>();

  return {
    get: async (id) => {
      try {
        return ok(store.get(id) ?? null);
      } catch (e) {
        return err({ type: "SESSION_STORE_ERROR", reason: String(e) });
      }
    },
    set: async (id, session) => {
      try {
        store.set(id, session);
        return ok(undefined);
      } catch (e) {
        return err({ type: "SESSION_STORE_ERROR", reason: String(e) });
      }
    },
    delete: async (id) => {
      try {
        store.delete(id);
        return ok(undefined);
      } catch (e) {
        return err({ type: "SESSION_STORE_ERROR", reason: String(e) });
      }
    },
  };
};