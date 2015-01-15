var React = require('react')
var Multistep = require('./components/multistep')

var StepOne = require('./signup/stepone')
var StepTwo = require('./signup/steptwo')
var StepThree = require('./signup/stepthree')
var StepFour = require('./signup/stepfour')

var steps = [
  {name: 'StepOne', component: <StepOne/>},
  {name: 'StepTwo', component: <StepTwo/>},
  {name: 'StepThree', component: <StepThree/>},
  {name: 'StepFour', component: <StepFour/>}
]

var App = React.createClass({
  render() {
    return (
      <div className="container">
        <Multistep steps={steps}/>
      </div>
    )
  }
})

React.render(<App/>, document.body)
