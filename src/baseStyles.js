const multiStep = { 
  marginRight: '4rem',
  marginBottom: '3rem',
  maxWidth: '960px'
}
const childArea = { 
  display: 'block',
  justifyContent: 'space-around',
  margin: '4rem',
  maxWidth: '960px'
} 
const topNav = {
  paddingTop: '4rem',
  listStyleType: 'none',
  borderBottom: '1px solid silver'
}
const topNavStep = {
  color: 'silver',
  cursor: 'pointer',
}
const todo = {
  color: 'gray'
}
const doing = {
  color: '#1EAEDB'
}

const prevButton = {
  color: '#1EAEDB',
  backgroundColor: 'white',
  border: '0',
  fontSize: '3rem',
  marginLeft: '2rem',
  paddingTop: '4rem',
  float: 'left'    //only difference
}
const nextButton = {
  color: '#1EAEDB',
  backgroundColor: 'white',
  border: '0',
  fontSize: '3rem',
  marginRight: '2rem',
  paddingTop: '4rem',
  float: 'right'   // only difference
}

export const BaseStyles = {
  multiStep,
  childArea,
  topNav,
  topNavStep,
  prevButton,
  nextButton,
  todo,
  doing
}
