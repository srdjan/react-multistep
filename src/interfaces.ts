import React from "react"

export interface TopNavStyle {
  title?: string
  style?: React.CSSProperties
}

export interface NavButton {
  title?: string
  style?: React.CSSProperties
}

export interface MultiStepPropsBase {
    showTitles?: boolean
    topNavStyle?: React.CSSProperties
    topNavStepStyle?: React.CSSProperties
    children?: React.ReactElement[]
    prevButton?: NavButton
    nextButton?: NavButton
}

export interface StepState {
  title?: string
  isValid: boolean
  prevStep?: number
  nextStep?: number
  warning?: string
}