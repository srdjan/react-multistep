import React, { useState, useEffect } from 'react'
import { WizardChrome } from './WizardChrome'

/**
 * @param {import('react-multistep').StepComponentProps<{ title: string }>} props
 */
export const StepFour = ({ signalParent }) => {
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    signalParent({ isValid: checked })
  }, [checked, signalParent])

  const handleCheckbox = (e) => {
    setChecked(e.target.checked)
  }

  return (
    <WizardChrome>
      <div  className='container'>
        <form className='row'>
        <div className='ten columns terms'>
          <span>By clicking "Accept" I agree that:</span>
          <ul className='docs-terms'>
            <li>
              I have read and accepted the <a href='#'>User Agreement</a>
            </li>
            <li>
              I have read and accepted the <a href='#'>Privacy Policy</a>
            </li>
            <li>I am at least 18 years old</li>
          </ul>
          <span> 
            <label>
              Accept {': '}
            <input
              type='checkbox'
              checked={checked}
              onChange={e => handleCheckbox(e)}
              />
              </label>
          </span>
          <button style={{float: 'right'}} disabled={!checked}>Submit</button>
        </div>
      </form>
      </div>
    </WizardChrome>
  )
}

 
