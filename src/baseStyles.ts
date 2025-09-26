import { MultiStepStyles } from "./interfaces";

/**
 * Default styles for MultiStep component
 * Can be overridden by passing custom styles via the styles prop
 */
export const BaseStyles: MultiStepStyles = {
  component: {
    marginRight: '4rem',
    marginBottom: '3rem',
    backgroundColor: '#f7f7f7',
    maxWidth: '960px',
  },
  section: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '4rem',
  },
  topNav: {
    paddingTop: '4rem',
    listStyleType: 'none',
    borderBottom: '1px solid silver',
    margin: 0,
    padding: 0,
    display: 'flex',
  },
  topNavStep: {
    color: 'silver',
    cursor: 'pointer',
    padding: '1rem',
    flex: 1,
    textAlign: 'center',
  },
  todo: {
    color: 'gray',
  },
  doing: {
    color: '#1EAEDB',
    fontWeight: 'bold',
  },
  prevButton: {
    color: '#1EAEDB',
    backgroundColor: 'white',
    border: '0',
    fontSize: '3rem',
    cursor: 'pointer',
  },
  nextButton: {
    color: '#1EAEDB',
    backgroundColor: 'white',
    border: '0',
    fontSize: '3rem',
    cursor: 'pointer',
  },
};