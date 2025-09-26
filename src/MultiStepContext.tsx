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

export const MultiStepProvider = MultiStepContext.Provider;

export function useMultiStep(): MultiStepContextValue {
  const context = React.useContext(MultiStepContext);
  if (!context) {
    throw new Error("useMultiStep must be used within a MultiStep component");
  }
  return context;
}

export { MultiStepContext };
