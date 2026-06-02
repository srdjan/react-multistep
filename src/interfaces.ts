import type React from "react";

/**
 * State object passed from a step component to MultiStep via the signalParent
 * callback. A step reports whether it is currently valid; MultiStep uses this to
 * gate forward navigation.
 */
export interface ChildState {
  /** Whether the current step is valid and the user may proceed. */
  isValid: boolean;
}

/** Callback invoked by steps to report their current validity to MultiStep. */
export type SignalParent = (state: ChildState) => void;

/**
 * Shared props for a step component rendered by MultiStep. Extend with your own
 * props to get full TypeScript coverage. `signalParent` is injected by MultiStep
 * at render time, so it is optional here (you do not pass it in JSX); call it
 * with optional chaining to report validity: `signalParent?.({ isValid })`.
 */
export type StepComponentProps<ExtraProps extends object = Record<string, never>> = ExtraProps & {
  signalParent?: SignalParent;
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
  /** Fired whenever the active step changes (manual or programmatic). */
  onStepChange?: (step: number) => void;
  /** Uncontrolled starting step index (default: 0). */
  defaultStep?: number;
  /** Fired when the user tries to advance while the current step is invalid. */
  onValidationError?: (step: number) => void;
}
