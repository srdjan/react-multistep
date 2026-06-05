import React from "react";
import type { StepStatus, StepValidity } from "./interfaces.js";

/** Metadata describing a single step, as seen by chrome/consumer components. */
export interface Step {
  index: number;
  isActive: boolean;
  status: StepStatus;
  /** Convenience flag: true iff status === "valid". */
  isValid: boolean;
  title?: React.ReactNode;
  /** Stable id for the step's tab/indicator element (aria wiring). */
  tabId: string;
  /** Stable id for the step's panel element (aria wiring). */
  panelId: string;
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

/** Index of the step subtree a step component is rendered within. */
const StepIndexContext = React.createContext<number | null>(null);

/** Channel a step uses to report its validity back to MultiStep. */
const ReportValidityContext = React.createContext<
  ((index: number, validity: StepValidity) => void) | null
>(null);

interface MultiStepProviderProps {
  value: MultiStepApi;
  report: (index: number, validity: StepValidity) => void;
  children: React.ReactNode;
}

export function MultiStepProvider({ value, report, children }: MultiStepProviderProps) {
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
      <ReportValidityContext.Provider value={report}>
        <MultiStepNavigationContext.Provider value={navigationValue}>
          <MultiStepStateContext.Provider value={stateValue}>
            {children}
          </MultiStepStateContext.Provider>
        </MultiStepNavigationContext.Provider>
      </ReportValidityContext.Provider>
    </MultiStepContext.Provider>
  );
}

interface StepIndexProviderProps {
  index: number;
  children: React.ReactNode;
}

/** Wraps a rendered step so useReportValidity() can resolve its index. */
export function StepIndexProvider({ index, children }: StepIndexProviderProps) {
  return <StepIndexContext.Provider value={index}>{children}</StepIndexContext.Provider>;
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

/**
 * Hook a step component calls to report its validity. Returns a stable callback;
 * call it with a StepValidity whenever the step's validity changes (typically
 * from an effect). Replaces the old injected signalParent prop.
 */
export function useReportValidity(): (validity: StepValidity) => void {
  const index = React.useContext(StepIndexContext);
  const report = React.useContext(ReportValidityContext);
  if (index === null || report === null) {
    throw new Error("useReportValidity must be used within a MultiStep step");
  }
  return React.useCallback((validity: StepValidity) => report(index, validity), [report, index]);
}
