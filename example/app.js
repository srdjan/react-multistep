import React, {useState} from 'react'
import { createRoot } from 'react-dom/client'
import MultiStep from 'react-multistep'
import { multiStepStyles } from './css/multistepStyles'
import { StepOne } from './stepOne'
import { StepTwo } from './stepTwo'
import { StepThree } from './stepThree'
import { StepFour } from './stepFour'
function App(){
    const [activestep, setActivestep] = useState(2)
    return (<><div className='container'>
        {/* <MultiStep > */}
    <MultiStep activeStep={activestep} styles={multiStepStyles}>
        <StepOne title='Step 1'/>
        <StepTwo title='Step 2'/>
        <StepThree title='Step 3'/>
        <StepFour title='Step 4'/>
    </MultiStep>

</div>
    <button onClick={()=>{setActivestep(activestep+1)}}></button></>
    )
}



const root = createRoot(document.getElementById('root'))
root.render(<App />)
