/**
 * State object passed from child components to parent via signalParent callback
 */
export interface ChildState {
  /** Whether the current step is valid and can proceed to next */
  isValid: boolean;
  /** Optional hint for a step the user should navigate to when invalid */
  goto?: number;
}

/**
 * Props for MultiStep component
 */
export interface MultiStepProps {
  /** Child components representing each step */
  children: React.ReactNode;
  /** Controlled active step index (0-based). Leave undefined for internal state */
  activeStep?: number;
  /** Callback fired when active step changes */
  onStepChange?: (step: number) => void;
  /** Initial step index for uncontrolled mode (default: 0) */
  initialStep?: number;
  /** Callback fired when user tries to navigate while current step is invalid */
  onValidationError?: (step: number) => void;
}
