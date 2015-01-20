'use strict'
const React = require('react/addons')

function getNavStates(indx, length) {
  let styles = []
  for (let i=0; i<length; i++) {
    if(i < indx) {
      styles.push('done')
    }
    else if(i === indx) {
      styles.push('doing')
    }
    else {
      styles.push('todo')
    }
  }
  return { current: indx, styles: styles }
}

const Multistep = React.createClass({
  getInitialState() {
    return {
        compState: 0,
        navState: getNavStates(0, this.props.steps.length)
      }
  },

  setNavState(next) {
    this.setState({navState: getNavStates(next, this.props.steps.length)})
    if(next < this.props.steps.length) {
      this.setState({compState: next})
    }
  },

  handleOnClick(evt) {
    if(evt.target.value  === this.props.steps.length-1 &&
       this.state.compState === this.props.steps.length-1) {
      this.setNavState(this.props.steps.length)
    }
    else {
      this.setNavState(evt.target.value)
    }
  },

  handleKeyDown(evt) {
    if(evt.which === 13) {
      this.setNavState(this.state.compState + 1)
    }
  },

  render() {
    return (
      <div className="container" onKeyDown={this.handleKeyDown}>
        <ol className="progtrckr">{
          this.props.steps.map((s, i) =>
          <li value={i} key={i}
                        className={"progtrckr-" + this.state.navState.styles[i]}
                        onClick={this.handleOnClick}>
            <em>{i+1}</em>
            <span>{this.props.steps[i].name}</span>
          </li>
          )}
        </ol>
        {this.props.steps[this.state.compState].component}
      </div>
    )}
})

module.exports = {
  Multistep: Multistep,
  getNavStates: getNavStates
}
