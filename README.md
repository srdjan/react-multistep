# Responsive React multistep form component

#### Take it for a [spin](http://srdjan.github.io/react-multistep/)
#


<kbd>
<img border=width="500px" height="300px" src="https://raw.githubusercontent.com/srdjan/react-multistep/master/assets/react-multistep.png"/>
</kbd>


#### List of contributors (:raised_hands:):
<a href = "https://github.com/react-multistep/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=srdjan/react-multistep" alt="AWESOME CONTRIBUTORS" />
</a>

# 
### Instructions

To use this module in your app run:
```sh
npm install react-multistep
```
next, import it inside of your app:
```sh
const MultiStep = import from 'react-multistep'
```
and then, in your app (see bellow for two supported usage patterns, `Steps External Array` vs `Inline`:
```sh
<MultiStep activeStep={0} prevStyle={prevStyle} nextStyle={nextStyle}>
    <StepOne title='Step 1'/>
    <StepTwo title='Step 2'/>
</MultiStep>
```

MultiStep component accepts following props (all optional, except Steps array): 

| PROPERTY       | DESCRIPTION                                                  | TYPE       | DEFAULT    | isRequired|
|----------------|--------------------------------------------------------------|------------|------------|-----------|
| showNavigation | controls if the navigation buttons are visable               |boolean     |true        |false      |
| showTitles     | control either the steps title are visible or not            |boolean     |true        |false      |
| prevStyle      | control style of the navigation buttons                      |style obj   |null        |false      |
| nextStyle      | control style of the navigation buttons                      |style obj   |null        |false      |
| stepCustomStyle| control style of step                                        |style obj   |null        |false      |
| direction      | control the steps nav direction                              |column||row |row         |false      |
| activeStep     | it takes a number representing representing starting step    |number      |0           |false      |
| steps          | it takes an array of objects representing individual steps   |Step        |null        |false       |


#
#### There are two ways to configure Multistep component, preferred way is with `Inlined` child components. Using this approach, enables the new feature that allows controlling the navigation based on the current step's form validation:

```javascript
<Multistep activeStep={1} showNavigation={true}>
    <StepOne title='StepOne'/>
    <StepTwo title='StepTwo'/>
    <StepThree title='StepThree'/>
    <StepFour title='StepFour'/>
</Multistep>
```

####  The old way via `Steps`, a prop in the form aof an array of components, is still supported for backwards compatibility. But, it has being `deprecated`, and it will be removed in the future:

```javascript
const steps = [
              {title: 'StepOne', component: <StepOne/>},
              {title: 'StepTwo', component: <StepTwo/>},
              {title: 'StepThree', component: <StepThree/>},
              {title: 'StepFour', component: <StepFour/>}
            ];
...       
...

<Multistep activeStep={1} showNavigation={true} steps={steps}/>
```
Each element (`Step`) of the array can have following two properties:

| PROPERTY  | DESCRIPTION                                 | TYPE       | DEFAULT    | isRequired|
|-----------|---------------------------------------------|------------|------------|-----------|
| component | the step representing component             |JSX.Element |null        |true       |
| title     | the step title, present above the steps nav |text        |step index  |false      |


#
### 🚀 NEW! Feature: Controlling navigation to the next step with form validation

To enable this feature, when the child form component needs to control 'Next' navigational button, based on it's local validation, MultiStep dynamically adds a new prop function to child components that should be used to signal validation status. MultiStep will disable /enable `Next` button accordingly. This function has follwing signature:

  `signalIfValid(valid: boolean)`

By default the state is `false` and child components invokes it based on current outcome of the validation. In the example app, a simple checkbox is used to simulate valid/not valid.

This can be seen in the `example` app, but here are the relevant parts, required inside of the form child component:

<img width="600" alt="child-step-component-changes" src="https://user-images.githubusercontent.com/61190/213932636-5f2d8dfe-0f98-457e-9f0f-6a890174a834.png">


#### If you would like to explore this further, try the included code example...

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
