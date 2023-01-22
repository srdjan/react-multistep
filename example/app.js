import React from 'react'
import ReactDOM from 'react-dom'
import MultiStep from './dist/index'
import StepOne from './stepOne'
import StepTwo from './stepTwo'
import StepThree from './stepThree'
import StepFour from './stepFour'

// custom styles
const prevStyle = { background: '#33c3f0' }
const nextStyle = { background: '#33c3f0' }

const App = () => (
  <div className='container'>
    <MultiStep activeStep={0} prevStyle={prevStyle} nextStyle={nextStyle}>
      <StepOne />
      <StepTwo />
      <StepThree />
      <StepFour />
    </MultiStep>
    <div className='app-footer'>
      <h6>Use navigation buttons or click on progress bar for next step.</h6>
      Code is on{' '}
      <a href='https://github.com/Srdjan/react-multistep' target='_blank' rel='noreferrer'>
        github
      </a>
    </div>
  </div>
)

ReactDOM.render(<App />, document.getElementById('root'))
