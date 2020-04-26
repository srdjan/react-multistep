import React, { useState } from 'react'

export default () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

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
    </div>
  )
}
