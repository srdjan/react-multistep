import React from 'react'
import StepOne from './stepOne'
import StepTwo from './stepTwo'
import StepThree from './stepThree'
import StepFour from './stepFour'

const steps = 
    [
      {name: 'Name', component: <StepOne/>},
      {name: 'Email', component: <StepTwo/>},
      {name: 'Password', component: <StepThree/>},
      {name: 'Agreement', component: <StepFour/>}
    ]

export { steps }