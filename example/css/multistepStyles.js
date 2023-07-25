export const containerStyle = { 
  padding: '2rem',
  marginTop: '5rem' 
}

export const topNavStyle = {
  display: 'flex',
  margin: '0',
  paddingBottom: '2.2rem',
  listStyleType: 'none',
  flexDirection: 'row',
  after: {
    content:'\"\\\\00a0\\\\00a0\"'
  },
  before: {
    color: '#0FA0CE',
    position: 'relative',
    float: 'left',
    left: '50%',
    width: '1.3em',
    lineHeight: '1.4em',
    borderRadius: '50%',
    bottom: '-3.99rem'
  }
}

export const topNavStepStyle = {
  color: 'silver',
  cursor: 'pointer',
  paddingTop: '1rem',
  paddingRight: '4rem',
  borderBottom: '1px solid silver'
}
export const Todo = {
  color: 'silver',
  before: {
    content: '\"\\u039F\"',
    backgroundColor: 'silver'
  }
}
export const Doing = {
  color: '#1EAEDB',
  before: {
    content: '\"\\u2022\"',
    backgroundColor: '#33C3F0'
  }
}
export const Done = {
  color: 'silver',
  before: {
    content: '\"\\u2713\"',
    backgroundColor: '#33C3F0'
  }
}

export const prevButton = {
  title: 'Back', 
  style: {
    color: '#1EAEDB',
    backgroundColor: 'white',
    border: '0',
    width: '5rem',
    height: '5rem',
    fontSize: '4rem',
    fontWeight: '500',
    float: 'left',
    padding: '0',
    button_disabled: {
      color: 'silver' 
    }
  }
}

export const nextButton = {
  title: 'Forward', 
  style: {
    color: '#1EAEDB',
    backgroundColor: 'white',
    border: '0',
    width: '5rem',
    height: '5rem',
    fontSize: '4rem',
    fontWeight: '500',
    float: 'right',
    padding: '0',
    button_disabled: {
      color: 'silver'
    }
  }
}