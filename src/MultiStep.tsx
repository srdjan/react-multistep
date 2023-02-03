import React, { useState, useEffect } from 'react'
import { css, styled, setup } from 'goober'
import { MultiStepPropsBase, Step} from './interfaces'

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

const getStep = (defaultIndex, newIndex, length) => {
    if(newIndex <=  length){
        return newIndex;
    }
    return defaultIndex;
  }

const getTopNavStyles = (indx, length) => {
  const styles: string[] = []
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

const getButtonsState = (indx, length, isValidState) => {
  if (indx > 0 && indx < length - 1) {
    return {
      showPrevBtn: true,
      showNextBtn: isValidState ? true : false
    }
  } else if (indx === 0) {
    return {
      showPrevBtn: false,
      showNextBtn: isValidState ? true : false
    }
  } else {
    return {
      showPrevBtn: true,
      showNextBtn: false
    }
  }
}

export default function MultiStep (props: MultiStepPropsBase) {
  const {children} = props
  let stepsArray = props.steps
  let steps: Step[] = []
  if(!stepsArray && !children){
    throw TypeError("missing children or steps in props");
  }

  const [childIsValid, setChildIsValid] = useState(true)
  const setIsChildInValidState = (isValid) => {
    setChildIsValid(isValid)
  }

  if(children) { 
    let childrenWithProps = React.Children.map(children, (child, index) => {
      return React.cloneElement(child, {
        signalIfValid: setIsChildInValidState
      }) 
    })
    // for backward compatibility we preserve 'steps' with components array:
    steps = childrenWithProps.map(childComponent => ({component: childComponent}))
  }else{
    steps = stepsArray
  }

  const numberOfSteps = steps.length


  const stepCustomStyle = typeof props.stepCustomStyle === 'undefined' ? {} : props.stepCustomStyle
  const showNavButtons = typeof props.showNavigation === 'undefined' ? true : props.showNavigation
  const showTitles = typeof props.showTitles === 'undefined' ? true : props.showTitles

  const directionType = typeof props.direction === 'undefined' ? 'row' : props.direction

  const [activeStep, setActiveStep] = useState(getStep(0, props.activeStep,  numberOfSteps))
  const [stylesState, setStyles] = useState(getTopNavStyles(activeStep, numberOfSteps))
  const [buttonsState, setButtons] = useState(getButtonsState(activeStep, numberOfSteps, childIsValid))
  
  useEffect(() => {
    setButtons(getButtonsState(activeStep, numberOfSteps, childIsValid))
    console.log(`From parent, child in valid state?: ${childIsValid}, button state: ${buttonsState.showNextBtn}`)
  }, [activeStep, childIsValid])
  
  const setStepState = (indx: number, isValidState?: boolean) => {
    setStyles(getTopNavStyles(indx, numberOfSteps))
    setActiveStep(indx < numberOfSteps ? indx : activeStep)
    setButtons(getButtonsState(indx, numberOfSteps, isValidState))
  }

  const next = () => setStepState(activeStep + 1)
  const previous = () => setStepState(activeStep > 0 ? activeStep - 1 : activeStep)

  const handleOnClick = evt => {
    if (! childIsValid) {
      console.log('Child not in valid state - no transition')
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
          style={{...stepCustomStyle,  transform: directionType == 'column' ? 'rotate(90deg)' : 'rotate(0deg)'}}
          onClick={handleOnClick}
          key={i}
          value={i}
        >
          { showTitles && <span>{s.title ??  i + 1}</span> }
        </Li>
      )
    }
  )

  const renderButtonsNav = (show) =>
    show && (
      <div>
        <button onClick={previous}
                disabled={buttonsState.showPrevBtn ? false : true}>
                Prev
        </button>
        <button onClick={next}
                disabled={buttonsState.showNextBtn ? false : true}>
                Next
        </button>
      </div>
    )

  return (
    <div style={{display: 'flex', flexDirection: directionType === 'column' ? 'row' : 'column'}}>
      <Ol className={directionType === 'column' ? ColumnDirection : RowDirection}>{renderTopNav()}</Ol>
      {steps[activeStep].component}
      <div>{renderButtonsNav(showNavButtons)}</div>
    </div>
  )
}
