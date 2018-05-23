'use strict'
import React from 'react'
import ReactDOM from 'react-dom'
import MultiStep from '../src/index'
import { steps } from './src/index'

class App extends React.Component {
  render() {
    return (
      <div className="container">
        <div>
          <MultiStep steps={steps}/>
        </div>
        <div className="container app-footer">
          <h6>Press 'Enter' or click on progress bar for next step.</h6>
           Code is on <a href="https://github.com/Srdjan/react-multistep" target="_blank">github</a>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById("app"))
