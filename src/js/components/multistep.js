var React = require('react/addons')
var expect = require('expect.js')

function navStates(indx, length) {
  var navstates = {current: indx, styles: []}
  for (var i=0; i<length; i++) {
    if(i < indx) {
      navstates.styles.push('done')
    }
    else if(i === indx) {
      navstates.styles.push('doing')
    }
    else {
      navstates.styles.push('todo')
    }
  }
  return navstates
}
expect(navStates(0, 4).styles).to.eql(['doing','todo','todo','todo'])
expect(navStates(1, 4).styles).to.eql(['done','doing','todo','todo'])
expect(navStates(2, 4).styles).to.eql(['done','done','doing','todo'])
expect(navStates(3, 4).styles).to.eql(['done','done','done','doing'])
expect(navStates(4, 4).styles).to.eql(['done','done','done','done'])

var Multistep = React.createClass({
  getInitialState() {
    return {
        compState: 0,
        navState: navStates(0, this.props.steps.length)
      }
  },

  nextNav(nextComp, nextNav) {
    if(nextComp < this.props.steps.length) {
      this.setState({compState: nextComp})
    }
    if(nextComp <= this.props.steps.length) {
      this.setState({navState: navStates(nextNav, this.props.steps.length)})
    }
  },

  handleOnClick(evt) {
    if(this.state.compState === this.props.steps.length-1 &&
       this.state.navState.current === this.props.steps.length-1) {
      this.nextNav(evt.target.value, evt.target.value+1)
    }
    else {
      this.nextNav(evt.target.value, evt.target.value)
    }
  },

  handleKeyDown(evt) {
    if(evt.which === 13) {
      this.nextNav(this.state.navState.current + 1, this.state.navState.current + 1)
    }
  },

  render() {
    return (
      <div className="container" onKeyDown={this.handleKeyDown}>
        <ol className="progtrckr">{
          this.props.steps.map((s, i) =>
          <li value={i} key={i}
                        className={"progtrckr-" + this.state.navState.styles[i]}
                        onClick={this.handleOnClick}>
            <em>{i+1}</em>
            <span>{this.props.steps[i].name}</span>
          </li>
          )}
        </ol>
        {this.props.steps[this.state.compState].component}
      </div>
    )}
})

module.exports = Multistep
