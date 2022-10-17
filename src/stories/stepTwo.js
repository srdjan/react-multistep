import React, { useState } from 'react'

export default () => {
  const [email, setEmail] = useState('')
  const [emailConfirm, setEmailConfirm] = useState('')

  return (
    <div>
      <div className='row'>
        <div className='six columns'>
          <label>Your email</label>
          <input
            className='u-full-width required'
            placeholder='test@mailbox.com'
            type='email'
            onChange={e => setEmail(e.target.value)}
            value={email}
            autoFocus
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
            onChange={e => setEmailConfirm(e.target.value)}
            value={emailConfirm}
          />
        </div>
      </div>
    </div>
  )
}
