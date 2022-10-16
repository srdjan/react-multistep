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

// More on interaction testing: https://storybook.js.org/docs/react/writing-tests/interaction-testing
export const defaultTemplate = Template.bind({});
defaultTemplate.args = {
  steps: [
    { component: <div>1</div> },
    { component: <div>2</div> },
    { component: <div>3</div> },
    { component: <div>4</div> }
  ],
  activeStep:0
};