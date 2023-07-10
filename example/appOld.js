import React from 'react'
import {createRoot} from 'react-dom/client'
import MultiStep from 'react-multistep'
import StepOne from './stepOne'
import StepTwo from './stepTwo'
import StepThree from './stepThree'
import StepFour from './stepFour'

const steps = [
  { title: 'step one', component: <StepOne /> },
  { title: 'step two', component: <StepTwo /> },
  { title: 'step three', component: <StepThree /> },
  { title: 'step four', component: <StepFour /> }
]

// custom styles
const prevStyle = { background: '#33c3f0' }
const nextStyle = { background: '#33c3f0' }

const App = () => (
  <div className='container'>
    <MultiStep activeStep={0} steps={steps} prevStyle={prevStyle} nextStyle={nextStyle} />
    <div className='app-footer'>
      <h6>Use navigation buttons or click on progress bar for next step.</h6>
      Code is on{' '}
      <a href='https://github.com/Srdjan/react-multistep' target='_blank' rel='noreferrer'>
        github
      </a>
    </div>
  </div>
)

const root = createRoot(document.getElementById('root'));
root.render(<App />)