import React, { useState, useEffect } from 'react'

export default (props) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  //- using checkbox state to signal valid/not valid form state here:
  const [isValidState, setIsValidState] = useState(false)
  const signalParent = (isValid) => {
    setIsValidState(isValid)
    props.signalIfValid(isValid)
  }
  useEffect(() => {
    console.log(`From Child, child in valid state?: ${isValidState}`)
    signalParent(isValidState)
  }, [])

  return (
    <div>
      <div className='row'>
        <div className='six columns'>
          <label>First Name</label>
          <input
            className='u-full-width'
            placeholder='First Name'
            type='text'
            onChange={e => setFirstName(e.target.value)}
            value={firstName}
            autoFocus
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
            onChange={e => setLastName(e.target.value)}
            value={lastName}
          />
        </div>
      </div>
      <label>
        <input
          type='checkbox'
          checked={isValidState}
          onChange={e => signalParent(e.target.checked)}
          autoFocus
        />
        <span> Valid State? </span>{' '}
      </label>
    </div>
  )
}
