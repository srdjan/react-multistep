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
        <div>
          <Multistep steps={steps}/>
        </div>
        <footer className="app-footer">
          <h6>Code is on <a href="https://github.com/Srdjan/react-multistep" target="_blank">Github</a></h6>
        </footer>
      </div>
    )
  }
})

React.render(<App/>, document.body)
