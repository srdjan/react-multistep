import React, { useState, useEffect } from 'react'

export const StepThree = (props) => {
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  useEffect(() => {
    props.signalParent({isValid: true, nextStep: 0})
  }, [])

  return (
    <div>
      <div className='row'>
        <div className='six columns'>
          <label>Password</label>
          <input
            className='u-full-width required'
            placeholder='Password'
            type='password'
            onChange={e => setPassword(e.target.value)}
            value={password}
            autoFocus
          />
        </div>
      </div>
      <div className='row'>
        <div className='six columns'>
          <label>Confirm password</label>
          <input
            className='u-full-width'
            placeholder='Confirm Password'
            type='password'
            onChange={e => setPasswordConfirm(e.target.value)}
            value={passwordConfirm}
          />
        </div>
      </div>
    </div>
  )
}
