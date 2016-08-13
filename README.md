# Responsive ReactJS multi step form component
## React 15.3.0 - Babel 6.5.0

[![version](https://img.shields.io/npm/v/npm-install-loader.svg)](http://npm.im/react-multistep)
[![downloads](https://img.shields.io/npm/dm/npm-install-loader.svg)](http://npm-stat.com/charts.html?package=react-multistep)
[![MIT License](https://img.shields.io/npm/l/npm-install-loader.svg)](http://opensource.org/licenses/MIT)



-------------
<img src="https://dl.dropboxusercontent.com/u/51491957/multistep-v2.1.1/react-multistep.png"/>
-------------


[Working demo](https://dl.dropboxusercontent.com/u/51491957/multistep-v2.1.1/index.html)



[List of forks] 
(https://github.com/srdjan/react-multistep/network/members)

## Instructions

To install this module run:
```sh
npm install react-multistep
```
next, require it inside of your app:
```sh
var Multistep = require('react-multistep').Multistep
```
### Configuration:
```
showNavigation type: boolean (by default = true)
```
```
steps type: array of objects
```
### Example:
```javascript
const steps = [
              {name: 'StepOne', component: <StepOne/>},
              {name: 'StepTwo', component: <StepTwo/>},
              {name: 'StepThree', component: <StepThree/>},
              {name: 'StepFour', component: <StepFour/>}
            ];
<Multistep showNavigation={true} steps={steps}/>
```

To build included example:
```sh
npm run build
```
Now open ./example/index.html in your favorite browser


## Dev instructions

First clone the repository and then run:
```sh
npm install
```

To test run:
```sh
npm test
```
