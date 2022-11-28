import React, { useState, useEffect, cloneElement, Component } from 'react'
import { css, styled, setup } from 'goober'
import { prefix } from 'goober/prefixer'
setup(React.createElement, prefix)

const Multistep = styled('div')`
  border-radius: ${(props) => props.size}px;
  background: ${(props) => props.background};
`
const Breadcrumbs = styled('ol')`
  margin: 0;
  padding-bottom: 2.2rem;
  list-style-type: none;
`
const NavButtons = styled('ol')`
  margin: 0;
  list-style-type: none;
`
const Li = styled('li')`
  display: inline-block;
  text-align: center;
  line-height: 4.8rem;
  padding: 0 0.7rem;
  min-width: 5.5rem;
  cursor: pointer;

  color: silver;
  border-bottom: 2px solid silver;

  &:hover,
  &:before {
    color: #0FA0CE;
  }
  &:after {
    content: "\\00a0\\00a0";
  }   
  span {
    padding: 0 1.5rem;
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
const NavButton = css`
  background: #33C3F0;
  border-color: silver;
  color: white; 
`
const NavButtonDisabled = css`
  background: silver;
  border-color: gray;
  color: gray; 
  cursor: no-drop;
`

const getStep = (newIndex, length) => {
  if (newIndex <= length && newIndex > 0) {
    return newIndex-1;
  }
  return 0;
}

const getTopNavStyles = (indx, length) => {
  const styles = []
  for (let i = 0; i < length; i++) {
    if (i < indx) {
      styles.push('done')
    } else if (i === indx) {
      styles.push('doing')
    } else {
      styles.push('todo')
    }
  }
  return styles
}

const getButtonsState = (indx, length) => {
  if (indx > 0 && indx < length - 1) {
    return {
      showPrevious: true,
      showNext: true
    }
  } else if (indx === 0) {
    return {
      showPrevious: false,
      showNext: true
    }
  } else {
    return {
      showPrevious: true,
      showNextBtn: false
    }
  }
}

// cloneElement(
//   step,
//   { nextButton: "next!" }
// )

export default function MultiStep(props) {
  // todo: stepCustomStyle needs to be incorporated in goober styles
  // const stepCustomStyle = typeof props.stepCustomStyle === 'undefined' ? {} : props.stepCustomStyle
  const showTitles = typeof props.showTitles === 'undefined' ? false : true
  const showButtonNav = typeof props.showButtonNav === 'undefined' ? false : true
  const navButtonStyle = typeof props.navButtonStyle === 'undefined' ? { background: 'white', color: 'red' } : props.prevStyle
  
  const [activeStep, _] = useState(getStep(props.activeStep, props.steps.length));
  const [stylesState, setStyles] = useState(getTopNavStyles(activeStep, props.steps.length))
  const [compState, setComp] = useState(activeStep)
  const [buttonsState, setButtons] = useState(getButtonsState(activeStep, props.steps.length))

  useEffect(() => {
    setStepState(activeStep)
    //setNextNavButton(props.nextDisabled)
  }, [activeStep])

  const setStepState = (indx) => {
    setStyles(getTopNavStyles(indx, props.steps.length))
    setComp(indx < props.steps.length ? indx : compState)
    setButtons(getButtonsState(indx, props.steps.length))
  }

  const next = () => setStepState(compState + 1)
  const previous = () => setStepState(compState > 0 ? compState - 1 : compState)

  const handleOnClick = evt => {
    if (
      evt.currentTarget.value === props.steps.length - 1 &&
      compState === props.steps.length - 1
    ) {
      setStepState(props.steps.length)
    } else {
      setStepState(evt.currentTarget.value)
    }
  }

  const renderBreadcrumbs = () =>
    props.steps.map((step, i) => {
        return (
          <Li
            className={
              stylesState[i] === 'todo' ? Todo :
                stylesState[i] === 'doing' ? Doing : Done
            }
            onClick={handleOnClick}
            key={i}
            value={i}
          >
            {showTitles && <span>{step.title ?? i + 1}</span>}
          </Li>
        )
      }
    )

  const renderNavButtons = (show) =>
    show && (
      <>
        <button
          className={buttonsState.showPrevious ? NavButton : NavButtonDisabled}
          onClick={previous}
        >
          Prev
        </button>

        <button
          className={buttonsState.showNext ? NavButton : NavButtonDisabled}
          onClick={next}
        >
          Next
        </button>
      </>
    )

  return (
    <Multistep background={'orange'}>
      <Breadcrumbs>{renderBreadcrumbs()}</Breadcrumbs>
      {props.steps[compState].component}
      <NavButtons>{renderNavButtons(showButtonNav)}</NavButtons>
    </Multistep>
  )
}
