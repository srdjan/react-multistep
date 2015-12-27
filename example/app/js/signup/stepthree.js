'use strict'
import React, { Component, PropTypes } from 'react'

const store = { password: '123', passwordConfirm: '' }

const StepThree = React.createClass ({
    getInitialState() {
        return store
    },
    
    handlePasswordChanged(event) {
      store.password = event.target.value
      this.setState(store)  
    },
    
    handlePasswordConfirmChanged(event) {
      store.passwordConfirm = event.target.value
      this.setState(store)  
    },

    render() {
        return (
            <div>
            <div className="row">
                <div className="six columns">
                <label>Password</label>
                <input className="u-full-width required" placeholder="Password"
                                                type="password"
                                                onChange={this.handlePasswordChanged} 
                                                value={this.state.password}
                                                autoFocus/>
                </div>
            </div>
            <div className="row">
                <div className="six columns">
                <label>Confirm password</label>
                <input className="u-full-width" placeholder="Confirm Password"
                                                type="password"
                                                onChange={this.handlePasswordConfirmChanged} 
                                                value={this.state.passwordConfirm}/>
                </div>
            </div>
            </div>
    )}
})

export { StepThree }