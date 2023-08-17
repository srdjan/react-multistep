import React, { useState, useEffect } from 'react'
import { MultiStepProps, ChildState, MultiStepStyles } from './interfaces'
import { BaseStyles } from './baseStyles'

const getTopNavStyles = (activeStep: number, length: number): string[] => {
  const styles: string[] = []
  for (let i = 0; i < length; i++) {
    i === activeStep ? styles.push('doing') : styles.push('todo')
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
  return {
    prevDisabled: false,
    nextDisabled: !stepIsValid,
    hideLast: true
  }
}

export default function MultiStep(props: MultiStepProps) {
  let { children } = props
  if (!children) throw TypeError("Error: Application has no children Components configured")

  const styles = typeof props.styles === 'undefined' ? BaseStyles as MultiStepStyles : props.styles
  const [activeChild, setActive] = useState(0)
  const [childIsValid, setChildIsValid] = useState(false)
  const [topNavState, setTopNavState] = useState(getTopNavStyles(activeChild, children.length))
  const [bottomNavState, setBottomNavState] = useState(getBottomNavState(activeChild, children.length, childIsValid))

  useEffect(() => {
    setTopNavState(getTopNavStyles(activeChild, children.length))
    setBottomNavState(getBottomNavState(activeChild, children.length, childIsValid))
  }, [activeChild, childIsValid])

  const childStateChanged = (childState: ChildState) => setChildIsValid(() => childState.isValid)  
  children = React.Children.map(children, child => React.cloneElement(child, { signalParent: childStateChanged }))

  const handleNext = () => setActive(activeChild === children.length - 1 ? activeChild : activeChild + 1)

  const handlePrevious = () => setActive(activeChild > 0 ? activeChild - 1 : activeChild)

  const handleOnClick = (i: number) => childIsValid ? setActive(i) : console.log('Error: Invalid state')

  const renderTopNav = () =>
    <ol style={styles.topNav}>
      {children.map((c, i) =>
        <li style={styles.topNavStep} onClick={() => handleOnClick(i)} key={i}>
          { topNavState[i] === 'doing' ? <span style={styles.doing}>{c.props.title ?? i + 1}</span> :
                                         <span style={styles.todo}>{c.props.title ?? i + 1}</span> }
        </li>
      )}
    </ol>

  const renderBottomNav = () =>
    <div style={styles.section} >
      <button onClick={handlePrevious}
              style={styles.prevButton}
              disabled={bottomNavState.prevDisabled}>
        <span>&#60;</span>
      </button>
      <button onClick={handleNext}
              style={bottomNavState.hideLast ? { display: 'none' } : styles.nextButton}
              disabled={bottomNavState.nextDisabled}>
        <span>&#62;</span>
      </button>
    </div>

  return (
    <div style={styles.component}>
      {renderTopNav()}
      <div style={styles.section}>
        {children[activeChild]}
      </div>
        {renderBottomNav()}
    </div>
  )
}
