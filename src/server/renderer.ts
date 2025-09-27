/**
 * Pure HTML rendering functions.
 * NO I/O - all functions transform data → HTML strings.
 */

import type { WizardConfig, WizardSession, StepContext, Result, WizardError } from "./types";
import { ok, err } from "./types";
import { getAvailableActions } from "./wizard";

// ============================================================================
// PURE RENDERING FUNCTIONS
// ============================================================================

/**
 * Render the current step (delegates to step's render function).
 * Pure: session + config + errors → HTML string
 */
export const renderCurrentStep = (
  config: WizardConfig,
  session: WizardSession,
  errors: Record<string, string> | null,
): Result<string, WizardError> => {
  const step = config.steps[session.currentStep];
  if (!step) {
    return err({
      type: "INVALID_STEP_INDEX",
      index: session.currentStep,
      max: config.steps.length - 1,
    });
  }

  const ctx: StepContext = {
    session,
    stepIndex: session.currentStep,
    data: session.stepData[session.currentStep],
    errors,
  };

  const renderResult = step.render(ctx);
  if (!renderResult.ok) {
    return err({
      type: "RENDER_FAILED",
      stepId: step.id,
      reason: renderResult.error,
    });
  }

  return ok(renderResult.value);
};

/**
 * Render navigation controls with HTMX attributes.
 * Pure: session + config → HTML string
 */
export const renderNavigation = (
  config: WizardConfig,
  session: WizardSession,
): string => {
  const actions = getAvailableActions(config, session);

  const prevButton = actions.canGoPrevious
    ? `<button
        type="button"
        hx-post="/wizard/${session.id}/previous"
        hx-target="#wizard-content"
        hx-swap="outerHTML"
        class="wizard-button wizard-button-prev"
      >Previous</button>`
    : `<button type="button" disabled class="wizard-button wizard-button-prev">Previous</button>`;

  const nextButton = actions.canGoNext
    ? `<button
        type="button"
        hx-post="/wizard/${session.id}/next"
        hx-target="#wizard-content"
        hx-swap="outerHTML"
        class="wizard-button wizard-button-next"
      >Next</button>`
    : `<button type="button" disabled class="wizard-button wizard-button-next">Next</button>`;

  const submitButton = actions.canSubmit
    ? `<button
        type="button"
        hx-post="/wizard/${session.id}/submit"
        hx-target="#wizard-content"
        hx-swap="outerHTML"
        class="wizard-button wizard-button-submit"
      >Submit</button>`
    : `<button type="button" disabled class="wizard-button wizard-button-submit">Submit</button>`;

  return `
    <div class="wizard-nav">
      ${prevButton}
      ${actions.canSubmit ? submitButton : nextButton}
    </div>
  `;
};

/**
 * Render step indicators (progress).
 * Pure: session + config → HTML string
 */
export const renderStepIndicators = (
  config: WizardConfig,
  session: WizardSession,
): string => {
  const actions = getAvailableActions(config, session);

  const indicators = config.steps
    .map((step, idx) => {
      const isCurrent = idx === session.currentStep;
      const isComplete = session.stepValidity[idx];
      const canNavigate = actions.canGoToStep(idx);

      const classNames = [
        "step-indicator",
        isCurrent && "current",
        isComplete && "complete",
        canNavigate && "clickable",
      ]
        .filter(Boolean)
        .join(" ");

      const button = canNavigate
        ? `<button
            type="button"
            hx-post="/wizard/${session.id}/goto/${idx}"
            hx-target="#wizard-content"
            hx-swap="outerHTML"
            class="${classNames}"
            aria-selected="${isCurrent}"
          >${idx + 1}. ${step.title}</button>`
        : `<span class="${classNames}" aria-selected="${isCurrent}">${idx + 1}. ${step.title}</span>`;

      return `<li>${button}</li>`;
    })
    .join("\n");

  return `<ol class="step-indicators" role="tablist">${indicators}</ol>`;
};

/**
 * Render complete wizard UI (orchestrates all rendering).
 * Pure: session + config + errors → HTML string
 */
export const renderWizard = (
  config: WizardConfig,
  session: WizardSession,
  errors: Record<string, string> | null = null,
): Result<string, WizardError> => {
  const stepResult = renderCurrentStep(config, session, errors);
  if (!stepResult.ok) return stepResult;

  const html = `
    <div id="wizard-content">
      ${renderStepIndicators(config, session)}
      <div class="step-content">
        ${stepResult.value}
      </div>
      ${renderNavigation(config, session)}
    </div>
  `;

  return ok(html);
};