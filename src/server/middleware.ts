/**
 * Effectful orchestration layer.
 * Coordinates I/O (session store) with pure domain logic.
 */

import type { SessionStore, Clock } from "./ports";
import type { WizardConfig, SessionId, Result, WizardError } from "./types";
import { err } from "./types";
import {
  validateStepData,
  updateSessionData,
  navigateToStep,
  initializeSession,
} from "./wizard";
import { renderWizard } from "./renderer";
import type { WizardRenderOptions } from "./renderer";

// ============================================================================
// EFFECTFUL ORCHESTRATION (I/O happens here)
// ============================================================================

type Ports = {
  readonly store: SessionStore;
  readonly clock: Clock;
};

/**
 * Handle form submission for current step.
 * Pattern: Load (I/O) → Validate (pure) → Update (pure) → Save (I/O) → Render (pure)
 */
export const handleStepSubmit = async (
  config: WizardConfig,
  ports: Ports,
  sessionId: SessionId,
  formData: unknown,
  renderOptions?: WizardRenderOptions,
): Promise<Result<string, WizardError>> => {
  const sessionResult = await ports.store.get(sessionId);
  if (!sessionResult.ok) return sessionResult;
  if (!sessionResult.value) {
    return err({ type: "SESSION_NOT_FOUND", sessionId });
  }
  const session = sessionResult.value;

  const existingData = session.stepData[session.currentStep];
  const mergedData =
    existingData && typeof existingData === "object" && typeof formData === "object"
      ? { ...existingData, ...formData }
      : formData;

  const validationResult = validateStepData(config, session.currentStep, mergedData);
  if (!validationResult.ok) return validationResult;

  const validation = validationResult.value;
  const isValid = validation.ok;

  const now = ports.clock.now();
  const updatedSessionResult = updateSessionData(
    session,
    session.currentStep,
    mergedData,
    isValid,
    now,
  );
  if (!updatedSessionResult.ok) return updatedSessionResult;
  const updatedSession = updatedSessionResult.value;

  const saveResult = await ports.store.set(sessionId, updatedSession);
  if (!saveResult.ok) return saveResult;

  const errors = !validation.ok ? validation.errors : null;
  return renderWizard(config, updatedSession, errors, renderOptions);
};

/**
 * Handle navigation (next/previous/goto).
 * Pattern: Load (I/O) → Navigate (pure) → Save (I/O) → Render (pure)
 */
export const handleNavigation = async (
  config: WizardConfig,
  ports: Ports,
  sessionId: SessionId,
  action: "next" | "previous" | { goto: number },
  renderOptions?: WizardRenderOptions,
): Promise<Result<string, WizardError>> => {
  const sessionResult = await ports.store.get(sessionId);
  if (!sessionResult.ok) return sessionResult;
  if (!sessionResult.value) {
    return err({ type: "SESSION_NOT_FOUND", sessionId });
  }
  const session = sessionResult.value;

  let targetIndex: number;
  if (action === "next") {
    targetIndex = session.currentStep + 1;
  } else if (action === "previous") {
    targetIndex = session.currentStep - 1;
  } else {
    targetIndex = action.goto;
  }

  const navResult = navigateToStep(config, session, targetIndex);
  if (!navResult.ok) return navResult;
  const newSession = navResult.value;

  const saveResult = await ports.store.set(sessionId, newSession);
  if (!saveResult.ok) return saveResult;

  return renderWizard(config, newSession, null, renderOptions);
};

/**
 * Initialize a new wizard session.
 * Pattern: Create (pure) → Save (I/O) → Render (pure)
 */
export const handleInitialize = async (
  config: WizardConfig,
  ports: Ports,
  sessionId: SessionId,
  renderOptions?: WizardRenderOptions,
): Promise<Result<string, WizardError>> => {
  const now = ports.clock.now();
  const session = initializeSession(sessionId, config, now);

  const saveResult = await ports.store.set(sessionId, session);
  if (!saveResult.ok) return saveResult;

  return renderWizard(config, session, null, renderOptions);
};
