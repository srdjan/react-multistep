import type React from "react";

/**
 * Structured result a step reports via useReportValidity(). A step is "valid"
 * (may proceed), "invalid" (blocked, with optional message/field errors), or
 * "pending" (not yet decided - e.g. async validation in flight). MultiStep gates
 * forward navigation on the "valid" status.
 */
export type StepValidity =
  | { status: "valid" }
  | { status: "invalid"; message?: string; errors?: Record<string, string> }
  | { status: "pending" };

/**
 * Lifecycle status of a step as surfaced on its metadata. "pristine" = never
 * visited and undecided; "visited" = visited but undecided; "valid"/"invalid"
 * mirror the reported StepValidity status.
 */
export type StepStatus = "pristine" | "visited" | "valid" | "invalid";

/**
 * Shared props for a step component rendered by MultiStep. Extend with your own
 * props to get full TypeScript coverage. Steps report validity by calling the
 * useReportValidity() hook - no prop is injected by MultiStep.
 */
export type StepComponentProps<Extra extends object = Record<string, never>> = Extra & {
  title?: React.ReactNode;
};

/**
 * Props for the MultiStep component.
 */
export interface MultiStepProps {
  /** Child components, one per step. */
  children: React.ReactNode;
  /** Controlled active step index (0-based). Provide together with onStepChange. */
  activeStep?: number;
  /** Uncontrolled starting step index (default: 0). */
  defaultStep?: number;
  /**
   * How inactive steps are rendered. "keepMounted" (default) keeps every step
   * mounted but hides inactive ones, preserving in-step state and running each
   * step's validity effect. "unmount" renders only the active step.
   */
  mode?: "unmount" | "keepMounted";
  /** Fired whenever the active step changes (manual or programmatic). */
  onStepChange?: (step: number) => void;
  /** Fired when the user tries to advance past an invalid step. */
  onValidationError?: (step: number) => void;
  /** Fired when complete() succeeds on the last step. */
  onComplete?: () => void;
  /**
   * Which element receives focus when the active step changes. "panel" (default)
   * focuses the step's panel wrapper; "heading" focuses the first heading inside
   * it (falling back to the wrapper); false disables focus management.
   */
  focusOnStepChange?: "panel" | "heading" | false;
}
