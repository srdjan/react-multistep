import React from "react"

interface MultiStepStyles {
  container?: React.CSSProperties,
  topNav?: React.CSSProperties
  topNavStep?: React.CSSProperties
  todo?: React.CSSProperties
  doing?: React.CSSProperties
  done?: React.CSSProperties
  skip?: React.CSSProperties
  prevButton?: React.CSSProperties
  nextButton?: React.CSSProperties
}

export interface MultiStepProps {
  showTitles?: boolean,   //todo: remove, use topNav.display: none ?
  styles: MultiStepStyles
  children?: React.ReactElement[]
}

export interface ChildState {
  isValid?: boolean
  next?: number
}