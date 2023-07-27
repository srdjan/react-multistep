import React, { useState, useEffect } from 'react'
import { MultiStepProps, ChildState } from './interfaces'

const getTopNavState = (activeStep: number, length: number): string[] => {
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

const getBottomNavState = (activeStep: number, length: number, stepIsValid: boolean) => {
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

export default function MultiStep(props: MultiStepProps) {
  let { children } = props
  if (!children) {
    throw TypeError("Error: Application has no children Components configured")
  }

  const [activeChild, setActiveChild] = useState(0)
  const [nextChild, setNextChild] = useState(0)
  const [childIsValid, setChildIsValid] = useState(false)

  const containerStyle = typeof props.styles.container === 'undefined' ? {} : props.styles.container
  const topNavStyle = typeof props.styles.topNav === 'undefined' ? {} : props.styles.topNav
  const topNavStepStyle = typeof props.styles.topNavStep === 'undefined' ? {} : props.styles.topNavStep
  const todoStyle = typeof props.styles.todo === 'undefined' ? {} : props.styles.todo
  const doingStyle = typeof props.styles.doing === 'undefined' ? {} : props.styles.doing
  const doneStyle = typeof props.styles.done === 'undefined' ? {} : props.styles.done
  const skipStyle = typeof props.styles.skip === 'undefined' ? {} : props.styles.skip
  const prevButtonStyle = typeof props.styles.prevButton === 'undefined' ? {} : props.styles.prevButton
  const nextButtonStyle = typeof props.styles.nextButton === 'undefined' ? {} : props.styles.nextButton

  const childStateChanged = (childState: ChildState) => {
    console.debug(`Child state changed, isValid: ${childState?.isValid}, next: ${childState?.next}`)
    if (childState.isValid !== undefined) setChildIsValid(() => childState.isValid)
    if (childState.next) setNextChild(childState.next)
  }
  children = React.Children.map(children, child => React.cloneElement(child, { signalParent: childStateChanged }))

  const [topNavState, setTopNavState] = useState(getTopNavState(activeChild, children.length))
  const [bottomNavState, setBottomNavState] = useState(getBottomNavState(activeChild, children.length, childIsValid))

  useEffect(() => {
    setBottomNavState(getBottomNavState(activeChild, children.length, childIsValid))
    setTopNavState(getTopNavState(activeChild, children.length))
  }, [activeChild, childIsValid])

  const handleBottomNavNext = () => {
    let newActiveStep = activeChild === children.length - 1 ? activeChild : activeChild + 1
    setActiveChild(newActiveStep + nextChild)
  }
  const handleBottomNavPrevious = () => {
    let newActiveStep = activeChild > 0 ? activeChild - 1 : activeChild
    setActiveChild(newActiveStep + nextChild)
  }

  const handleTopNavOnClick = (indx: number) => {
    if (!childIsValid) {
      console.log('Error: Child validation failed')
      return
    }
    if (indx === children.length - 1 && activeChild === children.length - 1) {
      setActiveChild(children.length + nextChild)
    } else {
      setActiveChild(indx + nextChild)
    }
  }

  const renderTopNav = () =>
    <ol style={{ ...topNavStyle }}>
      {children.map((c, i) => (
        <li
          style={{ ...topNavStepStyle }}
          onClick={() => handleTopNavOnClick(i)}
          key={i}
        >
          {
            topNavState[i] === 'doing' ? <span style={doingStyle}>{c.props.title ?? i + 1}</span> :
              topNavState[i] === 'done' ? <span style={doneStyle}>{c.props.title ?? i + 1}</span> :
                topNavState[i] === 'skip' ? <span style={skipStyle}>{c.props.title ?? i + 1}</span> :
                  <span style={todoStyle}>{c.props.title ?? i + 1}</span>
          }
        </li>
      ))}
    </ol>

  const renderBottomNav = () =>
    <>
      <button onClick={handleBottomNavPrevious}
              style={ prevButtonStyle }
              disabled={bottomNavState.prevDisabled}>
        <span>&#60;</span>
      </button>
      <button onClick={handleBottomNavNext}
              style={bottomNavState.nextHidden ? { display: 'none' } : nextButtonStyle}
              disabled={bottomNavState.nextDisabled}>
        <span>&#62;</span>
      </button>
    </>

  return (
    <div style={{ ...containerStyle }} >
      {renderTopNav()}
      {children[activeChild]}
      {renderBottomNav()}
    </div>
  )
}
