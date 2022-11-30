import React from 'react'
import ReactDOM from 'react-dom'
import MultiStep from './index'
import StepOne from './stepOne'
import StepTwo from './stepTwo'
import StepThree from './stepThree'
import StepFour from './stepFour'

const props = {
  config: {
    activeStep: 2
  },
  styles: {
    titles: {
      display: 'inline',
      color: 'black'
    },
    breadcrumbs: {
      display: 'none',
      color: 'white'
    },
    main: {
      background: 'white'
    },
    navButtons: {
      display: 'inline',
      background: 'green',
      border: 'red',
      color: 'orange',
      disabled: {
        background: 'silver',
        border: 'black',
        color: 'gray',
        cursor: 'not-allowed | no-drop'
      }
    }
  },
  steps: [
    { title: 'Step 1', component: <StepOne /> },
    { title: 'Step 2', component: <StepTwo /> },
    { title: 'Step 3', component: <StepThree /> },
    { title: 'Step 4', component: <StepFour /> }
  ]
}

// todo: signal 'next' valid/not-valid state from Steps

const App = () => (
  <div className='container'>
    <MultiStep
      config={props.config}
      styles={props.styles}
      steps={props.steps}
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
