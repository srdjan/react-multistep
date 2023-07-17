import React, { useState, useEffect } from 'react'

export default (props) => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [stepState, setStepState] = useState(false)

  const validate = val => {
    console.log(`prevFirstName: ${firstName}, newFirstName: ${val}`)
    let prevFirstName = firstName
    setFirstName(val)

    if(prevFirstName.length === 0 && val.length === 1) {
      setStepState(true)
      props.signalParent(stepState)
      return
    }
    
    if(prevFirstName.length ===1 && val.length == 0) {
      setStepState(false)
      props.signalParent(stepState)
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
