import { describe, it, expect } from 'vitest';

import {
  getAvailableActions,
  navigateToStep,
} from '../../src/server/wizard';
import {
  renderWizard,
  DEFAULT_WIZARD_CONTAINER_ID,
  type WizardRendererTemplate,
} from '../../src/server/renderer';
import {
  makeSessionId,
  makeStepId,
  validationOk,
  ok,
  err,
  type WizardConfig,
  type WizardSession,
} from '../../src/server';
import { createSession } from '../../src/server/types';

const baseConfig: WizardConfig = {
  steps: [
    {
      id: makeStepId('step-one'),
      title: 'Step One',
      validate: () => validationOk(),
      render: () => ok('<p>One</p>'),
    },
    {
      id: makeStepId('step-two'),
      title: 'Step Two',
      validate: () => validationOk(),
      render: () => ok('<p>Two</p>'),
    },
    {
      id: makeStepId('step-three'),
      title: 'Step Three',
      validate: () => validationOk(),
      render: () => ok('<p>Three</p>'),
    },
  ],
};

const withSkippableSecondStep: WizardConfig = {
  steps: [
    baseConfig.steps[0],
    {
      ...baseConfig.steps[1],
      canSkip: () => true,
    },
    baseConfig.steps[2],
  ],
};

const makeSession = (config: WizardConfig, overrides: Partial<WizardSession>): WizardSession => {
  const sessionId = makeSessionId('session-123');
  const base = createSession(sessionId, config.steps.length, '2025-01-01T00:00:00.000Z');
  return {
    ...base,
    ...overrides,
  };
};

describe('server wizard domain helpers', () => {
  describe('getAvailableActions', () => {
    it('blocks forward navigation when current step invalid', () => {
      const session = makeSession(baseConfig, {
        currentStep: 0,
        stepValidity: [false, false, false],
      });

      const actions = getAvailableActions(baseConfig, session);

      expect(actions.canGoNext).toBe(false);
      expect(actions.canSubmit).toBe(false);
      expect(actions.canGoToStep(1)).toBe(false);
    });

    it('allows skipping future steps when canSkip returns true', () => {
      const session = makeSession(withSkippableSecondStep, {
        currentStep: 0,
        stepValidity: [true, false, false],
      });

      const actions = getAvailableActions(withSkippableSecondStep, session);

      expect(actions.canGoNext).toBe(true);
      expect(actions.canGoToStep(2)).toBe(true);
    });
  });

  describe('navigateToStep', () => {
    it('returns ok when navigating past skippable steps', () => {
      const session = makeSession(withSkippableSecondStep, {
        currentStep: 0,
        stepValidity: [true, false, false],
      });

      const result = navigateToStep(withSkippableSecondStep, session, 2);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.currentStep).toBe(2);
      }
    });

    it('returns error when attempting to skip non-skippable invalid steps', () => {
      const session = makeSession(baseConfig, {
        currentStep: 0,
        stepValidity: [true, false, false],
      });

      const result = navigateToStep(baseConfig, session, 2);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.type).toBe('CANNOT_PROCEED');
      }
    });
  });

  describe('renderWizard', () => {
    const renderConfig: WizardConfig = {
      steps: [
        {
          id: makeStepId('render-step'),
          title: 'Render Step',
          validate: () => validationOk(),
          render: () => ok('<p>render</p>'),
        },
      ],
    };

    it('renders using default template', () => {
      const session = makeSession(renderConfig, {
        currentStep: 0,
        stepValidity: [true],
      });

      const result = renderWizard(renderConfig, session);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toContain(`id="${DEFAULT_WIZARD_CONTAINER_ID}`);
        expect(result.value).toContain('<p>render</p>');
      }
    });

    it('supports overriding template and renderers', () => {
      const session = makeSession(renderConfig, {
        currentStep: 0,
        stepValidity: [true],
      });

      const template: WizardRendererTemplate = ({ containerId, indicators, stepContent, navigation }) =>
        `<section id="${containerId}"><header>${indicators}</header><article>${stepContent}</article>${navigation}</section>`;

      const result = renderWizard(renderConfig, session, null, {
        containerId: 'custom-shell',
        template,
        renderNavigation: () => '<nav>custom-nav</nav>',
        renderStepIndicators: () => '<ul>custom-indicators</ul>',
      });

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toContain('id="custom-shell"');
        expect(result.value).toContain('<nav>custom-nav</nav>');
        expect(result.value).toContain('<ul>custom-indicators</ul>');
        expect(result.value).toContain('<article><p>render</p></article>');
      }
    });

    it('propagates render errors from steps', () => {
      const failingConfig: WizardConfig = {
        steps: [
          {
            id: makeStepId('broken'),
            title: 'Broken',
            validate: () => validationOk(),
            render: () => err('boom'),
          },
        ],
      };

      const session = makeSession(failingConfig, {
        currentStep: 0,
        stepValidity: [false],
      });

      const result = renderWizard(failingConfig, session);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.type).toBe('RENDER_FAILED');
      }
    });
  });
});
