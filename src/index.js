'use strict'
import React, { Component, PropTypes } from 'react'

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
  
  render: function render() {
    var _this = this

    return React.createElement(
      'div',
      { className: 'container', onKeyDown: this.handleKeyDown },
      React.createElement(
        'ol',
        { className: 'progtrckr' }, ' ',
        this.props.steps.map(function (s, i) {
          return React.createElement(
            'li',
            { value: i, key: i,
              className: "progtrckr-" + _this.state.navState.styles[i],
              onClick: _this.handleOnClick },
            React.createElement(
              'em',
              null,
              i + 1
            ),
            React.createElement(
              'span',
              null,
              _this.props.steps[i].name
            )
          )
        })
      ),
      this.props.steps[this.state.compState].component
    )}
})

export { Multistep, getNavStates }
