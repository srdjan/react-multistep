var React = require('react/addons')

var StepThree = React.createClass({
  mixins: [ React.addons.LinkedStateMixin ],

  getInitialState() {
    return {
            password: '123',
            passwordConfirm: ''
          }
  },

  render() {
    return (
        <div>
          <div className="row">
            <div className="six columns">
              <label>Password</label>
              <input className="u-full-width required" placeholder="Password"
                                              type="password"
                                              valueLink={this.linkState('password')}
                                              autoFocus/>
            </div>
          </div>
          <div className="row">
            <div className="six columns">
              <label>Confirm password</label>
              <input className="u-full-width" placeholder="Confirm Password"
                                              type="password"
                                              valueLink={this.linkState('passwordConfirm')}/>
            </div>
          </div>
        </div>
  )}
})

module.exports = StepThree
