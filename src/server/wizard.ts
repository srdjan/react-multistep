/**
 * Pure domain logic for wizard navigation and validation.
 * NO I/O, NO side effects - all functions are pure transformations.
 */

import type {
  WizardConfig,
  WizardSession,
  WizardActions,
  WizardError,
  ValidationResult,
  Result,
  SessionId,
} from "./types";
import { ok, err, createSession } from "./types";

// ============================================================================
// PURE FUNCTIONS (No I/O, No Side Effects)
// ============================================================================

/**
 * Calculate available actions based on current session state (HATEOAS).
 * Pure function: session + config → actions
 */
export const getAvailableActions = (
  config: WizardConfig,
  session: WizardSession,
): WizardActions => {
  const currentStepValid = session.stepValidity[session.currentStep] ?? false;
  const isFirstStep = session.currentStep === 0;
  const isLastStep = session.currentStep === config.steps.length - 1;
  const allStepsValid = session.stepValidity.every(Boolean);

  return {
    canGoNext: currentStepValid && !isLastStep,
    canGoPrevious: !isFirstStep,
    canGoToStep: (index: number) => {
      if (index < 0 || index >= config.steps.length) return false;
      if (index === session.currentStep) return false;
      if (index < session.currentStep) return true;
      return index === session.currentStep + 1 && currentStepValid;
    },
    canSubmit: isLastStep && allStepsValid,
  };
};

/**
 * Validate step data (delegates to step's validator).
 * Pure function: config + stepIndex + data → Result<ValidationResult, Error>
 */
export const validateStepData = (
  config: WizardConfig,
  stepIndex: number,
  data: unknown,
): Result<ValidationResult, WizardError> => {
  const step = config.steps[stepIndex];
  if (!step) {
    return err({
      type: "INVALID_STEP_INDEX",
      index: stepIndex,
      max: config.steps.length - 1,
    });
  }

  try {
    const result = step.validate(data);
    return ok(result);
  } catch (e) {
    return err({
      type: "VALIDATION_FAILED",
      errors: { _error: String(e) },
    });
  }
};

/**
 * Update session with new step data.
 * Pure function: returns NEW session (no mutation).
 */
export const updateSessionData = (
  session: WizardSession,
  stepIndex: number,
  data: unknown,
  isValid: boolean,
  now: string,
): Result<WizardSession, WizardError> => {
  if (stepIndex < 0 || stepIndex >= session.stepData.length) {
    return err({
      type: "INVALID_STEP_INDEX",
      index: stepIndex,
      max: session.stepData.length - 1,
    });
  }

  const newStepData = [...session.stepData];
  newStepData[stepIndex] = data;

  const newValidity = [...session.stepValidity];
  newValidity[stepIndex] = isValid;

  return ok({
    ...session,
    stepData: newStepData,
    stepValidity: newValidity,
    updatedAt: now,
  });
};

/**
 * Navigate to a different step.
 * Pure function: returns NEW session.
 */
export const navigateToStep = (
  config: WizardConfig,
  session: WizardSession,
  targetIndex: number,
): Result<WizardSession, WizardError> => {
  const actions = getAvailableActions(config, session);

  if (!actions.canGoToStep(targetIndex)) {
    return err({
      type: "CANNOT_PROCEED",
      reason: `Cannot navigate to step ${targetIndex} from ${session.currentStep}`,
    });
  }

  return ok({
    ...session,
    currentStep: targetIndex,
  });
};

/**
 * Initialize a new wizard session.
 * Pure function: id + config + now → new session
 */
export const initializeSession = (
  id: SessionId,
  config: WizardConfig,
  now: string,
): WizardSession => {
  return createSession(id, config.steps.length, now);
};