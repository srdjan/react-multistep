import React, { useState, useEffect } from 'react'
import { WizardChrome } from './WizardChrome'

/**
 * @param {import('react-multistep').StepComponentProps<{ title: string }>} props
 */
export const StepOne = ({ signalParent }) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  useEffect(() => {
    signalParent({ isValid: firstName.length > 0 })
  }, [firstName, signalParent])

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
