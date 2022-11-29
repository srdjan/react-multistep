import React from 'react'
import ReactDOM from 'react-dom'
import MultiStep from './index'
import StepOne from './stepOne'
import StepTwo from './stepTwo'
import StepThree from './stepThree'
import StepFour from './stepFour'

const steps = [
  { title: 'Step 1', component: <StepOne /> },
  { title: 'Step 2', component: <StepTwo /> },
  { title: 'Step 3', component: <StepThree /> },
  { title: 'Step 4', component: <StepFour /> }
]

// custom styles
const navButtonStyle = { background: 'gray', color: 'white' }
// const customStyle = {
//   color: 'red',
//   background: 'orange',
//   border: 'black'
// }
// customStyle = { customStyle }
// navButtonStyle = { navButtonStyle }
// showButtonNav

const App = () => (
  <div className='container'>
    <MultiStep
      showTitles
      steps={steps}
      activeStep={2}
      showButtonNav
    />
    <div className='app-footer'>
      <h6>Press 'Enter' or click on progress bar for next step.</h6>
      Code is on{' '}
      <a href='https://github.com/Srdjan/react-multistep' target='_blank' rel='noreferrer'>
        github
      </a>
    </div>
  </div>
)

ReactDOM.render(<App />, document.getElementById('root'))
