import React from "react";

export interface Step {
    component: React.ReactElement;
    title?: string;
}

export interface MultiStepPropsBase {
    stepCustomStyle?: object;
    showNavigation?: boolean;
    showTitles?: boolean;
    direction?: "row" | "column";
    activeStep?: number;
    children?: React.ReactElement[];
    steps?: Step[];
}
