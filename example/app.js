import React from 'react'
import { createRoot } from 'react-dom/client'
import MultiStep from 'react-multistep'
import StepOne from './stepOne'
import StepTwo from './stepTwo'
import StepThree from './stepThree'
import StepFour from './stepFour'

const containerStyle = { 
  padding: '2rem',
  marginTop: '5rem' 
}

const topNavStyle = {
  display: 'flex',
  margin: '0',
  paddingBottom: '2.2rem',
  listStyleType: 'none',
  flexDirection: 'row'
}
const topNavStepStyle = {
  color: '#9b4dca',
  cursor: 'pointer',
  paddingTop: '1rem',
  paddingRight: '4rem',
  borderBottom: '1px solid silver'
}

const Todo = {
}
const Doing = {
}
const Done = {
}

const prevButton = {
  title: 'Back', 
  style:{ borderColor: 'blue' }
}
const nextButton = {
  title: 'Forward', 
  style:{ borderColor: 'yellow', marginLeft: '1rem' }
}

const App = () => (
  <div className='container'>
    <MultiStep prevButton={prevButton}
               nextButton={nextButton}  
               containerStyle={containerStyle} 
               topNavStep={topNavStepStyle}
               topNav={topNavStyle}>
      <StepOne title='Step 1'/>
      <StepTwo title='Step 2'/>
      <StepThree title='Step 3'/>
      <StepFour title='Step 4'/>
    </MultiStep>
    <div className='app-footer'>
      Use navigation buttons or click on progress bar for next step. Code is on{' '}
      <a href='https://github.com/Srdjan/react-multistep' target='_blank' rel='noreferrer'>
        github
      </a>
    </div>
  </div>
)

const root = createRoot(document.getElementById('root'))
root.render(<App />)
