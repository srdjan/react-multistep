import React, { useState, useEffect } from 'react'
import { css, styled, setup } from 'goober'
import { MultiStepPropsBase, NavButton, Step } from './interfaces'

setup(React.createElement)

const Ol = styled('ol')`
  display: flex;
  margin: 0;
  padding-bottom: 2.2rem;
  list-style-type: none;
`
const Li = styled('li')`
  display: inline-block;
  text-align: center;
  line-height: 4.8rem;
  padding: 0 0.7rem;
  cursor: pointer;
  min-width: 6rem;

  color: silver;
  border-bottom: 2px solid silver;

 span{
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
 }

  &:hover,
  &:before {
    color: #0FA0CE;
  }
  &:after {
    content: "\\00a0\\00a0";
  }   
  &:before {
    position: relative;
    float: left;
    left: 50%;
    width: 1.3em;
    line-height: 1.4em;
    border-radius: 50%;
    bottom: -3.99rem;
  }
`
const Todo = css`
  &:before {
    content: "\u039F";
    color: silver;
    background-color: white;
  }
`
const Doing = css`
  &:before {
    content: "\u2022";
    color: white;
    background-color: #33C3F0;  
  }
`
const Done = css`
  &:before {
    content: "\u2713";
    color: white;
    background-color: #33C3F0;
  }
`

const RowDirection = css`
  flex-direction: row;
`

const ColumnDirection = css`
  margin-top: 4.8rem;
  flex-direction: column;
`

const getStep = (defaultIndex: number, newIndex: number, length: number): number => {
  if (newIndex <= length) {
    return newIndex;
  }
  return defaultIndex;
}

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
  } else if (activeStep > 0 && activeStep < length - 1) {
    console.log(`ActiveStep > 0, isValid: ${stepIsValid}`)
    return {
      prevDisabled: false,
      nextDisabled: !stepIsValid
    }
  } else {
    console.log('No way')
  }
}

export default function MultiStep(props: MultiStepPropsBase) {
  const { children } = props

  let stepsArray = props.steps

  if (!stepsArray && !children) {
    throw TypeError("missing children or steps in props")
  }

  const [stepIsValid, setStepIsValid] = useState(false)
  const stepStateChanged = (isValid: boolean) => {
    console.log(`stepStateChanged invoked, isValid: ${isValid}`)
    setStepIsValid(prev => isValid)
  }

  let steps: Step[] = []
  if (children) {
    let childrenWithProps = React.Children.map(children, (child, index) => {
      return React.cloneElement(child, {
        signalParent: stepStateChanged
      })
    })
    // for backward compatibility we preserve 'steps' with components array:
    steps = childrenWithProps.map(childComponent => (
      {
        title: childComponent.props.title,
        component: childComponent
      })
    )
  }
  else {
    steps = stepsArray
  }

  const showTitles = typeof props.showTitles === 'undefined' ? true : props.showTitles
  const numberOfSteps = steps.length
  const stepCustomStyle = typeof props.stepCustomStyle === 'undefined' ? {} : props.stepCustomStyle
  
  const showNavButtons = typeof props.showNavigation === 'undefined' ? true : props.showNavigation
  const prevButton: NavButton = typeof props.prevButton === 'undefined' ? {} : props.prevButton
  const nextButton: NavButton = typeof props.nextButton === 'undefined' ? {} : props.nextButton
  
  const directionType = typeof props.direction === 'undefined' ? 'row' : props.direction
  const [activeStep, setActiveStep] = useState(getStep(0, props.activeStep, numberOfSteps))
  const [stylesState, setStyles] = useState(getTopNavStyles(activeStep, numberOfSteps))
  const [buttonsState, setButtonsState] = useState({
    prevDisabled: true,
    nextDisabled: true
  })

  useEffect(() => {
    setButtonsState(getButtonsState(activeStep, numberOfSteps, stepIsValid))
  }, [activeStep, stepIsValid])

  const setStepState = (activeStep: number) => {
    setStyles(getTopNavStyles(activeStep, numberOfSteps))
    setActiveStep(activeStep < numberOfSteps ? activeStep : activeStep)
  }

  const next = () => {
    let newActiveStep = activeStep === steps.length - 1 ? activeStep : activeStep + 1
    setStepState(newActiveStep) 
    console.log(`Next, ActiveStep: ${newActiveStep}`)
  }
  const previous = () => {
    let newActiveStep = activeStep > 0 ? activeStep -1 : activeStep
    setStepState(newActiveStep)
    console.log(`Prev, ActiveStep: ${newActiveStep}`)
  }

  const handleOnClick = (evt: { currentTarget: { value: number } }) => {
    if (!stepIsValid) {
      console.log('Error: Step validation failed')
      return
    }

    if (
      evt.currentTarget.value === numberOfSteps - 1 &&
      activeStep === numberOfSteps - 1
    ) {
      setStepState(numberOfSteps)
    } else {
      setStepState(evt.currentTarget.value)
    }
  }

  const renderTopNav = () =>
    steps.map((s, i) => {
      return (
        <Li
          className={
            stylesState[i] === 'todo' ? Todo :
              stylesState[i] === 'doing' ? Doing :
                Done
          }
          style={{ ...stepCustomStyle, transform: directionType == 'column' ? 'rotate(90deg)' : 'rotate(0deg)' }}
          onClick={handleOnClick}
          key={i}
          value={i}
        >
          {showTitles && <span>{s.title ?? i + 1}</span>}
        </Li>
      )
    })

  const renderButtonsNav = (show: boolean) =>
    show && (
      <div>
        <button onClick={previous}
          style={prevButton?.style}
          disabled={buttonsState.prevDisabled}>
          {prevButton && prevButton.title ? <>{prevButton.title}</> : <>Prev</>}
        </button>
        <button onClick={next}
          style={nextButton?.style}
          disabled={buttonsState.nextDisabled}>
          {nextButton && nextButton.title ? <>{nextButton.title}</> : <>Next</>}
        </button>
      </div>
    )

  return (
    <div style={{ display: 'flex', flexDirection: directionType === 'column' ? 'row' : 'column' }}>
      <Ol className={directionType === 'column' ? ColumnDirection : RowDirection}>
        {renderTopNav()}
      </Ol>
      {steps[activeStep].component}
      <div>{renderButtonsNav(showNavButtons)}</div>
    </div>
  )
}
