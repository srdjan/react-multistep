# Responsive React multistep form component


<img width="60%" height="auto" src="https://raw.githubusercontent.com/srdjan/react-multistep/master/assets/react-multistep.png"/>


### Try it [here](http://srdjan.github.io/react-multistep/)
#
[![NPM](https://nodei.co/npm/react-multistep.png?downloads=true&stars=true)](https://nodei.co/npm/react-multistep/)
[![Known Vulnerabilities](https://snyk.io/test/github/srdjan/react-multistep/badge.svg)](https://snyk.io/test/github/srdjan/react-multistep)
#### React 16.3.2

#### Examples showcase Browserify or Webpack builds

#### [List of forks](https://github.com/srdjan/react-multistep/network/members/)
# 
## Instructions

To install this module run:
```sh
npm install react-multistep
```
next, require/import it inside of your app:
```sh
const MultiStep = import from ('react-multistep')
```
### Props:
```
showNavigation 
type: boolean (default = true)
```
```
steps 
type: array of objects pointing to React components
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

### To build included example with Browserify:
```sh
npm run build
```

### or, with Webpack:
```sh
npm run build-with-webpack
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
