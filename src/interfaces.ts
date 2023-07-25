import React from "react"

export interface NavButton {
  title?: string
  style?: React.CSSProperties
  disabledStyle?: React.CSSProperties
}

export interface MultiStepPropsBase {
  showTitles?: boolean
  containerStyle?: React.CSSProperties
  topNav?: React.CSSProperties
  topNavStepStyle?: React.CSSProperties
  todo?: React.CSSProperties
  doing?: React.CSSProperties
  done?: React.CSSProperties
  skip?: React.CSSProperties
  children?: React.ReactElement[]
  prevButton?: NavButton
  nextButton?: NavButton
}

export interface StepState {
  isValid?: boolean
  nextStep?: number
}