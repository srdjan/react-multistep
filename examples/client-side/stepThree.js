import React, { useState, useEffect } from 'react'
import { WizardChrome } from './WizardChrome'

/**
 * @param {import('react-multistep').StepComponentProps<{ title: string }>} props
 */
export const StepThree = ({ signalParent }) => {
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [requirePassword, setRequirePassword] = useState(true)

  useEffect(() => {
    const trimmedPassword = password.trim()
    const isValid = !requirePassword || (trimmedPassword.length > 0 && trimmedPassword === passwordConfirm.trim())
    signalParent({ isValid })
  }, [password, passwordConfirm, requirePassword, signalParent])

  return (
    <WizardChrome>
      <div className='container'>
      <div className='row'>
        <div className='six columns'>
          <label>Password</label>
          <input
            className='u-full-width required'
            placeholder='Password'
            type='password'
            onChange={e => setPassword(e.target.value)}
            value={password}
            disabled={!requirePassword}
            required={requirePassword}
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
            disabled={!requirePassword}
            required={requirePassword}
          />
        </div>
      </div>
      <label>
        <input
          type='checkbox'
          checked={requirePassword}
          onChange={(e) => setRequirePassword(e.target.checked)}
        />
        <span> Password required </span>
      </label>
      </div>
    </WizardChrome>
  )
}
