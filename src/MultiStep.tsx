import React, { useState, useEffect } from 'react'
import { MultiStepPropsBase, NavButton, StepState } from './interfaces'

const getTopNavStyles = (activeStep: number, length: number): string[] => {
  const styles: string[] = []
  for (let i = 0; i < length; i++) {
    if (i < activeStep) {
      styles.push('done')
    } else if (i === activeStep) {
      styles.push('doing')
    } else {
      styles.push('todo')
    }
  }
  return styles
}

const getButtonsState = (activeStep: number, length: number, stepIsValid: boolean) => {
  if (activeStep === 0) {
    return {
      prevDisabled: true,
      nextDisabled: !stepIsValid,
      nextHidden: false
    }
  }
  if (activeStep > 0 && activeStep < (length - 1)) {
    return {
      prevDisabled: false,
      nextDisabled: !stepIsValid,
      nextHidden: false
    }
  }
  console.log(`stepIsValid: ${stepIsValid}`)
  return {
    prevDisabled: false,
    nextDisabled: !stepIsValid,
    nextHidden: true
  }
}


//todo: update docs
// 1) removed stepsArray
// 2) removed const directionType = typeof props.direction === 'undefined' ? 'row' : props.direction
// 3) removed const showTitles
// ...
// more like, redo docs from scratch :)
export default function MultiStep(props: MultiStepPropsBase) {
  let { children } = props
  if (!children) {
    throw TypeError("Error: No steps to show")
  }

  const [activeStep, setActiveStep] = useState(0)
  const [nextStep, setNextStep] = useState(0)
  const [stepIsValid, setStepIsValid] = useState(false)

  const containerStyle = typeof props.containerStyle === 'undefined' ? {} : props.containerStyle
  const topNavStyle = typeof props.topNav === 'undefined' ? {} : props.topNav
  const topNavStepStyle = typeof props.topNavStep === 'undefined' ? {} : props.topNavStep
  const todoStyle = typeof props.todo === 'undefined' ? {} : props.todo
  const doingStyle = typeof props.doing === 'undefined' ? {} : props.doing
  const doneStyle = typeof props.done === 'undefined' ? {} : props.done

  const prevButton: NavButton = typeof props.prevButton === 'undefined' ? {} : props.prevButton
  const nextButton: NavButton = typeof props.nextButton === 'undefined' ? {} : props.nextButton

  const stepStateChanged = (stepState: StepState) => {
    console.debug(`stepStateChanged, isValid: ${stepState?.isValid}, nextStep: ${stepState?.nextStep}`)

    if (stepState.isValid !== undefined) setStepIsValid(() => stepState.isValid)
    if (stepState.nextStep) setNextStep(stepState.nextStep)
  }

  children = React.Children.map(children, child =>
    React.cloneElement(child, { signalParent: stepStateChanged })
  )
  let steps = children.map(child => ({
    title: child.props.title,
    component: child })
  )

  const [stylesState, setStylesState] = useState(getTopNavStyles(activeStep, steps.length))
  const [buttonsState, setButtonsState] = useState({
    prevDisabled: true,
    nextDisabled: true,
    nextHidden: false
  })

  useEffect(() => {
    setButtonsState(getButtonsState(activeStep, steps.length, stepIsValid))
  }, [activeStep, stepIsValid])

  const setStepState = (activeStep: number) => {
    setStylesState(getTopNavStyles(activeStep+nextStep, steps.length))
    setActiveStep(activeStep + nextStep)
  }

  const next = () => {
    let newActiveStep = activeStep === steps.length - 1 ? activeStep : activeStep + 1
    setStepState(newActiveStep)
  }
  const previous = () => {
    let newActiveStep = activeStep > 0 ? activeStep - 1 : activeStep
    setStepState(newActiveStep)
  }

  const handleOnClick = (indx: number) => {
    if (!stepIsValid) {
      console.log('Error: Step validation failed')
      return
    }
    if (
      indx === steps.length - 1 &&
      activeStep === steps.length - 1
    ) {
      setStepState(steps.length)
    } else {
      setStepState(indx)
    }
  }

  const renderTopNav = () =>
    steps.map((s, i) => (
        <li
          style={{ ...topNavStepStyle }}
          onClick={() => handleOnClick(i)}
          key={i}
        >
          {
            stylesState[i] === 'doing' ?
              <span style={doingStyle}>{s.title ?? i + 1}</span> :
            stylesState[i] === 'done' ?
              <span style={doneStyle}>{s.title ?? i + 1}</span> :
              <span style={todoStyle}>{s.title ?? i + 1}</span>
          }
        </li>
      )
    )
  
  const renderButtonsNav = () => (
    <>
        <button onClick={previous}
                style={ prevButton?.style }
                disabled={buttonsState.prevDisabled}>
          <span>&#60;</span>
        </button>
      <button onClick={next}
        style={buttonsState.nextHidden ? { display: 'none' } : nextButton?.style}
              disabled={buttonsState.nextDisabled}>
          <span>&#62;</span>
        </button>
    </>
  )

  return (
    <div style = {{ ...containerStyle }} >
      <ol style={{ ...topNavStyle }}>{renderTopNav()}</ol>
      {steps[activeStep].component}
      <div>{renderButtonsNav()}</div>
    </div>
  )
}
