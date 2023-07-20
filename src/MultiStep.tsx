import React, { useState, useEffect } from 'react'
import { styled, setup } from 'goober'
import { MultiStepPropsBase, NavButton } from './interfaces'

setup(React.createElement)

const Ol = styled('ol')`
  display: flex;
  margin: 0;
  padding-bottom: 2.2rem;
  list-style-type: none;
  flex-direction: row;
`
const Li = styled('li')`
  display: inline-block;
  text-align: center;
  padding-top: 4rem;
  padding-left: 1rem;
  padding-right: 1rem;
  cursor: pointer;
  min-width: 6rem;
  border-bottom: 1px solid silver; 
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
const ToDo = styled('span')`
  &:before {
    content: "\u039F";
    color: silver;
    background-color: white;
  }
`
const Doing = styled('span')`
  color: #9b4dca;
  &:before {
    content: "\u2022";
    color: white;
    background-color: #33C3F0;  
  }
  @media (max-width: 360px) {
    position: absolute;
    top: 1rem;
    left: 2rem;
  }    
`
const Done = styled('span')`
  color: silver;
  &:before {
    content: "\u2713";
    color: white;
    background-color: #33C3F0;
  }
  @media (max-width: 360px) {
    display: none;
  }
`

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
    console.log(`ActiveStep === 0, isValid: ${stepIsValid}`)
    return {
      prevDisabled: true,
      nextDisabled: !stepIsValid
    }
  } else if (activeStep > 0 && activeStep <= (length - 1)) {
    console.log(`ActiveStep > 0, isValid: ${stepIsValid}`)
    return {
      prevDisabled: false,
      nextDisabled: !stepIsValid
    }
  } else {
    console.log(`Error: activeStep: ${activeStep} < length: ${length} `)
  }
}

export default function MultiStep(props: MultiStepPropsBase) {
  let { children } = props
  if (!children) {
    throw TypeError("Error: No steps to show")
  }

  const [stepIsValid, setStepIsValid] = useState(false)
  const stepStateChanged = (isValid: boolean) => {
    console.debug(`stepStateChanged invoked, isValid: ${isValid}`)
    setStepIsValid(() => isValid)
  }

  children = React.Children.map(children, child => React.cloneElement(child, { signalParent: stepStateChanged }))
  let steps = children.map(child => ({
    title: child.props.title,
    component: child
  }))
  
  const containerStyle = typeof props.containerStyle === 'undefined' ? {} : props.containerStyle
  const topNavStyle = typeof props.topNav === 'undefined' ? {} : props.topNav
  const topNavStepStyle = typeof props.topNavStep === 'undefined' ? {} : props.topNavStep
  const todoStyle = typeof props.todo === 'undefined' ? {} : props.todo
  const doingStyle = typeof props.doing === 'undefined' ? {} : props.doing
  const doneStyle = typeof props.done === 'undefined' ? {} : props.done

  const prevButton: NavButton = typeof props.prevButton === 'undefined' ? {} : props.prevButton
  const nextButton: NavButton = typeof props.nextButton === 'undefined' ? {} : props.nextButton
  
  //todo: update docs
  // 1) removed stepsArray
  // 2) removed const directionType = typeof props.direction === 'undefined' ? 'row' : props.direction
  // 3) removed const showTitles
  // ... 
  // more like, redo docs from scratch :)

  const [activeStep, setActiveStep] = useState(0)
  const [stylesState, setStylesState] = useState(getTopNavStyles(activeStep, steps.length))
  const [buttonsState, setButtonsState] = useState({
    prevDisabled: true,
    nextDisabled: true
  })

  useEffect(() => {
    setButtonsState(getButtonsState(activeStep, steps.length, stepIsValid))
  }, [activeStep, stepIsValid])

  const setStepState = (activeStep: number) => {
    setStylesState(getTopNavStyles(activeStep, steps.length))
    setActiveStep(activeStep < steps.length ? activeStep : activeStep)
  }

  const next = () => {
    let newActiveStep = activeStep === steps.length - 1 ? activeStep : activeStep + 1
    setStepState(newActiveStep)
    console.log(`Next, ActiveStep: ${newActiveStep}`)
  }
  const previous = () => {
    let newActiveStep = activeStep > 0 ? activeStep - 1 : activeStep
    setStepState(newActiveStep)
    console.log(`Prev, ActiveStep: ${newActiveStep}`)
  }

  const handleOnClick = (evt: { currentTarget: { value: number } }) => {
    if (!stepIsValid) {
      console.log('Error: Step validation failed')
      return
    }

    if (
      evt.currentTarget.value === steps.length - 1 &&
      activeStep === steps.length - 1
    ) {
      setStepState(steps.length)
    } else {
      setStepState(evt.currentTarget.value)
    }
  }

  const renderTopNav = () =>
    steps.map((s, i) => {
      return (
        <li
          style={{ ...topNavStepStyle }}
          onClick={handleOnClick}
          key={i}
        >
          {
            stylesState[i] === 'doing' ?
              <Doing style={doingStyle}>{s.title ?? i + 1}</Doing> :
            stylesState[i] === 'done' ?
              <Done style={doneStyle}>{s.title ?? i + 1}</Done> :
              <ToDo style={todoStyle}>{s.title ?? i + 1}</ToDo>
          }
        </li>
      )
    })

  const renderButtonsNav = () => (
    <>
      <button onClick={previous}
        style={prevButton?.style}
        disabled={buttonsState.prevDisabled}>
          {prevButton && prevButton.title ? prevButton.title : 'Prev'}
      </button>
      <button onClick={next}
        style={nextButton?.style}
        disabled={buttonsState.nextDisabled}>
          {nextButton && nextButton.title ? nextButton.title : 'Next'}
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
