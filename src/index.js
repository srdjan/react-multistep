'use strict'
import React, { Component, PropTypes } from 'react'

export function getNavStates(indx, length) {
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

export const Multistep = React.createClass({
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
  
  handleKeyDown(evt) {
    if(evt.which === 13) {
      this.next()
    }
  },
  
  handleOnClick(evt) {
    if(evt.target.value  === (this.props.steps.length-1) &&
       this.state.compState === (this.props.steps.length-1))     {
      this.setNavState(this.props.steps.length)
    }
    else {
      this.setNavState(evt.target.value)
    }
  },

  next() {
    this.setNavState(this.state.compState + 1)
  },

  previous() {
    if (this.state.compState > 0) {
        this.setNavState(this.state.compState - 1)
    }
  },
  
  render() {
    return (
      <div className="container" onKeyDown={this.handleKeyDown}>
        <ol className="progtrckr"> {
          this.props.steps.map((s, i) =>
            <li value={i} key={i}
                            className={"progtrckr-" + this.state.navState.styles[i]}
                            onClick={this.handleOnClick}>
                <em>{i+1}</em>
                <span>{this.props.steps[i].name}</span>
            </li>
          )
        }
        </ol>
        { this.props.steps[this.state.compState].component }
      </div>
    )}
})

export { Multistep, getNavStates }
