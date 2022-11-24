# Responsive React multistep form component


<img width="60%" height="auto" src="https://raw.githubusercontent.com/srdjan/react-multistep/master/assets/react-multistep.png"/>


#### Take it for a spin [here](http://srdjan.github.io/react-multistep/)
#
or, install it from [NPM](https://nodei.co/npm/react-multistep/)

#### React 17.0.2, ESBUILD

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

| PROPERTY       | DESCRIPTION                                                  | TYPE       | DEFAULT    | isRequired|
|----------------|--------------------------------------------------------------|------------|------------|-----------|
| showNavigation | controls if the navigation buttons are visable               |boolean     |true        |false      |
| showTitles     | control either the steps title are visible or not            |boolean     |true        |false      |
| prevStyle      | control style of the navigation buttons                      |style obj   |null        |null       |
| nextStyle      | control style of the navigation buttons                      |style obj   |null        |false      |
| stepCustomStyle| control style of step                                        |style obj   |null        |false      |
| direction      | control the steps nav direction                              |column||row |row         |false      |
| steps          | it takes an array of objects representing individual steps   |Step        |null        |true       |

Step:

| PROPERTY  | DESCRIPTION                                 | TYPE       | DEFAULT    | isRequired|
|-----------|---------------------------------------------|------------|------------|-----------|
| component | the step representing component             |JSX.Element |null        |true       |
| title     | the step title, present above the steps nav |text        |step index  |false      |



```javascript
const steps = [
              {title: 'StepOne', component: <StepOne/>},
              {title: 'StepTwo', component: <StepTwo/>},
              {title: 'StepThree', component: <StepThree/>},
              {title: 'StepFour', component: <StepFour/>}
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

Instead of using the example you also have the option to test it with storybook,
in the project folder just run:

```sh
npm install
npm run storybook 
```