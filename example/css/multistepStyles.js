const component = { 
  marginTop: '5rem',
  marginBottom: '5rem',
  backgroundColor:'#f1f1f141',
  maxWidth: '960px',
}
const section = { 
  display: 'block',
  justifyContent: 'space-around',
  margin: '4rem',
} 
const topNav = {
  display: 'flex',
  flexDirection: 'row',
  margin: '0',
  paddingBottom: '2.2rem',
  listStyleType: 'none',
}
const topNavStep = {
  color: 'silver',
  cursor: 'pointer',
  width: '25%',
  paddingTop: '4rem',
  paddingRight: '4rem',
  borderBottom: '1px solid silver',
}
const todo = {
  color: 'gray',
}
const doing = {
  color: '#1EAEDB',
}
const prevButton = {
  color: '#1EAEDB',
  backgroundColor: '#f7f7f7',
  border: '0',
  fontSize: '4rem',
  fontWeight: '500',
  padding: '0',
}
const nextButton = {
  color: '#1EAEDB',
  backgroundColor: '#f7f7f7',
  border: '0',
  fontSize: '4rem',
  fontWeight: '500',
  padding: '0',
  float: 'right',   // only difference
}

export const multiStepStyles = {
  component,
  section,
  topNav,
  topNavStep,
  prevButton,
  nextButton,
  todo,
  doing
}