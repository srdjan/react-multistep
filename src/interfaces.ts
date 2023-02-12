import React from "react"

export interface Step {
  title?: string
  component: React.ReactElement
}

export interface MultiStepPropsBase {
    stepCustomStyle?: object
    showNavigation?: boolean
    showTitles?: boolean
    direction?: "row" | "column"
    activeStep?: number
    children?: React.ReactElement[]
    steps?: Step[]
}
