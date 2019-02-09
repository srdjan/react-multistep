import React, {useState} from 'react'

const getStyles = (indx, length) => {
  let styles = []
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

const getButtonsState = (currentStep, stepsLength) => {
  if (currentStep > 0 && currentStep < stepsLength - 1) {
    return {
      showPreviousBtn: true,
      showNextBtn: true
    }
  } else if (currentStep === 0) {
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

const getCompState = (state, nextStep, stepsLength) => {
  if (nextStep < stepsLength) {
    return {value: nextStep}
  }
  return {value: state}
}

export default function MultiStep(props) {
  const [stylesState, setStylesState] = useState(getStyles(0, props.steps.length))
  const [compState, setCompState] = useState({value: 0})
  const [buttonsState, setButtonsState] = useState(getButtonsState(0, props.steps.length))
  
  function setNavState(next) {
    setStylesState(getStyles(next, props.steps.length))
    setCompState(getCompState(compState.value, next, props.steps.length))
    setButtonsState(getButtonsState(next, props.steps.length))
  }

  function next() {
    setNavState(compState.value + 1)
  }
  
  function previous() {
    if (compState.value > 0) {
      setNavState(compState.value - 1)
    }
  }

  function handleKeyDown(evt) {
    if (evt.which === 13) {
      next(props.steps.length)
    }
  }

  function handleOnClick(evt) {
    if (evt.currentTarget.value === props.steps.length - 1 && compState.value === props.steps.length - 1) {
      setNavState(props.steps.length)
    } else {
      setNavState(evt.currentTarget.value)
    }
  }

  function renderSteps() {
    return props.steps.map((s, i) => (
      <li
        className={'progtrckr-' + stylesState[i]}
        onClick={handleOnClick}
        key={i}
        value={i}
      >
        <em>{i + 1}</em>
        <span>{props.steps[i].name}</span>
      </li>
    ))
  }

  return (
      <div className='container' onKeyDown={handleKeyDown}>
        <ol className='progtrckr'>
          {renderSteps()}
        </ol>
        {props.steps[compState.value].component}
        <div style={props.showNavigation ? {} : { display: 'none' }}>
          <button
            style={buttonsState.showPreviousBtn ? {} : { display: 'none' }}
            onClick={previous}
          >
            Previous
          </button>

          <button
            style={buttonsState.showNextBtn ? {} : { display: 'none' }}
            onClick={next}
          >
            Next
          </button>
        </div>
      </div>
  )
}

MultiStep.defaultProps = {
  showNavigation: true
}
