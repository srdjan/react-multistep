'use strict'
import React, { Component, PropTypes } from 'react'
import LinkedState from 'react-addons-linked-state-mixin'

export default React.createClass ({
	mixins: [LinkedState],

    render() {
        return (
        <div>
            <div className="row">
                <div className="ten columns terms">
                    <span>By clicking "Accept" I agree that:</span>
                    <ul className="docs-terms">
                        <li>I have read and accepted the <a href="#">User Agreement</a></li>
                        <li>I have read and accepted the <a href="#">Privacy Policy</a></li>
                        <li>I am at least 18 years old</li>
                    </ul>
                    <label><input type="checkbox" autoFocus/><span> Accept </span> </label>
                </div>
            </div>
        </div>
  )}
})

