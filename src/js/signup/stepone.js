const React = require('react/addons')

const StepOne = React.createClass({
  mixins: [ React.addons.LinkedStateMixin ],

  getInitialState() {
    return {
            firstName: '',
            lastName: ''
          }
  },
  render() {
    return (
      <div>
        <div className="row">
          <div className="six columns">
            <label>First Name</label>
            <input className="u-full-width" placeholder="First Name"
                                            type="text"
                                            valueLink={this.linkState('firstName')}
                                            autoFocus/>
          </div>
        </div>
        <div className="row">
          <div className="six columns">
            <label>Last Name</label>
            <input className="u-full-width" placeholder="Last Name"
                                            type="text" valueLink={this.linkState('lastName')}/>
          </div>
        </div>
      </div>
  )}
})

module.exports = StepOne
