var React = require('react/addons')

var StepTwo = React.createClass({
  mixins: [ React.addons.LinkedStateMixin ],

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

module.exports = StepTwo
