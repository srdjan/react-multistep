import type { ReactNode } from "react";
import { useMultiStepState, useMultiStepA11y, useReducedMotion } from "react-multistep";

/**
 * Headless chrome for MultiStep, driven entirely by the useMultiStepA11y()
 * prop-getters.
 *
 * Why prop-getters: every accessible attribute (ids, roles, aria-current,
 * aria-controls/labelledby, aria-live, disabled gating, onClick wiring) comes
 * from the getters instead of being hand-assembled here. We only supply the
 * className for each element and the visible label; the getters own the a11y
 * contract, so this chrome cannot drift out of sync with the wizard's
 * navigation/validation rules.
 *
 * Styling: consumes the package's shipped stylesheet (react-multistep/styles,
 * imported once in app.tsx) and only references its class names. The
 * reset/focus rules in that sheet are scoped under `.multistep-container`, so
 * the outer element keeps that class.
 *
 * A11y pattern: this is a linear, validation-gated wizard, so getStepListProps
 * emits the wizard / progress pattern (role="list" + aria-label="Progress"
 * with aria-current="step"), NOT role="tab"/role="tablist".
 *
 * Why mode="unmount" is required (set in app.tsx): the chrome is rendered
 * INSIDE each step so it can read the MultiStep context. Each chrome calls the
 * getters, which emit the step's useId-derived stepId/panelId. Keeping every
 * step mounted would render four chromes at once, duplicating those ARIA ids
 * (and four step lists/panels). Unmounting inactive steps guarantees a single
 * chrome - and a single, unique set of ids - in the DOM at any time.
 */
export const WizardChrome = ({ children }: { children: ReactNode }) => {
  // isNavigating is true while an async beforeStepChange guard is in flight
  // (see app.tsx). We disable the nav buttons so a step change cannot be
  // started twice, and surface a "Saving..." hint on the active control.
  const { steps, isLast, currentStepError, isNavigating } = useMultiStepState();
  const {
    getStepListProps,
    getStepProps,
    getPanelProps,
    getPreviousButtonProps,
    getNextButtonProps,
    getCompleteButtonProps,
    getErrorRegionProps,
  } = useMultiStepA11y();

  // Reduced-motion gate: only attach the pulsing busy class when the user has
  // not asked for reduced motion. The CSS sheet also neutralises animations,
  // but gating here keeps the class off the DOM entirely.
  const reducedMotion = useReducedMotion();
  const busyClass = isNavigating && !reducedMotion ? " is-busy" : "";

  return (
    <div className="multistep-container">
      <div className="multistep-component">
        <nav aria-label="Progress">
          <ol {...getStepListProps({ className: "multistep-top-nav" })}>
            {steps.map((step) => (
              <li key={step.index} className="multistep-top-nav-step">
                <button
                  {...getStepProps(step.index, {
                    className: "multistep-step-button",
                    // Only force disabled while navigating; otherwise leave the
                    // getter's own disabled (validation gating) untouched.
                    ...(isNavigating ? { disabled: true } : {}),
                  })}
                >
                  {step.title ?? step.index + 1}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div {...getPanelProps({ className: "multistep-section" })}>{children}</div>

        <div {...getErrorRegionProps({ className: "multistep-error" })}>
          {currentStepError}
        </div>

        <div className="multistep-nav-buttons">
          <button
            {...getPreviousButtonProps({
              className: "multistep-button multistep-button-prev",
              ...(isNavigating ? { disabled: true } : {}),
            })}
          >
            &lsaquo;
          </button>
          {isLast ? (
            <button
              {...getCompleteButtonProps({
                className: `multistep-button multistep-button-complete${busyClass}`,
                "aria-label": "Finish",
                ...(isNavigating ? { disabled: true } : {}),
              })}
            >
              {isNavigating ? "Saving..." : "Finish"}
            </button>
          ) : (
            <button
              {...getNextButtonProps({
                className: `multistep-button multistep-button-next${busyClass}`,
                ...(isNavigating ? { disabled: true } : {}),
              })}
            >
              &rsaquo;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
