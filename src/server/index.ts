/**
 * Public API for react-multistep/server module.
 * Only exports what consumers need - encapsulation at module boundary.
 */

export type {
  WizardConfig,
  WizardSession,
  StepDefinition,
  StepContext,
  ValidationResult,
  WizardActions,
  WizardError,
  Result,
  SessionId,
  StepId,
} from "./types";

export { SessionId as makeSessionId, StepId as makeStepId, validationOk, validationErr, ok, err } from "./types";

export type { SessionStore, Clock, UuidGen } from "./ports";
export { systemClock, cryptoUuidGen } from "./ports";

export { inMemorySessionStore } from "./adapters/session";

export { createWizardHandler } from "./http";

export { getAvailableActions, validateStepData } from "./wizard";
export { renderWizard } from "./renderer";