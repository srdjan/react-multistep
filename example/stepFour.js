import React, { useState, useEffect } from 'react'

export const StepFour = (props) => {
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    props.signalParent({isValid: true, title: 'Submit me', nextStep: 0, action: handleSubmit})
  }, [])

  const handleSubmit = () => {
    console.log('Submitted !')
    // const resp = await axios.get(`https://api.github.com/users/${state.companyName}`);
    // props.onSubmit(resp.data);
    // setState({ companyName: '' });
  }

  return (
      <form className='row'>
        <div className='ten columns terms'>
          <span>By clicking "Accept" I agree that:</span>
          <ul className='docs-terms'>
            <li>
              I have read and accepted the <a href='#'>User Agreement</a>
            </li>
            <li>
              I have read and accepted the <a href='#'>Privacy Policy</a>
            </li>
            <li>I am at least 18 years old</li>
          </ul>
          <label>
            <input
              type='checkbox'
              checked={checked}
              onChange={e => setChecked(e.target.checked)}
              autoFocus
            />
            <span> Accept </span>{' '}
          </label>
        </div>
      </form>
  )
}

 
