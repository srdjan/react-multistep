import React from 'react'
import { createRoot } from 'react-dom/client'
import MultiStep from 'react-multistep'
import StepOne from './stepOne'
import StepTwo from './stepTwo'
import StepThree from './stepThree'
import StepFour from './stepFour'

const prevButtonStyle = {
                          title: 'Back', 
                          style:{ borderColor: 'blue' }
                        }
const topNavStyle = {
                      display: "flex",
                      margin: "0",
                      paddingBottom: "2.2rem",
                      listStyleType: "none",
                      flexDirection: "row"
                  }

const App = () => (
  <div className='container'>
    <MultiStep prevButtonStyle={prevButtonStyle} topNavProp={topNavStyle}>
      <StepOne title='Step 1'/>
      <StepTwo title='Step 2'/>
      <StepThree title='Step 3'/>
      <StepFour title='Step 4'/>
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

const root = createRoot(document.getElementById('root'))
root.render(<App />)
