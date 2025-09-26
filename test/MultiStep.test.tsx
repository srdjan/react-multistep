import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { useEffect } from 'react';
import MultiStep from '../src/MultiStep';
import { useMultiStep } from '../src/MultiStepContext';

const WizardChrome = ({ children }: { children: React.ReactNode }) => {
  const { steps, activeStep, goToStep, next, previous, currentStepValid } = useMultiStep();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      previous();
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      next();
    }
  };

  return (
    <div onKeyDown={handleKeyDown} tabIndex={-1}>
      <ol role="tablist" aria-label="Form steps" style={{ listStyle: 'none', padding: 0 }}>
        {steps.map((step) => {
          const isActive = step.index === activeStep;
          return (
            <li key={step.index} style={{ display: 'inline-block', marginRight: '1rem' }}>
              <button
                role="tab"
                type="button"
                aria-selected={isActive}
                onClick={() => goToStep(step.index)}
              >
                {step.title ?? `Step ${step.index + 1}`}
              </button>
            </li>
          );
        })}
      </ol>
      <div role="tabpanel">
        {children}
      </div>
      <div style={{ marginTop: '1rem' }}>
        <button
          type="button"
          aria-label="Previous step"
          onClick={previous}
          disabled={activeStep === 0}
        >
          ‹
        </button>
        {activeStep < steps.length - 1 && (
          <button
            type="button"
            aria-label="Next step"
            onClick={next}
            disabled={!currentStepValid}
            style={{ marginLeft: '0.5rem' }}
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
};

const TestStep = ({ title, signalParent, isValid = true }: any) => {
  useEffect(() => {
    signalParent?.({ isValid });
  }, [isValid, signalParent]);

  return (
    <WizardChrome>
      <div>{title}</div>
    </WizardChrome>
  );
};

const renderWizard = (ui: React.ReactElement) => render(ui);

describe('MultiStep', () => {
  describe('Basic Rendering', () => {
    it('renders multiple children as steps', () => {
      renderWizard(
        <MultiStep>
          <TestStep title="Step 1" />
          <TestStep title="Step 2" />
          <TestStep title="Step 3" />
        </MultiStep>
      );

      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(3);
      expect(tabs.map((tab) => tab.textContent)).toEqual([
        'Step 1',
        'Step 2',
        'Step 3',
      ]);

      const panel = screen.getByRole('tabpanel');
      expect(within(panel).getByText('Step 1')).toBeInTheDocument();
    });

    it('renders single child', () => {
      renderWizard(
        <MultiStep>
          <TestStep title="Only Step" />
        </MultiStep>
      );

      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(1);
      expect(tabs[0]).toHaveTextContent('Only Step');

      const panel = screen.getByRole('tabpanel');
      expect(within(panel).getByText('Only Step')).toBeInTheDocument();
    });

    it('throws error when no children provided', () => {
      expect(() => renderWizard(<MultiStep>{null as any}</MultiStep>)).toThrow(
        'Error: MultiStep requires at least one child component'
      );
    });

    it('displays step content', () => {
      renderWizard(
        <MultiStep>
          <TestStep title="Step 1" />
          <TestStep title="Step 2" />
        </MultiStep>
      );

      const panel = screen.getByRole('tabpanel');
      expect(within(panel).getByText('Step 1')).toBeInTheDocument();
      expect(within(panel).queryByText('Step 2')).not.toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('navigates to next step on next button click', async () => {
      const user = userEvent.setup();

      renderWizard(
        <MultiStep>
          <TestStep title="Step 1" isValid={true} />
          <TestStep title="Step 2" />
        </MultiStep>
      );

      const nextButton = screen.getByLabelText('Next step');
      await user.click(nextButton);

      const activeTab = screen.getByRole('tab', { selected: true });
      expect(activeTab).toHaveTextContent('Step 2');

      const panel = screen.getByRole('tabpanel');
      expect(within(panel).getByText('Step 2')).toBeInTheDocument();
    });

    it('navigates to previous step on prev button click', async () => {
      const user = userEvent.setup();

      renderWizard(
        <MultiStep>
          <TestStep title="Step 1" isValid={true} />
          <TestStep title="Step 2" isValid={true} />
        </MultiStep>
      );

      const nextButton = screen.getByLabelText('Next step');
      await user.click(nextButton);

      const prevButton = screen.getByLabelText('Previous step');
      await user.click(prevButton);

      const activeTab = screen.getByRole('tab', { selected: true });
      expect(activeTab).toHaveTextContent('Step 1');

      const panel = screen.getByRole('tabpanel');
      expect(within(panel).getByText('Step 1')).toBeInTheDocument();
    });

    it('disables prev button on first step', () => {
      renderWizard(
        <MultiStep>
          <TestStep title="Step 1" />
          <TestStep title="Step 2" />
        </MultiStep>
      );

      const prevButton = screen.getByLabelText('Previous step');
      expect(prevButton).toBeDisabled();
    });

    it('hides next button on last step', () => {
      renderWizard(
        <MultiStep activeStep={1}>
          <TestStep title="Step 1" />
          <TestStep title="Step 2" />
        </MultiStep>
      );

      expect(screen.queryByLabelText('Next step')).not.toBeInTheDocument();
    });

    it('allows clicking on step indicators to navigate', async () => {
      const user = userEvent.setup();

      renderWizard(
        <MultiStep>
          <TestStep title="Step 1" isValid={true} />
          <TestStep title="Step 2" />
          <TestStep title="Step 3" />
        </MultiStep>
      );

      const step3Indicator = screen.getByRole('tab', { name: 'Step 3' });
      await user.click(step3Indicator);

      const activeTab = screen.getByRole('tab', { selected: true });
      expect(activeTab).toHaveTextContent('Step 3');

      const panel = screen.getByRole('tabpanel');
      expect(within(panel).getByText('Step 3')).toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    it('disables next button when step is invalid', () => {
      renderWizard(
        <MultiStep>
          <TestStep title="Step 1" isValid={false} />
          <TestStep title="Step 2" />
        </MultiStep>
      );

      const nextButton = screen.getByLabelText('Next step');
      expect(nextButton).toBeDisabled();
    });

    it('prevents navigation to other steps when current is invalid', async () => {
      const onValidationError = vi.fn();
      const user = userEvent.setup();

      renderWizard(
        <MultiStep onValidationError={onValidationError}>
          <TestStep title="Step 1" isValid={false} />
          <TestStep title="Step 2" />
        </MultiStep>
      );

      const step2Indicator = screen.getByRole('tab', { name: 'Step 2' });
      await user.click(step2Indicator);

      expect(onValidationError).toHaveBeenCalledWith(0);
      const activeTab = screen.getByRole('tab', { selected: true });
      expect(activeTab).toHaveTextContent('Step 1');
    });
  });

  describe('Controlled Mode', () => {
    it('uses controlled activeStep prop', () => {
      const { rerender } = renderWizard(
        <MultiStep activeStep={0}>
          <TestStep title="Step 1" />
          <TestStep title="Step 2" />
        </MultiStep>
      );

      let activeTab = screen.getByRole('tab', { selected: true });
      expect(activeTab).toHaveTextContent('Step 1');

      rerender(
        <MultiStep activeStep={1}>
          <TestStep title="Step 1" />
          <TestStep title="Step 2" />
        </MultiStep>
      );

      activeTab = screen.getByRole('tab', { selected: true });
      expect(activeTab).toHaveTextContent('Step 2');

      const panel = screen.getByRole('tabpanel');
      expect(within(panel).getByText('Step 2')).toBeInTheDocument();
    });

    it('calls onStepChange callback', async () => {
      const onStepChange = vi.fn();
      const user = userEvent.setup();

      renderWizard(
        <MultiStep onStepChange={onStepChange}>
          <TestStep title="Step 1" isValid={true} />
          <TestStep title="Step 2" />
        </MultiStep>
      );

      const nextButton = screen.getByLabelText('Next step');
      await user.click(nextButton);

      expect(onStepChange).toHaveBeenCalledWith(1);
    });
  });

  describe('Keyboard Navigation', () => {
    it('navigates with arrow keys', () => {
      renderWizard(
        <MultiStep>
          <TestStep title="Step 1" isValid={true} />
          <TestStep title="Step 2" />
          <TestStep title="Step 3" />
        </MultiStep>
      );

      const getWizardRoot = () => screen.getByRole('tablist').parentElement as HTMLElement;

      fireEvent.keyDown(getWizardRoot(), { key: 'ArrowRight' });
      let activeTab = screen.getByRole('tab', { selected: true });
      expect(activeTab).toHaveTextContent('Step 2');

      fireEvent.keyDown(getWizardRoot(), { key: 'ArrowLeft' });
      activeTab = screen.getByRole('tab', { selected: true });
      expect(activeTab).toHaveTextContent('Step 1');
    });

    it('respects validation when navigating with arrow keys', () => {
      renderWizard(
        <MultiStep>
          <TestStep title="Step 1" isValid={false} />
          <TestStep title="Step 2" />
        </MultiStep>
      );

      const wizardRoot = screen.getByRole('tablist').parentElement!;

      fireEvent.keyDown(wizardRoot, { key: 'ArrowRight' });
      const activeTab = screen.getByRole('tab', { selected: true });
      expect(activeTab).toHaveTextContent('Step 1');
    });
  });

  describe('Accessibility', () => {
    it('includes proper ARIA attributes', () => {
      renderWizard(
        <MultiStep>
          <TestStep title="Step 1" />
          <TestStep title="Step 2" />
        </MultiStep>
      );

      const tablist = screen.getByRole('tablist');
      expect(tablist).toHaveAttribute('aria-label', 'Form steps');

      const tabs = screen.getAllByRole('tab');
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
      expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
    });

    it('has proper button labels', () => {
      renderWizard(
        <MultiStep>
          <TestStep title="Step 1" />
          <TestStep title="Step 2" />
        </MultiStep>
      );

      expect(screen.getByLabelText('Previous step')).toBeInTheDocument();
      expect(screen.getByLabelText('Next step')).toBeInTheDocument();
    });
  });

  describe('Customization', () => {
    it('accepts custom button content via context usage', async () => {
      const user = userEvent.setup();

      const CustomStep = ({ title, signalParent, isValid = true }: any) => {
        useEffect(() => {
          signalParent?.({ isValid });
        }, [isValid, signalParent]);

        const { next, previous } = useMultiStep();

        return (
          <WizardChrome>
            <div>{title}</div>
            <div style={{ marginTop: '1rem' }}>
              <button aria-label="custom-prev" onClick={previous}>Prev</button>
              <button aria-label="custom-next" onClick={next} style={{ marginLeft: '0.5rem' }}>Next</button>
            </div>
          </WizardChrome>
        );
      };

      renderWizard(
        <MultiStep>
          <CustomStep title="Step 1" isValid={true} />
          <CustomStep title="Step 2" />
        </MultiStep>
      );

      await user.click(screen.getByLabelText('custom-next'));
      expect(screen.getByRole('tab', { selected: true })).toHaveTextContent('Step 2');
    });

    it('can hide navigation if consumer omits chrome', () => {
      const BareStep = ({ title, signalParent }: any) => {
        useEffect(() => {
          signalParent?.({ isValid: true });
        }, [signalParent]);
        return <div>{title}</div>;
      };

      renderWizard(
        <MultiStep>
          <BareStep title="Step 1" />
        </MultiStep>
      );

      expect(screen.queryByLabelText('Next step')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Previous step')).not.toBeInTheDocument();
    });

    it('applies custom styles via consumer provided chrome', () => {
      const StyledChrome = ({ children }: { children: React.ReactNode }) => {
        const wizard = useMultiStep();
        return (
          <div style={{ backgroundColor: 'red' }}>
            <button aria-label='noop' onClick={() => wizard.next()} disabled={!wizard.currentStepValid}>Next</button>
            <div>{children}</div>
          </div>
        );
      };

      const StyledStep = ({ title, signalParent }: any) => {
        useEffect(() => {
          signalParent?.({ isValid: true });
        }, [signalParent]);
        return (
          <StyledChrome>
            <div>{title}</div>
          </StyledChrome>
        );
      };

      renderWizard(
        <MultiStep>
          <StyledStep title="Step 1" />
        </MultiStep>
      );

      const container = screen.getByLabelText('noop').parentElement as HTMLElement;
      expect(window.getComputedStyle(container).backgroundColor).toBe('rgb(255, 0, 0)');
    });
  });
});
