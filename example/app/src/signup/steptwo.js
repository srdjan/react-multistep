'use strict'
import React, { Component, PropTypes } from 'react'

const store = { email: '', emailConfirm: '' }

const StepTwo = React.createClass ({
    getInitialState() {
        return store
    },
    
    handleEmailChanged(event) {
      store.email = event.target.value
      this.setState(store)  
    },
    
    handleEmailConfirmChanged(event) {
      store.emailConfirm = event.target.value
      this.setState(store)  
    },

    render() {
        return (
        <div>
            <div className="row">
            <div className="six columns">
                <label>Your email</label>
                <input className="u-full-width required" placeholder="test@mailbox.com"
                                                type="email"
                                                onChange={this.handleEmailChanged} 
                                                value={this.state.email}
                                                autoFocus/>
            </div>
            </div>
            <div className="row">
            <div className="six columns">
                <label>Confirm email</label>
                <input className="u-full-width" placeholder="Confirm email"
                                                type="email"
                                                onChange={this.handleEmailConfirmChanged} 
                                                value={this.state.emailConfirm}/>
            </div>
            </div>
        </div>
    )}
})

export { StepTwo }