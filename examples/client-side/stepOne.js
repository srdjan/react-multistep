import React, { useState, useEffect } from 'react'
import { WizardChrome } from './WizardChrome'

export const StepOne = (props) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  useEffect(() => {
    props.signalParent?.({ isValid: firstName.length > 0 })
  }, [firstName, props.signalParent])

  const handleFirstNameChange = (val) => {
    setFirstName(val)
  }

  const handleLastNameChange = (val) => {
    setLastName(val)
  }

  const Required = () =>
    firstName.length === 0 ? (
      <span style={{ fontSize: '1rem', color: 'red' }}>&nbsp;[ Required ]</span>
    ) : null

  return (
    <WizardChrome>
      <div className='container u-full-width'>
      <div className='row'>
        <div className='six columns'>
          <label>
            First Name<Required />
          </label>
          <input
            className='u-full-width'
            placeholder='First Name'
            type='text'
            onChange={(e) => handleFirstNameChange(e.target.value)}
            value={firstName}
            required
          />
        </div>
      </div>
      <div className='row'>
        <div className='six columns'>
          <label>Last Name</label>
          <input
            className='u-full-width'
            placeholder='Last Name'
            type='text'
            onChange={(e) => handleLastNameChange(e.target.value)}
            value={lastName}
          />
        </div>
      </div>
    </div>
    </WizardChrome>
  )
}
