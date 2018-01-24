'use strict'
import React from 'react'

export class StepFour extends React.Component {
  constructor () {
    super()
    this.state = { 
      checked: '' 
    }
    this.handleCheckedChanged = this.handleCheckedChanged.bind(this);
  }

  handleCheckedChanged (event) {
    this.setState({checked: event.target.checked})
  }

  render () {
    return (
      <div>
        <div className='row'>
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
                //   defaultChecked={this.state.checked}
                checked={this.state.checked}
                onChange={this.handleCheckedChanged}
                autoFocus
              />
              <span> Accept </span>{' '}
            </label>
          </div>
        </div>
      </div>
    )
  }
}
