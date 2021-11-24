import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { css, styled, setup } from 'goober'
setup(React.createElement)

const Ol = styled('ul')`
  margin: 0;
  list-style-type: none;
`

const LiClass = props => css`


  color: ${props.state === 'todo' ? 'silver' : 'black'};
;

`

const getTopNavStyles = (indx, length) => {
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

export default function MultiStep(props) {
  let showNav = true
  if (props.showNavigation) showNav = props.showNavigation

  let prevStyle = {}
  if (props.prevStyle) prevStyle = props.prevStyle

  let nextStyle = {}
  if (props.nextStyle) nextStyle = props.nextStyle

  const [stylesState, setStyles] = useState(getTopNavStyles(0, props.steps.length))
  const [compState, setComp] = useState(0)
  const [buttonsState, setButtons] = useState(getButtonsState(0, props.steps.length))

  const setStepState = (indx) => {
    setStyles(getTopNavStyles(indx, props.steps.length))
    setComp(indx < props.steps.length ? indx : compState)
    setButtons(getButtonsState(indx, props.steps.length))
  }

  const next = () => setStepState(compState + 1)
  const previous = () => setStepState(compState > 0 ? compState - 1 : compState)
  const handleKeyDown = evt => evt.which === 13 ? next(props.steps.length) : {}

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
    props.steps.map((s, i) => (
      <li
        className={LiClass({ state: stylesState[i] })}
        onClick={handleOnClick}
        key={i}
        value={i}
      >
        <Link to="#"></Link>
        {/* <span>{i+1}</span> */}
      </li>
    ))

  const renderNav = (show) =>
    show && (
      <div className="actions clearfix">
        <ul role="menu" aria-label="Pagination">
          <li style={buttonsState.showPreviousBtn ? props.prevStyle : { display: 'none' }}
            onClick={previous}> 
            <Link to="#">Back</Link>
          </li>
          <li style={buttonsState.showNextBtn ? props.nextStyle : { display: 'none' }}
            onClick={next}> 
            <Link to="#">Next</Link>
          </li>
        </ul>
      </div>
    )

  return (
    <form onKeyDown={handleKeyDown} className="ms-form-wizard style1-wizard" id="default-wizard">
      <Ol role="tablist">{renderSteps()}</Ol>
      <div className="content">{props.steps[compState].component}</div>
      <div>{renderNav(showNav)}</div>
    </form>
  )
}
