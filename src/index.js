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

var Multistep = React.createClass({
  getInitialState(props) {
    props= props || this.props;
    return {
        compState: props.activeStep || 0,
        navState: getNavStates(props.activeStep, props.steps.length)
      }
  },

  componentWillReceiveProps(nextProps){
    //Asumme the steps components haven't changed and just browse them
    if(nextProps.steps.length == this.props.steps.length){
      this.setNavState(nextProps.activeStep);
    } else{
    //Restart state completely
      this.setState(this.getInitialState(nextProps));
    }
  },

  setNavState(next) {
    this.setState({navState: getNavStates(next, this.props.steps.length)})
    if(next < this.props.steps.length && next > -1) {
      this.setState({compState: next});
    } else{
      console.warn("Attempt to browse out of the Multistep range");
    }
  },

  handleKeyDown(evt) {
    if(evt.which === 13) {
      this.next()
    }
  },

  handleOnClick(evt) {
    if(isFinite(evt.target.value)){
      if(evt.target.value  === (this.props.steps.length-1) &&
         this.state.compState === (this.props.steps.length-1))     {
        this.setNavState(this.props.steps.length);
      }
      else {
        this.setNavState(evt.target.value);
      }
      this.props.onActiveStepChange(evt.target.value);
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
      { className: 'container', onKeyDown: this.props.handleKeyDown && this.handleKeyDown },
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

Multistep.propTypes = {
  activeStep: React.PropTypes.number,
  handleKeyDown: React.PropTypes.bool,
  onActiveStepChange: React.PropTypes.func
}

Multistep.defaultProps = {
  activeStep: 0,
  handleKeyDown: true,
  onActiveStepChange: function(newStep){}
}
export {Multistep}


