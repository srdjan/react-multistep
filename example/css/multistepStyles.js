export const containerStyle = { 
  padding: '5rem',
  marginTop: '5rem' 
}

export const topNavStyle = {
  display: 'flex',
  flexDirection: 'row',
  margin: '0',
  paddingBottom: '2.2rem',
  listStyleType: 'none',
}

export const topNavStepStyle = {
  color: 'silver',
  cursor: 'pointer',
  paddingTop: '4rem',
  paddingRight: '4rem',
  borderBottom: '1px solid silver'
}
export const Todo = {
  color: 'gray',
}
export const Doing = {
  color: '#1EAEDB',
}
export const Done = {
  color: 'green',
}
export const Skip = {   //todo: add to multistep?
  color: 'silver',
}

export const prevButton = {
  title: 'Back', 
  style: {
    color: '#1EAEDB',
    backgroundColor: 'white',
    border: '0',
    fontSize: '4rem',
    fontWeight: '500',
    padding: '0',
    float: 'left'    //only difference
  }
}

export const nextButton = {
  title: 'Forward', 
  style: {
    color: '#1EAEDB',
    backgroundColor: 'white',
    border: '0',
    fontSize: '4rem',
    fontWeight: '500',
    padding: '0',
    float: 'right'   // only difference
  }
}