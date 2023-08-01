const multiStep = { 
  // display: 'flex',
  // flexWrap: 'wrap',
  // position: 'relative',
  // gap: '1.6rem',
  // maxWidth: '80vh',
  // marginTop: '5rem',
  // marginBottom: '5rem',
  // backgroundColor: 'silver',
  // boxSizing: 'border-box',
  // width: '90%',
  // border: 'solid #5B6DCD 1px',
  // padding: '5px'
}
const topNav = {
  display: 'flex',
  flexDirection: 'row',
  margin: '0',
  paddingTop: '4rem',
  paddingBottom: '2rem',
  listStyleType: 'none'
}
const topNavStep = {
  color: 'silver',
  cursor: 'pointer',
  width: '25%',
  textAlign: 'center',
  borderBottom: '1px solid silver'
}
const todo = {
  color: 'gray'
}
const doing = {
  color: '#1EAEDB'
}
const skip = {   
  color: 'silver'
}
const prevButton = {
  color: '#1EAEDB',
  backgroundColor: 'white',
  border: '0',
  fontSize: '4rem',
  fontWeight: '500',
  marginLeft: '2rem',
  paddingTop: '4rem',
  float: 'left'    //only difference
}
const nextButton = {
  color: '#1EAEDB',
  backgroundColor: 'white',
  border: '0',
  fontSize: '4rem',
  fontWeight: '500',
  marginRight: '2rem',
  paddingTop: '4rem',
  float: 'right'   // only difference
}

export const BaseStyles = {
  multistep: multiStep,
  topNav,
  topNavStep,
  prevButton,
  nextButton,
  todo,
  doing,
  skip
}

// .container = { 
//   marginTop: '5rem';
//   marginBottom: '5rem';
//   backgroundColor:'#f1f1f141';
// }
// .topNav = {
//   display: 'flex';
//   flexDirection: 'row';
//   margin: '0';
//   paddingBottom: '2.2rem';
//   listStyleType: 'none';
// }
// .topNavStep = {
//   color: 'silver';
//   cursor: 'pointer';
//   width: '25%';
//   paddingTop: '4rem';
//   paddingRight: '4rem';
//   borderBottom: '1px solid silver';
// }
// .todo = {
//   color: 'gray';
// }
// .doing = {
//   color: '#1EAEDB';
// }
// .skip = {   //todo: add to multistep?
//   color: 'silver';
// }
// .prevButton = {
//   color: '#1EAEDB';
//   backgroundColor: 'white';
//   border: '0';
//   fontSize: '4rem';
//   fontWeight: '500';
//   padding: '0';
//   float: 'left';    //only difference
// }
// .nextButton = {
//   color: '#1EAEDB';
//   backgroundColor: 'white';
//   border: '0';
//   fontSize: '4rem';
//   fontWeight: '500';
//   padding: '0';
//   float: 'right';   // only difference
// }
