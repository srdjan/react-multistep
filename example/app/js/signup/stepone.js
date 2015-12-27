'use strict'
import React, { Component, PropTypes } from 'react'

const store = { firstName: '', lastName: '' }

const StepOne = React.createClass ({
    getInitialState() {
        return store
    },
    
    handleFirstNameChanged(event) {
      store.firstName = event.target.value
      this.setState(store)  
    },
    
    handleLastNameChanged(event) {
      store.lastName = event.target.value
      this.setState(store)  
    },
    
    render() {
        return (
        <div>
            <div className="row">
            <div className="six columns">
                <label>First Name</label>
                <input className="u-full-width" placeholder="First Name"
                                                type="text"
                                                onChange={this.handleFirstNameChanged} 
                                                value={this.state.firstName}
                                                autoFocus/>
            </div>
            </div>
            <div className="row">
            <div className="six columns">
                <label>Last Name</label>
                <input className="u-full-width" placeholder="Last Name"
                                                type="text" 
                                                onChange={this.handleLastNameChanged} 
                                                value={this.state.lastName}/>
            </div>
            </div>
        </div>
    )}
})

export { StepOne }
