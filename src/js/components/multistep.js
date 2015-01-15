var React = require('react/addons')
var expect = require('expect.js')

function navStates(curr, length) {
  var navstates = []
  for (var i=0; i<length; i++) {
    if(i < curr) {
      navstates.push('done')
    }
    else if(i === curr) {
      navstates.push('doing')
    }
    else {
      navstates.push('todo')
    }
  }
  return navstates
}
//::test-start
expect(navStates(0, 4)).to.eql(['doing','todo','todo','todo'])
expect(navStates(1, 4)).to.eql(['done','doing','todo','todo'])
expect(navStates(2, 4)).to.eql(['done','done','doing','todo'])
expect(navStates(3, 4)).to.eql(['done','done','done','doing'])
expect(navStates(4, 4)).to.eql(['done','done','done','done'])
//::test-stop

var Multistep = React.createClass({
  getInitialState() {
    return {
        current: 0,
        navState: navStates(0, this.props.steps.length+1)
      }
  },

  nextNav(curr) {
    this.setState({current: curr})
    this.setState({navState: navStates(curr, this.props.steps.length)})
    console.log(this.state.navState)
  },

  handleOnNav(evt) {
    this.nextNav(evt.target.value)
  },

  handleKeyDown(evt) {
    console.log(evt.which)
    if(evt.which === 13 && this.state.current <= navStates.length) {
     console.log(this.state.current)
      // this.nextNav(this.state.current + 1)
    }
  },

  render() {
    return (
      <div className="container" onKeyDown={this.handleKeyDown}>
        <ol className="progtrckr">
          {this.props.steps.map((s, i) =>
            <li value={i} key={i}
              className={"progtrckr-" + this.state.navState[i]}
              onClick={this.handleOnNav}>
            <em>{i+1}</em>
            <span>{this.props.steps[i].name}</span>
          </li>
          )}
        </ol>
        <form>
          <fieldset>
            {this.props.steps[this.state.current].component}
          </fieldset>
        </form>
      </div>
    )}
})

module.exports = Multistep
