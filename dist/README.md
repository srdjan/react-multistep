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
next, import it inside of your app:
```sh
const MultiStep = import from ('react-multistep')
```
#### Component has only one Prop, 'showNavigation', which controls if the navigation buttons should be visable:
```sh
prop=showNavigation 
type: boolean (default = true)
```

#### It takes an array of objects representing individual steps: 
```javascript
const steps = [
              {name: 'StepOne', component: <StepOne/>},
              {name: 'StepTwo', component: <StepTwo/>},
              {name: 'StepThree', component: <StepThree/>},
              {name: 'StepFour', component: <StepFour/>}
            ];
<Multistep showNavigation={true} steps={steps}/>
```

#### If you want to try the example, easiest is to clone the repo locally and explore:

```sh
git clone https://github.com/srdjan/react-multistep.git   //clone the repo
cd react-multistep                                        //navigate to the project folder
```

#### Next, cnavigate to 'src' directory and build the component:

```sh
cd src
npm install
npm run build:dev
```

#### On succesful build, component is packaged in the './dist' folder. Navigate to the example and build it:

```sh
cd ../example
npm install
npm run build:dev
```

#### Now you can open the example in your favorite browser:

```sh
open index.html
```

