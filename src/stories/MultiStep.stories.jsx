import React from 'react';

import MultiStep from '../MultiStep';

import StepOne from './stepOne'
import StepTwo from './stepTwo'
import StepThree from './stepThree'
import StepFour from './stepFour'


export default {
  title: 'Example/MultiStep',
  component: MultiStep,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
};

const Template = (args) => <MultiStep {...args} />;

export const defaultTemplate = Template.bind({});
defaultTemplate.args = {
  steps: [
    { component: <StepOne /> },
    { component: <StepTwo /> },
    { component: <StepThree /> },
    { component: <StepFour /> }
  ]
};

export const withTitlesTemplate = Template.bind({});
withTitlesTemplate.args = {
  steps: [
    { title: "step one", component: <StepOne /> },
    { title: "step two", component: <StepTwo /> },
    { title: "step three", component: <StepThree /> },
    { title: "step four", component: <StepFour /> }
  ],
  activeStep: 0,
};

export const withActiveStepTemplate = Template.bind({});
withActiveStepTemplate.args = {
  steps: [
    { component: <StepOne /> },
    { component: <StepTwo /> },
    { component: <StepThree /> },
    { component: <StepFour /> }
  ],
  activeStep: 1
};

export const withStyledNavTemplate = Template.bind({});
withStyledNavTemplate.args = {
  steps: [
    { component: <StepOne /> },
    { component: <StepTwo /> },
    { component: <StepThree /> },
    { component: <StepFour /> }
  ],
  activeStep: 0,
  nextStyle: { background: '#33c3f0' },
  prevStyle: { background: '#33c3f0' }
};


export const withNoTitlesStepTemplate = Template.bind({});
withNoTitlesStepTemplate.args = {
  showTitles: false,
  steps: [
    { component: <StepOne /> },
    { component: <StepTwo /> },
    { component: <StepThree /> },
    { component: <StepFour /> }
  ],
  activeStep: 1
};

export const withNoTitlesWithStepStyleStepTemplate = Template.bind({});
withNoTitlesWithStepStyleStepTemplate.args = {
  stepCustomStyle: {minWidth: '150px', maxWidth: '90vw'},
  showTitles: false,
  steps: [
    { component: <StepOne /> },
    { component: <StepTwo /> },
    { component: <StepThree /> },
    { component: <StepFour /> }
  ],
  activeStep: 1
};
