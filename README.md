# Responsive React multistep form component


<img width="60%" height="auto" src="https://raw.githubusercontent.com/srdjan/react-multistep/master/assets/react-multistep.png"/>


#### Try it [here](http://srdjan.github.io/react-multistep/)
#
[![NPM](https://nodei.co/npm/react-multistep.png?downloads=true&stars=true)](https://nodei.co/npm/react-multistep/)

#### React 16.8.x (Hooks! :)

#### [List of forks](https://github.com/srdjan/react-multistep/network/members/)
# 
#### Instructions

To use this module in your app run:
```sh
npm install react-multistep
```
next, require/import it inside of your app:
```sh
const MultiStep = import from ('react-multistep')
```
#### Component has only one Prop, 'showNavigation', which controls if the navigation buttons should be visable:
```sh
prop=showNavigation 
type: boolean (default = true)
```

#### If you want to try the example, easiest is to clone the repo locally and explore:

```sh
git clone https://github.com/srdjan/react-multistep.git //clone the repo
cd react-multistep  //navigate to the project folder
npm install
```

#### Included example showcases both Browserify and Webpack builds
```javascript
const steps = [
              {name: 'StepOne', component: <StepOne/>},
              {name: 'StepTwo', component: <StepTwo/>},
              {name: 'StepThree', component: <StepThree/>},
              {name: 'StepFour', component: <StepFour/>}
            ];
<Multistep showNavigation={true} steps={steps}/>
```

#### To build included example with Browserify:
```sh
npm run build
```
#### or, with Webpack:
```sh
npm run build-with-webpack
```

#### To open the example in your favorite browser:
```sh
cd examples  /navigate to the examples folder
open ./example/index.html
```

