import React from "react"

export interface Step {
  title?: string
  component: React.ReactElement
}

export interface NavButton{
  title?: string
  style?: React.CSSProperties
}

export interface MultiStepPropsBase {
    stepCustomStyle?: React.CSSProperties
    showNavigation?: boolean
    showTitles?: boolean
    direction?: "row" | "column"
    activeStep?: number
    children?: React.ReactElement[]
    steps?: Step[]
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