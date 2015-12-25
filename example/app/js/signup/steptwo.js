'use strict'
import React, { Component, PropTypes } from 'react'
import LinkedState from 'react-addons-linked-state-mixin'

export default React.createClass ({
    mixins: [LinkedState],

    getInitialState() {
        return {
                email: '',
                emailConfirm: ''
            }
    },

    render() {
        return (
        <div>
            <div className="row">
            <div className="six columns">
                <label>Your email</label>
                <input className="u-full-width required" placeholder="test@mailbox.com"
                                                type="email"
                                                valueLink={this.linkState('email')}
                                                autoFocus/>
            </div>
            </div>
            <div className="row">
            <div className="six columns">
                <label>Confirm email</label>
                <input className="u-full-width" placeholder="Confirm email"
                                                type="email"
                                                valueLink={this.linkState('emailConfirm')}/>
            </div>
            </div>
        </div>
    )}
})

