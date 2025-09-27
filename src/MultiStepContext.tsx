import React from "react";

export interface MultiStepContextStep {
  index: number;
  isActive: boolean;
  isValid: boolean;
  title?: React.ReactNode;
}

export interface MultiStepContextValue {
  activeStep: number;
  stepCount: number;
  steps: MultiStepContextStep[];
  goToStep: (step: number) => void;
  next: () => void;
  previous: () => void;
  setStepValidity: (index: number, isValid: boolean) => void;
  isStepValid: (index: number) => boolean;
  currentStepValid: boolean;
}

const MultiStepContext = React.createContext<MultiStepContextValue | null>(null);

type MultiStepStateContextValue = Pick<
  MultiStepContextValue,
  "activeStep" | "stepCount" | "steps" | "currentStepValid"
>;

type MultiStepNavigationContextValue = Pick<
  MultiStepContextValue,
  "goToStep" | "next" | "previous" | "setStepValidity" | "isStepValid"
>;

const MultiStepStateContext = React.createContext<MultiStepStateContextValue | null>(null);
const MultiStepNavigationContext = React.createContext<MultiStepNavigationContextValue | null>(null);

interface MultiStepProviderProps {
  value: MultiStepContextValue;
  children: React.ReactNode;
}

export function MultiStepProvider({ value, children }: MultiStepProviderProps) {
  const stateValue = React.useMemo<MultiStepStateContextValue>(
    () => ({
      activeStep: value.activeStep,
      stepCount: value.stepCount,
      steps: value.steps,
      currentStepValid: value.currentStepValid,
    }),
    [value.activeStep, value.stepCount, value.steps, value.currentStepValid],
  );

  const navigationValue = React.useMemo<MultiStepNavigationContextValue>(
    () => ({
      goToStep: value.goToStep,
      next: value.next,
      previous: value.previous,
      setStepValidity: value.setStepValidity,
      isStepValid: value.isStepValid,
    }),
    [
      value.goToStep,
      value.next,
      value.previous,
      value.setStepValidity,
      value.isStepValid,
    ],
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

export function useMultiStep(): MultiStepContextValue {
  const context = React.useContext(MultiStepContext);
  if (!context) {
    throw new Error("useMultiStep must be used within a MultiStep component");
  }
  return context;
}

export function useMultiStepState(): MultiStepStateContextValue {
  const context = React.useContext(MultiStepStateContext);
  if (!context) {
    throw new Error("useMultiStepState must be used within a MultiStep component");
  }
  return context;
}

const useNavigationContext = (): MultiStepNavigationContextValue => {
  const context = React.useContext(MultiStepNavigationContext);
  if (!context) {
    throw new Error("useStepNavigation must be used within a MultiStep component");
  }
  return context;
};

export function useStepNavigation(): Pick<
  MultiStepNavigationContextValue,
  "goToStep" | "next" | "previous"
> {
  const { goToStep, next, previous } = useNavigationContext();
  return { goToStep, next, previous };
}

export function useStepList(): MultiStepContextStep[] {
  const { steps } = useMultiStepState();
  return steps;
}

export { MultiStepContext };
