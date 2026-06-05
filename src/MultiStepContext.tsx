import React from "react";
import type { StepStatus, StepValidity } from "./interfaces.js";
import { firstBlockingStep } from "./gate.js";

/** Metadata describing a single step, as seen by chrome/consumer components. */
export interface Step {
  index: number;
  isActive: boolean;
  status: StepStatus;
  /** Convenience flag: true iff status === "valid". */
  isValid: boolean;
  title?: React.ReactNode;
  /** Stable id for the step indicator/button element. */
  stepId: string;
  /** Stable id for the step panel element. */
  panelId: string;
}

/** The full wizard API returned by useMultiStep(). */
export interface MultiStepApi {
  activeStep: number;
  stepCount: number;
  steps: Step[];
  currentStepValid: boolean;
  isStepValid: (index: number) => boolean;
  /** True iff the active step is the first step. */
  isFirst: boolean;
  /** True iff the active step is the last step. */
  isLast: boolean;
  /** Fractional progress through the wizard, 0..1 (1 when there is one step or fewer). */
  progress: number;
  /** True iff on the last step and that step is valid. */
  canComplete: boolean;
  /** Indices the user has landed on (status !== "pristine"). */
  visitedSteps: number[];
  /** Indices with status === "valid". */
  completedSteps: number[];
  /** Active step's validity message when its status is "invalid", else undefined. */
  currentStepError?: string;
  /** True while an async beforeStepChange guard is in flight. */
  isNavigating: boolean;
  goToStep: (step: number) => void;
  next: () => void;
  previous: () => void;
  /** Finish the wizard: if canComplete, fire onComplete(); else report a validation error. */
  complete: () => void;
}

type MultiStepStateValue = Pick<
  MultiStepApi,
  | "activeStep"
  | "stepCount"
  | "steps"
  | "currentStepValid"
  | "isStepValid"
  | "isFirst"
  | "isLast"
  | "progress"
  | "canComplete"
  | "visitedSteps"
  | "completedSteps"
  | "currentStepError"
  | "isNavigating"
>;

type MultiStepNavigationValue = Pick<
  MultiStepApi,
  "goToStep" | "next" | "previous" | "complete"
>;

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
      isFirst: value.isFirst,
      isLast: value.isLast,
      progress: value.progress,
      canComplete: value.canComplete,
      visitedSteps: value.visitedSteps,
      completedSteps: value.completedSteps,
      currentStepError: value.currentStepError,
      isNavigating: value.isNavigating,
    }),
    [
      value.activeStep,
      value.stepCount,
      value.steps,
      value.currentStepValid,
      value.isStepValid,
      value.isFirst,
      value.isLast,
      value.progress,
      value.canComplete,
      value.visitedSteps,
      value.completedSteps,
      value.currentStepError,
      value.isNavigating,
    ]
  );

  const navigationValue = React.useMemo<MultiStepNavigationValue>(
    () => ({
      goToStep: value.goToStep,
      next: value.next,
      previous: value.previous,
      complete: value.complete,
    }),
    [value.goToStep, value.next, value.previous, value.complete]
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

/**
 * Merge a base set of element props with caller overrides. onClick handlers are
 * composed so BOTH run (base first, then override); className is concatenated;
 * style is shallow-merged; every other override wins for plain values. Generic
 * over the element's attribute type so callers keep full prop typing.
 */
function mergeProps<P extends React.HTMLAttributes<HTMLElement>>(
  base: P,
  overrides?: Partial<P>
): P {
  if (!overrides) return base;
  const merged: P = { ...base, ...overrides };
  if (base.onClick && overrides.onClick) {
    const baseClick = base.onClick;
    const overrideClick = overrides.onClick;
    merged.onClick = (event: React.MouseEvent<HTMLElement>) => {
      baseClick(event);
      overrideClick(event);
    };
  }
  if (base.className && overrides.className) {
    merged.className = `${base.className} ${overrides.className}`;
  }
  if (base.style && overrides.style) {
    merged.style = { ...base.style, ...overrides.style };
  }
  return merged;
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
type ListProps = React.HTMLAttributes<HTMLElement>;
type RegionProps = React.HTMLAttributes<HTMLElement>;
/** Step button props carry the step's status as a data-* attribute for styling. */
type StepButtonProps = ButtonProps & { "data-status"?: StepStatus };

/** Prop-getter functions for building accessible wizard chrome. */
export interface MultiStepA11y {
  getStepListProps: (overrides?: Partial<ListProps>) => ListProps;
  getStepProps: (index: number, overrides?: Partial<StepButtonProps>) => StepButtonProps;
  getPanelProps: (overrides?: Partial<RegionProps>) => RegionProps;
  getPreviousButtonProps: (overrides?: Partial<ButtonProps>) => ButtonProps;
  getNextButtonProps: (overrides?: Partial<ButtonProps>) => ButtonProps;
  getCompleteButtonProps: (overrides?: Partial<ButtonProps>) => ButtonProps;
  getErrorRegionProps: (overrides?: Partial<RegionProps>) => RegionProps;
}

/**
 * Returns prop-getter functions that spread onto wizard chrome elements to wire
 * up the wizard / aria-current accessibility pattern (NOT role=tab). Each getter
 * accepts an optional overrides object merged via mergeProps. Must be used within
 * a MultiStep component.
 */
export function useMultiStepA11y(): MultiStepA11y {
  const api = useMultiStep();
  const {
    steps,
    activeStep,
    currentStepValid,
    isFirst,
    isLast,
    canComplete,
    goToStep,
    next,
    previous,
    complete,
  } = api;

  // Compute the gate boundary once: the first step at/after the active one that
  // is not valid (null if all are). Rendering a full step list then costs O(n)
  // total instead of re-scanning the range inside every getStepProps call.
  const firstBlocked = React.useMemo(
    () => firstBlockingStep(activeStep, steps.length, (i) => steps[i]?.status === "valid"),
    [steps, activeStep]
  );

  // Forward jump blocked if any step in [activeStep, index) is not valid; back or
  // staying at/<= active is always allowed. Mirrors the goToStep forward gate via
  // the same firstBlockingStep helper so the two can never disagree.
  const canNavigateTo = React.useCallback(
    (index: number): boolean =>
      index <= activeStep || firstBlocked === null || index <= firstBlocked,
    [activeStep, firstBlocked]
  );

  return React.useMemo<MultiStepA11y>(
    () => ({
      getStepListProps: (overrides) =>
        mergeProps<ListProps>({ role: "list", "aria-label": "Progress" }, overrides),
      getStepProps: (index, overrides) => {
        const step = steps[index];
        return mergeProps<StepButtonProps>(
          {
            id: step?.stepId,
            type: "button",
            "aria-current": index === activeStep ? "step" : undefined,
            "aria-controls": step?.panelId,
            "data-status": step?.status,
            disabled: !canNavigateTo(index),
            onClick: () => goToStep(index),
          },
          overrides
        );
      },
      getPanelProps: (overrides) => {
        const step = steps[activeStep];
        return mergeProps<RegionProps>(
          {
            id: step?.panelId,
            role: "region",
            "aria-labelledby": step?.stepId,
            tabIndex: -1,
          },
          overrides
        );
      },
      getPreviousButtonProps: (overrides) =>
        mergeProps<ButtonProps>(
          {
            type: "button",
            "aria-label": "Previous step",
            disabled: isFirst,
            onClick: () => previous(),
          },
          overrides
        ),
      getNextButtonProps: (overrides) =>
        mergeProps<ButtonProps>(
          {
            type: "button",
            "aria-label": "Next step",
            disabled: isLast || !currentStepValid,
            onClick: () => next(),
          },
          overrides
        ),
      getCompleteButtonProps: (overrides) =>
        mergeProps<ButtonProps>(
          {
            type: "button",
            disabled: !canComplete,
            onClick: () => complete(),
          },
          overrides
        ),
      getErrorRegionProps: (overrides) =>
        mergeProps<RegionProps>(
          { role: "status", "aria-live": "polite", "aria-atomic": true },
          overrides
        ),
    }),
    [
      steps,
      activeStep,
      currentStepValid,
      isFirst,
      isLast,
      canComplete,
      canNavigateTo,
      goToStep,
      next,
      previous,
      complete,
    ]
  );
}
