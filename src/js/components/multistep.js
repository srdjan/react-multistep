'use strict'
const React = require('react/addons')
const expect = require('expect.js')

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
expect(getNavStates(0, 3).styles).to.eql(['doing','todo','todo'])
expect(getNavStates(1, 3).styles).to.eql(['done','doing','todo'])
expect(getNavStates(2, 3).styles).to.eql(['done','done','doing'])
expect(getNavStates(3, 3).styles).to.eql(['done','done','done'])

expect(getNavStates(0, 4).styles).to.eql(['doing','todo','todo','todo'])
expect(getNavStates(1, 4).styles).to.eql(['done','doing','todo','todo'])
expect(getNavStates(2, 4).styles).to.eql(['done','done','doing','todo'])
expect(getNavStates(3, 4).styles).to.eql(['done','done','done','doing'])
expect(getNavStates(4, 4).styles).to.eql(['done','done','done','done'])

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
      this.setState({navState: getNavStates(next, this.props.steps.length)})
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

module.exports = Multistep
