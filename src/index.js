import React from 'react'

const getNavStates = (indx, length) => {
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
  return { current: indx, styles: styles }
}

const checkNavState = (currentStep, stepsLength) => {
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

export default class MultiStep extends React.Component {
  state = {
    showPreviousBtn: false,
    showNextBtn: true,
    compState: 0,
    navState: getNavStates(0, this.props.steps.length)
  }

  setNavState = next => {
    this.setState({
      navState: getNavStates(next, this.props.steps.length)
    })
    if (next < this.props.steps.length) {
      this.setState({ compState: next })
    }
    this.setState(checkNavState(next, this.props.steps.length))
  }

  handleKeyDown = evt => {
    if (evt.which === 13) {
      this.next()
    }
  }

  handleOnClick = evt => {
    if (
      evt.currentTarget.value === this.props.steps.length - 1 &&
      this.state.compState === this.props.steps.length - 1
    ) {
      this.setNavState(this.props.steps.length)
    } else {
      this.setNavState(evt.currentTarget.value)
    }
  }

  next = () => {
    this.setNavState(this.state.compState + 1)
  }

  previous = () => {
    if (this.state.compState > 0) {
      this.setNavState(this.state.compState - 1)
    }
  }

  getClassName = (className, i) => {
    return className + '-' + this.state.navState.styles[i]
  }

  renderSteps = () => {
    return this.props.steps.map((s, i) => (
      <li
        className={this.getClassName('progtrckr', i)}
        onClick={this.handleOnClick}
        key={i}
        value={i}
      >
        <em>{i + 1}</em>
        <span>{this.props.steps[i].name}</span>
      </li>
    ))
  }

  render () {
    return (
      <div className='container' onKeyDown={this.handleKeyDown}>
        <ol className='progtrckr'>
          {this.renderSteps()}
        </ol>
        {this.props.steps[this.state.compState].component}
        <div style={this.props.showNavigation ? {} : { display: 'none' }}>
          <button
            style={this.state.showPreviousBtn ? {} : { display: 'none' }}
            onClick={this.previous}
          >
            Previous
          </button>

          <button
            style={this.state.showNextBtn ? {} : { display: 'none' }}
            onClick={this.next}
          >
            Next
          </button>
        </div>
      </div>
    )
  }
}

MultiStep.defaultProps = {
  showNavigation: true
}
