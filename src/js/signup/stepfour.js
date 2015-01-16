'use strict'
var React = require('react/addons')

var StepFour = React.createClass({
  mixins: [ React.addons.LinkedStateMixin ],

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
            <label><input type="checkbox" autoFocus/><span>Accept</span> </label>
        </div>
      </div>
    </div>
  )}
})

module.exports = StepFour
