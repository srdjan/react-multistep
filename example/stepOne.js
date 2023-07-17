import React, { useState, useEffect } from 'react'

export default (props) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  useEffect(() => {
    props.signalParent(false)
  }, [])

  const validate = (val) => {
    let prevFirstName = firstName
    setFirstName(val)

    if(prevFirstName.length === 0 && val.length === 1) {
      props.signalParent(true)
      return
    }
    
    if(prevFirstName.length === 1 && val.length == 0) {
      props.signalParent(false)
      return
    }
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
            onChange={e => validate(e.target.value)}
            value={firstName}
            autoFocus
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
            onChange={e => setLastName(e.target.value)} 
            value={lastName}
          />
        </div>
      </div>
    </div>)
}
