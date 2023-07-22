import React, { useState, useEffect } from 'react'

export const StepFour = (props) => {
  const [checked, setChecked] = useState(false)
  const [confirmationMsg, setConfirmationMsg] = useState('')

  useEffect(() => {
    props.signalParent({isValid: checked, title: 'Submit', action: handleSubmit})
  }, [checked])

  const handleSubmit = () => {
    setConfirmationMsg(() => 'Submitted & Confirmed')
  }

  const handleCheckbox = (e) => {
    setChecked(e.target.checked)
  }

  return (
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
          <label>
            <input
              type='checkbox'
              checked={checked}
              onChange={e => handleCheckbox(e)}
              autoFocus
            />
            <span> Accept </span>{' '}
          </label>
          <span style={{color: 'green'}}>{confirmationMsg}</span>
        </div>
      </form>
  )
}

 
