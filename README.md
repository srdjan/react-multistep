# Responsive React multistep form component


<img width="60%" height="auto" src="https://raw.githubusercontent.com/srdjan/react-multistep/master/assets/react-multistep.png"/>


#### Take it for a spin [here](http://srdjan.github.io/react-multistep/)
#
or, install it from [NPM](https://nodei.co/npm/react-multistep/)

#### React 18.x.x, ESBUILD

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


There are two ways to configure Multistep, with external array (old way):
```javascript
const steps = [
              {title: 'StepOne', component: <StepOne/>},
              {title: 'StepTwo', component: <StepTwo/>},
              {title: 'StepThree', component: <StepThree/>},
              {title: 'StepFour', component: <StepFour/>}
            ];
<Multistep activeStep={1} showNavigation={true} steps={steps}/>
```

or, inline (to suport) child form disabling moving to the next step if form validation is not passing:

```javascript
<Multistep activeStep={1} showNavigation={true} steps={steps}>
    <StepOne/>
    <StepTwo/>
    <StepThree/>
    <StepFour/>
</Multistep>
```

To enable this feature, if the step (child form component) needs to deactivate 'Next' button based on validation, following changes in the child form are required:

<img width="500" alt="child-step-component-changes" src="https://user-images.githubusercontent.com/61190/213932636-5f2d8dfe-0f98-457e-9f0f-6a890174a834.png">

As you can see,  Multistep adds dynamically a new prop function to child components;

  `signalIfValid(valid: boolean)`

By default it is 'false; and child components invokes it based on current validation. In the example, I use a simple checkbox to simulate valid/not valid.

Also, for this feature, steps (child form components) are added inline:

<img width="500" alt="child-steps-added-to-multistep-inline" src="https://user-images.githubusercontent.com/61190/213932915-5c9301df-3d6c-4772-b697-be58e80a8851.png">


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
