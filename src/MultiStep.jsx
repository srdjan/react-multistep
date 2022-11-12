import React, { useState, useEffect } from 'react'
import { css, styled, setup } from 'goober'

setup(React.createElement)

const Ol = styled('ol')`
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
  
export default function MultiStep (props) {
  const { activeComponentClassName, inactiveComponentClassName, stepCustomStyle } = props
  const showNav =
    typeof props.showNavigation === 'undefined' ? true : props.showNavigation
  const showTitles =
    typeof props.showTitles === 'undefined' ? true : props.showTitles

  const [activeStep] = useState(getStep(0, props.activeStep,  props.steps.length));
  const [stylesState, setStyles] = useState(getTopNavStyles(activeStep, props.steps.length))
  const [compState, setComp] = useState(activeStep)
  const [buttonsState, setButtons] = useState(getButtonsState(activeStep, props.steps.length))

  // (1) register child event handler function
  props.steps.map((step, index) => {
    step.component.validationChange = handleChildValidationEvent
    console.log(`registered: ${index}`)
  })

  // (2) https://lifeincoding.com/how-to-disable-button-with-css/
  const handleChildValidationEvent = evt => { 

  }

  const getStep = (defaultIndex, newIndex, length) => {
    if(newIndex <=  length){
        return newIndex;
    }
    return defaultIndex;
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
        showPreviousBtn: true,
        showNextBtn: true
      }
    } else if (indx === 0) {
      return {
        showPreviousBtn: false,
        showNextBtn: true
      }
    } else {
      return {
        showPreviousBtn: true,
        showNextBtn: false
      }
    }
  }
  
  useEffect(() => {
    console.log('Index changed: ', props.activeStep);
    setStepState(props.activeStep);
  }, [props.activeStep]);
  
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

  const renderSteps = () =>
    props.steps.map((s, i) => {
      if (stylesState[i] === 'todo') {
        return (
          <Li
            className={Todo}
            style={stepCustomStyle}
            onClick={handleOnClick}
            key={i}
            value={i}
          >
            { showTitles && <span>{s.title ??  i + 1}</span> }
          </Li>
        )
      } else if (stylesState[i] === 'doing') {
        return (
          <Li
            className={Doing}
            style={stepCustomStyle}
            onClick={handleOnClick}
            key={i}
            value={i}
          >
            { showTitles && <span>{s.title ??  i + 1}</span> }
          </Li>
        )
      } else {
        return (
          <Li
            className={Done}
            style={stepCustomStyle}
            onClick={handleOnClick}
            key={i}
            value={i}
          >
            { showTitles && <span>{s.title ??  i + 1}</span> }
          </Li>
        )
      }
    })

  const renderNav = (show) =>
    show && (
      <div>
        <button
          style={buttonsState.showPreviousBtn ? props.prevStyle : { display: 'none' }}
          onClick={previous}
        >
          Prev
        </button>

        <button
          style={buttonsState.showNextBtn ? props.nextStyle : { display: 'none' }}
          onClick={next}
        >
          Next
        </button>
      </div>
    )

  return (
    <div>
      <Ol>{renderSteps()}</Ol>
      {inactiveComponentClassName
        ? props.steps.map((step, index) => {
            const className = index === compState ? activeComponentClassName : inactiveComponentClassName
            return (<div className={className} key={index}>{step.component}</div>)
          })
        : <div>{props.steps[compState].component}</div>}
      <div>{renderNav(showNav)}</div>
    </div>
  )
}
