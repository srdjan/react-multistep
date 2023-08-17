import React from 'react'
import { createRoot } from 'react-dom/client'
import MultiStep from 'react-multistep'
import { multiStepStyles } from './css/multistepStyles'
import { StepOne } from './stepOne'
import { StepTwo } from './stepTwo'
import { StepThree } from './stepThree'
import { StepFour } from './stepFour'

const App = () => (
  <div className='container'>
    {/* <MultiStep > */}
    <MultiStep styles={multiStepStyles}>
      <StepOne title='Step 1'/>
      <StepTwo title='Step 2'/>
      <StepThree title='Step 3'/>
      <StepFour title='Step 4'/>
    </MultiStep>
  </div>
)

const root = createRoot(document.getElementById('root'))
root.render(<App />)
