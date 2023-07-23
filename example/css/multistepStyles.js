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
  style:{ color: '#23addb', backgroundColor: 'white', marginRight: '1rem', marginTop: '1rem' },
  disabledStyle:{ color: '#817f7f', backgroundColor: '#d5d5da', marginRight: '1rem', borderColor: '#817f7f', marginTop: '1rem' }
}

export const nextButton = {
  title: 'Forward', 
  style:{ color: '#23addb', backgroundColor: 'white', marginTop: '1rem' },
  disabledStyle:{ color: '#817f7f', backgroundColor: '#d5d5da', borderColor: '#817f7f', marginTop: '1rem' }
}