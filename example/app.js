import React from 'react'
import { createRoot } from 'react-dom/client'
import MultiStep from 'react-multistep'
import { StepOne } from './stepOne'
import { StepTwo } from './stepTwo'
import { StepThree } from './stepThree'
import { StepFour } from './stepFour'
import {prevButton, nextButton, containerStyle, topNavStepStyle, topNavStyle, Todo, Doing, Done, Skip} from './css/multistepStyles'

const App = () => (
  <div className='container' style={{maxWidth: '639px', border: '1px'}}>
    <MultiStep prevButton={prevButton}
               nextButton={nextButton}  
               containerStyle={containerStyle} 
               topNavStepStyle={topNavStepStyle}
               topNav={topNavStyle}
               todo={Todo}
               doing={Doing}
               done={Done}
               skip={Skip}
               >
      <StepOne title='Step 1'/>
      <StepTwo title='Step 2'/>
      <StepThree title='Step 3'/>
      <StepFour title='Step 4'/>
    </MultiStep>
    <div className='footer' style={{paddingTop: '6rem', paddingLeft: '2rem', fontSize: 'small'}}>
      Use navigation buttons or click on progress bar for next step. 
      <p>Code is on{' '}
        <a href='https://github.com/Srdjan/react-multistep' target='_blank' rel='noreferrer'>
        github
        </a>
      </p>
    </div>
  </div>
)

const root = createRoot(document.getElementById('root'))
root.render(<App />)
