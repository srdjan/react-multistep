import React from "react"

export type TopNavProp = React.CSSProperties

export interface NavButtonProp {
  title?: string
  style?: React.CSSProperties
}

export interface MultiStepPropsBase {
  showTitles?: boolean
  topNavProp?: TopNavProp
  topNavStepProp?: TopNavProp
  children?: React.ReactElement[]
  prevButton?: NavButtonProp
  nextButton?: NavButtonProp
}

export interface StepState {
  title?: string
  isValid: boolean
  prevStep?: number
  nextStep?: number
  warning?: string
}