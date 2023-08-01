import React, { useState, useEffect } from 'react'
import { MultiStepProps, ChildState, MultiStepStyles } from './interfaces'
import { BaseStyles } from './multiStepBaseStyles'

const getTopNavState = (activeStep: number, length: number): string[] => {
  const styles: string[] = []
  for (let i = 0; i < length; i++) {
    if (i === activeStep) {
      styles.push('doing')
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
      hideLast: false
    }
  }
  if (activeStep > 0 && activeStep < (length - 1)) {
    return {
      prevDisabled: false,
      nextDisabled: !stepIsValid,
      hideLast: false
    }
  }
  console.log(`stepIsValid: ${stepIsValid}`)
  return {
    prevDisabled: false,
    nextDisabled: !stepIsValid,
    hideLast: true
  }
}

export default function MultiStep(props: MultiStepProps) {
  let { children } = props
  if (!children) {
    throw TypeError("Error: Application has no children Components configured")
  }

  const [activeChild, setActiveChild] = useState(0)
  const [childIsValid, setChildIsValid] = useState(false)

  const styles = typeof props.styles === 'undefined' ? BaseStyles as MultiStepStyles: props.styles
  const containerStyle = styles.multiStep
  const topNavStyle = styles.topNav
  const topNavStepStyle = styles.topNavStep
  const todoStyle = styles.todo
  const doingStyle = styles.doing
  const prevButtonStyle = styles.prevButton
  const nextButtonStyle = styles.nextButton

  const [topNavState, setTopNavState] = useState(getTopNavState(activeChild, children.length))
  const [bottomNavState, setBottomNavState] = useState(getBottomNavState(activeChild, children.length, childIsValid))

  useEffect(() => {
    setTopNavState(getTopNavState(activeChild, children.length))
    setBottomNavState(getBottomNavState(activeChild, children.length, childIsValid))
  }, [activeChild, childIsValid])

  const childStateChanged = (childState: ChildState) => {
    console.debug(`childStateChanged - isValid: ${childState?.isValid}`)
    setChildIsValid(() => childState.isValid)
  }  
  children = React.Children.map(children, child => React.cloneElement(child, { signalParent: childStateChanged }))

  const handleBottomNavNext = () => setActiveChild(activeChild === children.length - 1 ? activeChild : activeChild + 1)

  const handleBottomNavPrevious = () => setActiveChild(activeChild > 0 ? activeChild - 1 : activeChild)

  const handleTopNavOnClick = (indx: number) => {
    if (!childIsValid) {
      console.log('Error: Child not in Valid state')
      return
    }
    if (indx === children.length - 1 && activeChild === children.length - 1) {
      setActiveChild(children.length)
    } else {
      setActiveChild(indx)
    }
  }

  const renderTopNav = () =>
    <ol style={topNavStyle}>
      {children.map((c, i) => (
        <li
          style={topNavStepStyle}
          onClick={() => handleTopNavOnClick(i)}
          key={i}>
          {
            topNavState[i] === 'doing' ? <span style={doingStyle}>{c.props.title ?? i + 1}</span> :
                                         <span style={todoStyle}>{c.props.title ?? i + 1}</span>
          }
        </li>
      ))}
    </ol>

  const renderBottomNav = () =>
    <>
      <button onClick={handleBottomNavPrevious}
              style={prevButtonStyle }
              disabled={bottomNavState.prevDisabled}>
        <span>&#60;</span>
      </button>
      <button onClick={handleBottomNavNext}
              style={bottomNavState.hideLast ? { display: 'none' } : nextButtonStyle}
              disabled={bottomNavState.nextDisabled}>
        <span>&#62;</span>
      </button>
    </>

  return (
    <div style={containerStyle}>
      {renderTopNav()}
      {children[activeChild]}
      {renderBottomNav()}
    </div>
  )
}
