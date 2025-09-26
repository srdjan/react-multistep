import React, { useState, useEffect } from 'react'

export const StepTwo = (props) => {
  const [passwdRequired, setPasswordRequired] = useState(true)
  const [email, setEmail] = useState('')
  const [emailConfirm, setEmailConfirm] = useState('')

  useEffect(() => {
    props.signalParent?.({ isValid: true })
  }, [passwdRequired, props.signalParent])

  const handleCheckbox = (e) => {
    setPasswordRequired(e.target.checked)
  }

  return (
    <div className='container'>
      <div className='row'>
        <div className='six columns'>
          <label>Your email</label>
          <input
            className='u-full-width required'
            placeholder='test@mailbox.com'
            type='email'
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
      </div>
      <div className='row'>
        <div className='six columns'>
          <label>Confirm email</label>
          <input
            className='u-full-width'
            placeholder='Confirm email'
            type='email'
            onChange={(e) => setEmailConfirm(e.target.value)}
            value={emailConfirm}
          />
        </div>
      </div>
      <label>
        <input
          type='checkbox'
          checked={passwdRequired}
          onChange={(e) => handleCheckbox(e)}
        />
        <span> Password required </span>
      </label>
    </div>
  )
}
