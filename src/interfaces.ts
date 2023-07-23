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
  topNavStep?: React.CSSProperties
  todo?: React.CSSProperties
  doing?: React.CSSProperties
  done?: React.CSSProperties
  children?: React.ReactElement[]
  prevButton?: NavButton
  nextButton?: NavButton
}

export interface StepState {
  title?: string
  isValid?: boolean
  nextStep?: number
}