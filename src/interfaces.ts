import React from "react";

/**
 * Style configuration for MultiStep component parts
 */
export interface MultiStepStyles {
  /** Styles for the outer container */
  component?: React.CSSProperties;
  /** Styles for the section containing step content and buttons */
  section?: React.CSSProperties;
  /** Styles for the top navigation list */
  topNav?: React.CSSProperties;
  /** Styles for individual step indicators in top nav */
  topNavStep?: React.CSSProperties;
  /** Styles for inactive/todo step indicators */
  todo?: React.CSSProperties;
  /** Styles for active/doing step indicator */
  doing?: React.CSSProperties;
  /** Styles for previous button */
  prevButton?: React.CSSProperties;
  /** Styles for next button */
  nextButton?: React.CSSProperties;
}

/**
 * State object passed from child components to parent via signalParent callback
 */
export interface ChildState {
  /** Whether the current step is valid and can proceed to next */
  isValid: boolean;
}

/**
 * Props for MultiStep component
 */
export interface MultiStepProps {
  /** Custom styles to override default BaseStyles */
  styles?: MultiStepStyles;
  /** Child components representing each step */
  children: React.ReactElement | React.ReactElement[];
  /** Controlled active step index (0-based) */
  activeStep?: number;
  /** Callback fired when active step changes */
  onStepChange?: (step: number) => void;
  /** Custom content for previous button (default: "‹") */
  prevButtonContent?: React.ReactNode;
  /** Custom content for next button (default: "›") */
  nextButtonContent?: React.ReactNode;
  /** Whether to show navigation buttons (default: true) */
  showNavigation?: boolean;
  /** Callback fired when user tries to navigate while current step is invalid */
  onValidationError?: (step: number) => void;
}
