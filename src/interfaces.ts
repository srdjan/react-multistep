import React from "react"

export interface MultiStepStyles {
  component?: React.CSSProperties
  section?: React.CSSProperties
  topNav?: React.CSSProperties
  topNavStep?: React.CSSProperties
  todo?: React.CSSProperties
  doing?: React.CSSProperties
  prevButton?: React.CSSProperties
  nextButton?: React.CSSProperties
}

export interface MultiStepProps {
  activeStep?: number
  styles: MultiStepStyles
  children: React.ReactElement[]
  onNext?: () => void
  onPrev?: () => void
}

export interface ChildState {
  isValid: boolean
  goto: number
}