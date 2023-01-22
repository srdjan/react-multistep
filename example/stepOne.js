import React, { useState } from 'react'

export default (props) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [checked, setChecked] = useState(false)

  const signalParent = (isValid) => {
    setChecked(isValid)
    props.signalIfValid(isValid)
  }

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
          checked={checked}
          onChange={e => signalParent(e.target.checked)}
          autoFocus
        />
        <span> Accept </span>{' '}
      </label>
    </div>
  )
}
