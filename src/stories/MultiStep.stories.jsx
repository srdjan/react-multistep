import React from 'react';

import MultiStep from '../MultiStep';

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
    { component: <div>1</div> },
    { component: <div>2</div> },
    { component: <div>3</div> },
    { component: <div>4</div> }
  ],
  activeStep: 0
};


export const withTitlesTemplate = Template.bind({});
withTitlesTemplate.args = {
  steps: [
    { name: 'step one', component: <div>1</div> },
    { name: 'step two', component: <div>2</div> },
    { name: 'step three', component: <div>3</div> },
    { name: 'step four', component: <div>4</div> }
  ],
  activeStep: 0
};