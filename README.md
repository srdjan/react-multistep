# Responsive React multistep form component


<img width="60%" height="auto" src="https://raw.githubusercontent.com/srdjan/react-multistep/master/assets/react-multistep.png"/>


#### Take it for a spin [here](http://srdjan.github.io/react-multistep/)
#
or, install it from [NPM](https://nodei.co/npm/react-multistep/)

#### React 17.0.2 

#### [List of forks](https://github.com/srdjan/react-multistep/network/members/)
# 
#### Instructions

To use this module in your app run:
```sh
npm install react-multistep
```
next, import it inside of your app:
```sh
const MultiStep = import from 'react-multistep'
```

Component accepts following, optional Props: 

- 'showNavigation': controls if the navigation buttons are visable (default = true)
- 'prevStyle' & 'nextStyle': control style of the navigation buttons
- 'activeStep': define a start step, when not desired to start at the beggining 
- 'steps': a required Prop, it takes an array of objects representing individual steps: 

```javascript
const steps = [
              {name: 'StepOne', component: <StepOne/>},
              {name: 'StepTwo', component: <StepTwo/>},
              {name: 'StepThree', component: <StepThree/>},
              {name: 'StepFour', component: <StepFour/>}
            ];
<Multistep activeStep={1} showNavigation={true} steps={steps}/>
```

#### If you want to explore try the included example...

1) Start by cloning the repo locally:

```sh
//--step 1
git clone https://github.com/srdjan/react-multistep.git   //clone the repo
cd react-multistep                                        //navigate to the project folder
```

2)  Next, install dependencies and build the component:

```sh
npm install
npm run build 
```

3) On a succesful build, navigate to the example folder and try it:

```sh
cd ../example
npm install
npm run build
npm start
```

4) Now you can open the example in your favorite browser:

```sh
open index.html
```

