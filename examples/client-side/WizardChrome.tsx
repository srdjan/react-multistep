import type { ReactNode } from "react";
import { useMultiStepState, useMultiStepNavigation } from "react-multistep";

/**
 * Faithful headless chrome for MultiStep.
 *
 * Styling: consumes the package's shipped stylesheet (react-multistep/styles,
 * imported once in app.tsx) and only references its class names - no inline
 * style object. The reset/focus rules in that sheet are scoped under
 * `.multistep-container`, so the outer element carries that class.
 *
 * A11y: this is a linear, validation-gated wizard, not a freely reachable
 * tablist - so it uses the wizard / progress pattern (a labelled <nav> + <ol>
 * with `aria-current="step"`) instead of role="tab"/aria-selected. The step
 * indicator and the panel are linked through the library-generated, useId-
 * derived `step.tabId` / `step.panelId`.
 */
export const WizardChrome = ({ children }: { children: ReactNode }) => {
  const { steps, activeStep, stepCount, currentStepValid } = useMultiStepState();
  const { goToStep, next, previous } = useMultiStepNavigation();

  const isLast = activeStep === stepCount - 1;
  const active = steps[activeStep];

  return (
    <div className="multistep-container">
      <div className="multistep-component">
        <nav aria-label="Progress">
          <ol className="multistep-top-nav">
            {steps.map((step) => {
              const isActive = step.index === activeStep;
              return (
                <li key={step.index} className="multistep-top-nav-step">
                  <button
                    id={step.tabId}
                    type="button"
                    className="multistep-step-button"
                    aria-current={isActive ? "step" : undefined}
                    onClick={() => goToStep(step.index)}
                  >
                    {step.title ?? step.index + 1}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <div
          id={active?.panelId}
          role="region"
          aria-labelledby={active?.tabId}
          className="multistep-section"
        >
          {children}
        </div>

        <div className="multistep-nav-buttons">
          <button
            type="button"
            onClick={previous}
            disabled={activeStep === 0}
            aria-label="Previous step"
            className="multistep-button multistep-button-prev"
          >
            &lsaquo;
          </button>
          {!isLast && (
            <button
              type="button"
              onClick={next}
              disabled={!currentStepValid}
              aria-label="Next step"
              className="multistep-button multistep-button-next"
            >
              &rsaquo;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
