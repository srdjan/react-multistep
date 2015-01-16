'use strict'
const React = require('react')
const Multistep = require('./components/multistep')

const StepOne = require('./signup/stepone')
const StepTwo = require('./signup/steptwo')
const StepThree = require('./signup/stepthree')
const StepFour = require('./signup/stepfour')

const steps = [
  {name: 'StepOne', component: <StepOne/>},
  {name: 'StepTwo', component: <StepTwo/>},
  {name: 'StepThree', component: <StepThree/>},
  {name: 'StepFour', component: <StepFour/>}
]

const App = React.createClass({
  render() {
    return (
      <div className="container">
        <div>
          <Multistep steps={steps}/>
        </div>
        <div className="container app-footer">
          <h6>Press 'Enter' or click on progress bar for next step.</h6>
           Code is on <a href="https://github.com/Srdjan/react-multistep" target="_blank">github</a>
        </div>
      </div>
    )
  }
})

React.render(<App/>, document.body)
