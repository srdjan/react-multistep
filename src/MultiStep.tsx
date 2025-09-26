import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ChildState, MultiStepProps, MultiStepStyles } from "./interfaces";
import { BaseStyles } from "./baseStyles";

/**
 * MultiStep component for creating multi-step forms with validation
 *
 * @param props - MultiStepProps configuration object
 * @returns A multi-step form component with navigation
 *
 * @example
 * ```tsx
 * <MultiStep styles={customStyles} activeStep={0} onStepChange={(step) => console.log(step)}>
 *   <StepOne title="Step 1" />
 *   <StepTwo title="Step 2" />
 * </MultiStep>
 * ```
 */
export default function MultiStep(props: MultiStepProps) {
  const {
    children,
    styles: customStyles,
    activeStep: controlledActiveStep,
    onStepChange,
    prevButtonContent = "‹",
    nextButtonContent = "›",
    showNavigation = true,
    onValidationError,
  } = props;

  if (!children) {
    throw new TypeError("Error: MultiStep requires at least one child component");
  }

  const styles = customStyles ?? (BaseStyles as MultiStepStyles);

  const childrenArray = useMemo(
    () => (Array.isArray(children) ? children : [children]),
    [children]
  );
  const totalSteps = childrenArray.length;

  const [internalActiveStep, setInternalActiveStep] = useState(controlledActiveStep ?? 0);
  const [stepValidStates, setStepValidStates] = useState<boolean[]>(
    new Array(totalSteps).fill(true)
  );

  const activeChild = controlledActiveStep ?? internalActiveStep;

  useEffect(() => {
    if (controlledActiveStep !== undefined && controlledActiveStep !== internalActiveStep) {
      setInternalActiveStep(controlledActiveStep);
    }
  }, [controlledActiveStep]);

  const handleStepChange = useCallback(
    (newStep: number) => {
      if (newStep < 0 || newStep >= totalSteps) return;

      setInternalActiveStep(newStep);
      onStepChange?.(newStep);
    },
    [totalSteps, onStepChange]
  );

  const childStateChanged = useCallback(
    (childState: ChildState) => {
      setStepValidStates((prev) => {
        const newStates = [...prev];
        newStates[activeChild] = childState.isValid;
        return newStates;
      });
    },
    [activeChild]
  );

  const childrenWithProps = useMemo(
    () =>
      React.Children.map(childrenArray, (child) =>
        React.cloneElement(child, { signalParent: childStateChanged })
      ),
    [childrenArray, childStateChanged]
  );

  const currentStepValid = stepValidStates[activeChild] ?? true;

  const handleNext = useCallback(() => {
    if (activeChild < totalSteps - 1 && currentStepValid) {
      handleStepChange(activeChild + 1);
    }
  }, [activeChild, totalSteps, currentStepValid, handleStepChange]);

  const handlePrevious = useCallback(() => {
    if (activeChild > 0) {
      handleStepChange(activeChild - 1);
    }
  }, [activeChild, handleStepChange]);

  const handleStepClick = useCallback(
    (targetStep: number) => {
      if (!currentStepValid) {
        onValidationError?.(activeChild);
        return;
      }
      handleStepChange(targetStep);
    },
    [currentStepValid, activeChild, onValidationError, handleStepChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft" && activeChild > 0) {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === "ArrowRight" && activeChild < totalSteps - 1 && currentStepValid) {
        e.preventDefault();
        handleNext();
      }
    },
    [activeChild, totalSteps, currentStepValid, handlePrevious, handleNext]
  );

  const renderTopNav = () => (
    <ol
      style={styles.topNav}
      role="tablist"
      aria-label="Form steps"
    >
      {childrenWithProps?.map((c, i) => {
        const isActive = i === activeChild;

        return (
          <li
            style={styles.topNavStep}
            onClick={() => handleStepClick(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleStepClick(i);
              }
            }}
            key={i}
            role="tab"
            aria-selected={isActive}
            aria-controls={`step-panel-${i}`}
            tabIndex={isActive ? 0 : -1}
          >
            {isActive ? (
              <span style={styles.doing} aria-current="step">
                {c.props.title ?? i + 1}
              </span>
            ) : (
              <span style={styles.todo}>
                {c.props.title ?? i + 1}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );

  const renderBottomNav = () => {
    if (!showNavigation) return null;

    const isPrevDisabled = activeChild === 0;
    const isNextDisabled = !currentStepValid;
    const isLastStep = activeChild === totalSteps - 1;

    return (
      <div style={styles.section}>
        <button
          onClick={handlePrevious}
          style={styles.prevButton}
          disabled={isPrevDisabled}
          aria-label="Previous step"
          type="button"
        >
          {prevButtonContent}
        </button>
        {!isLastStep && (
          <button
            onClick={handleNext}
            style={styles.nextButton}
            disabled={isNextDisabled}
            aria-label="Next step"
            type="button"
          >
            {nextButtonContent}
          </button>
        )}
      </div>
    );
  };

  const currentChild = childrenWithProps?.[activeChild];

  return (
    <div style={styles.component} onKeyDown={handleKeyDown}>
      {renderTopNav()}
      <div
        style={styles.section}
        role="tabpanel"
        id={`step-panel-${activeChild}`}
        aria-labelledby={`step-${activeChild}`}
      >
        {currentChild}
      </div>
      {renderBottomNav()}
    </div>
  );
}