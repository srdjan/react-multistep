import React from "react";

/** Metadata describing a single step, as seen by chrome/consumer components. */
export interface Step {
  index: number;
  isActive: boolean;
  isValid: boolean;
  title?: React.ReactNode;
}

/** The full wizard API returned by useMultiStep(). */
export interface MultiStepApi {
  activeStep: number;
  stepCount: number;
  steps: Step[];
  currentStepValid: boolean;
  isStepValid: (index: number) => boolean;
  goToStep: (step: number) => void;
  next: () => void;
  previous: () => void;
}

type MultiStepStateValue = Pick<
  MultiStepApi,
  "activeStep" | "stepCount" | "steps" | "currentStepValid" | "isStepValid"
>;

type MultiStepNavigationValue = Pick<MultiStepApi, "goToStep" | "next" | "previous">;

const MultiStepContext = React.createContext<MultiStepApi | null>(null);
const MultiStepStateContext = React.createContext<MultiStepStateValue | null>(null);
const MultiStepNavigationContext = React.createContext<MultiStepNavigationValue | null>(null);

interface MultiStepProviderProps {
  value: MultiStepApi;
  children: React.ReactNode;
}

export function MultiStepProvider({ value, children }: MultiStepProviderProps) {
  const stateValue = React.useMemo<MultiStepStateValue>(
    () => ({
      activeStep: value.activeStep,
      stepCount: value.stepCount,
      steps: value.steps,
      currentStepValid: value.currentStepValid,
      isStepValid: value.isStepValid,
    }),
    [value.activeStep, value.stepCount, value.steps, value.currentStepValid, value.isStepValid]
  );

  const navigationValue = React.useMemo<MultiStepNavigationValue>(
    () => ({
      goToStep: value.goToStep,
      next: value.next,
      previous: value.previous,
    }),
    [value.goToStep, value.next, value.previous]
  );

  return (
    <MultiStepContext.Provider value={value}>
      <MultiStepNavigationContext.Provider value={navigationValue}>
        <MultiStepStateContext.Provider value={stateValue}>
          {children}
        </MultiStepStateContext.Provider>
      </MultiStepNavigationContext.Provider>
    </MultiStepContext.Provider>
  );
}

/** Full wizard API. Prefer the slice hooks below for render-perf-sensitive chrome. */
export function useMultiStep(): MultiStepApi {
  const context = React.useContext(MultiStepContext);
  if (!context) {
    throw new Error("useMultiStep must be used within a MultiStep component");
  }
  return context;
}

/** Read-only wizard state (steps, active index, validity). */
export function useMultiStepState(): MultiStepStateValue {
  const context = React.useContext(MultiStepStateContext);
  if (!context) {
    throw new Error("useMultiStepState must be used within a MultiStep component");
  }
  return context;
}

/** Navigation actions (goToStep, next, previous). */
export function useMultiStepNavigation(): MultiStepNavigationValue {
  const context = React.useContext(MultiStepNavigationContext);
  if (!context) {
    throw new Error("useMultiStepNavigation must be used within a MultiStep component");
  }
  return context;
}
