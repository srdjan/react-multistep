import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import MultiStep from 'react-multistep'
import { StepOne } from './stepOne'
import { StepTwo } from './stepTwo'
import { StepThree } from './stepThree'
import { StepFour } from './stepFour'

function App() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <div className='container'>
      <MultiStep
        activeStep={activeStep}
        onStepChange={setActiveStep}
      >
        <StepOne title='Step 1' />
        <StepTwo title='Step 2' />
        <StepThree title='Step 3' />
        <StepFour title='Step 4' />
      </MultiStep>
    </div>
  )
}

const root = createRoot(document.getElementById('root'))
root.render(<App />)
