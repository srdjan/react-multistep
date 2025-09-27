/**
 * Port interfaces for dependency injection.
 * Following the ports pattern: define behavioral contracts as interfaces.
 */

import type { SessionId, WizardSession, Result, WizardError } from "./types";

// ============================================================================
// SESSION STORE PORT
// ============================================================================

export interface SessionStore {
  readonly get: (id: SessionId) => Promise<Result<WizardSession | null, WizardError>>;
  readonly set: (id: SessionId, session: WizardSession) => Promise<Result<void, WizardError>>;
  readonly delete: (id: SessionId) => Promise<Result<void, WizardError>>;
}

// ============================================================================
// CLOCK PORT (for timestamps)
// ============================================================================

export interface Clock {
  readonly now: () => string;
}

export const systemClock = (): Clock => ({
  now: () => new Date().toISOString(),
});

// ============================================================================
// UUID GENERATOR PORT (for session IDs)
// ============================================================================

export interface UuidGen {
  readonly generate: () => SessionId;
}

export const cryptoUuidGen = (): UuidGen => ({
  generate: () => crypto.randomUUID() as SessionId,
});