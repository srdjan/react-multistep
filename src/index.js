import React, {useState} from 'react'

const getNavStyles = (indx, length) => {
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

const getCompState = (state, indx, length) => {
  if (indx < length) {
    return {value: indx}
  }
  return {value: state}
}

export default function MultiStep(props) {
  const [stylesState, setStyles] = useState(getNavStyles(0, props.steps.length))
  const [compState, setComp] = useState({value: 0})
  const [buttonsState, setButtons] = useState(getButtonsState(0, props.steps.length))
  
  function setState(indx) {
    setStyles(getNavStyles(indx, props.steps.length))
    setComp(getCompState(compState.value, indx, props.steps.length))
    setButtons(getButtonsState(indx, props.steps.length))
  }

  function next() {
    setState(compState.value + 1)
  }
  
  function previous() {
    if (compState.value > 0) {
      setState(compState.value - 1)
    }
  }

  function handleKeyDown(evt) {
    if (evt.which === 13) {
      next(props.steps.length)
    }
  }

  function handleOnClick(evt) {
    if (evt.currentTarget.value === props.steps.length - 1 && compState.value === props.steps.length - 1) {
      setState(props.steps.length)
    } else {
      setState(evt.currentTarget.value)
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
