var React = require('react')

var StepThree = React.createClass({
  mixins: [ React.addons.LinkedStateMixin ],
  getInitialState() {
    return { startDate: new Date() }
  },
  render() {
    return (
      <div>
        <h5>Here is Content 3</h5>
        <h6>Press 'Enter' or click on enumerated steps...</h6>
        <input className="six columns" type="date" min="2015-01-01"
                                     valueLink={this.linkState('startDate')}
                                     autoFocus/>
      </div>
  )}
})

module.exports = StepThree
