import React, { useState, useEffect } from 'react'
import { MultiStepProps, StepState } from './interfaces'

const getTopNavStyles = (activeStep: number, length: number): string[] => {
  const styles: string[] = []
  for (let i = 0; i < length; i++) {
    if (i < activeStep) {
      styles.push('done')
    } else if (i === activeStep) {
      styles.push('doing')
    } else if (i === 2) { //skipStep) { //todo: set skip states array?
      styles.push('skip')
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
export default function MultiStep(props: MultiStepProps) {
  let { children } = props
  if (!children) {
    throw TypeError("Error: No steps to show")
  }

  const [activeStep, setActiveStep] = useState(0)
  const [nextStep, setNextStep] = useState(0)
  const [stepIsValid, setStepIsValid] = useState(false)

  const containerStyle = typeof props.styles.container === 'undefined' ? {} : props.styles.container
  const topNavStyle = typeof props.styles.topNav === 'undefined' ? {} : props.styles.topNav
  const topNavStepStyle = typeof props.styles.topNavStep === 'undefined' ? {} : props.styles.topNavStep
  const todoStyle = typeof props.styles.todo === 'undefined' ? {} : props.styles.todo
  const doingStyle = typeof props.styles.doing === 'undefined' ? {} : props.styles.doing
  const doneStyle = typeof props.styles.done === 'undefined' ? {} : props.styles.done
  const skipStyle = typeof props.styles.skip === 'undefined' ? {} : props.styles.skip
  const prevButtonStyle = typeof props.styles.prevButton === 'undefined' ? {} : props.styles.prevButton
  const nextButtonStyle = typeof props.styles.nextButton === 'undefined' ? {} : props.styles.nextButton

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

  const handleBottomNavNext = () => {
    let newActiveStep = activeStep === steps.length - 1 ? activeStep : activeStep + 1
    setStepState(newActiveStep)
  }
  const handleBottomNavPrevious = () => {
    let newActiveStep = activeStep > 0 ? activeStep - 1 : activeStep
    setStepState(newActiveStep)
  }

  const handleOnClick = (indx: number) => {
    if (!stepIsValid) {
      console.log('Error: Step validation failed')
      return
    }
    if (indx === steps.length - 1 && activeStep === steps.length - 1) {
      setStepState(steps.length)
    } else {
      setStepState(indx)
    }
  }

  const renderTopNav = () =>
    <ol style={{ ...topNavStyle }}>
      {steps.map((s, i) => (
        <li
          style={{ ...topNavStepStyle }}
          onClick={() => handleOnClick(i)}
          key={i}
        >
          {
            stylesState[i] === 'doing' ? <span style={doingStyle}>{s.title ?? i + 1}</span> :
              stylesState[i] === 'done' ? <span style={doneStyle}>{s.title ?? i + 1}</span> :
                stylesState[i] === 'skip' ? <span style={skipStyle}>{s.title ?? i + 1}</span> :
                  <span style={todoStyle}>{s.title ?? i + 1}</span>
          }
        </li>
      ))}
    </ol>

  const renderBottomNav = () => (
    <>
      <button onClick={handleBottomNavPrevious}
              style={ prevButtonStyle }
              disabled={buttonsState.prevDisabled}>
        <span>&#60;</span>
      </button>
      <button onClick={handleBottomNavNext}
              style={buttonsState.nextHidden ? { display: 'none' } : nextButtonStyle}
              disabled={buttonsState.nextDisabled}>
        <span>&#62;</span>
      </button>
    </>
  )

  return (
    <div style={{ ...containerStyle }} >
      {renderTopNav()}
      {steps[activeStep].component}
      {renderBottomNav()}
    </div>
  )
}
