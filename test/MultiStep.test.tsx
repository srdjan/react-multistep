import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MultiStep from '../src/MultiStep';
import React, { useEffect } from 'react';

const TestStep = ({ title, signalParent, isValid = true }: any) => {
  useEffect(() => {
    signalParent?.({ isValid });
  }, [isValid, signalParent]);

  return <div>{title}</div>;
};

describe('MultiStep', () => {
  describe('Basic Rendering', () => {
    it('renders multiple children as steps', () => {
      render(
        <MultiStep>
          <TestStep title="Step 1" />
          <TestStep title="Step 2" />
          <TestStep title="Step 3" />
        </MultiStep>
      );

      expect(screen.getByText('Step 1')).toBeInTheDocument();
      expect(screen.getByText('Step 2')).toBeInTheDocument();
      expect(screen.getByText('Step 3')).toBeInTheDocument();
    });

    it('renders single child', () => {
      render(
        <MultiStep>
          <TestStep title="Only Step" />
        </MultiStep>
      );

      expect(screen.getByText('Only Step')).toBeInTheDocument();
    });

    it('throws error when no children provided', () => {
      expect(() => render(<MultiStep>{null as any}</MultiStep>)).toThrow(
        'Error: MultiStep requires at least one child component'
      );
    });

    it('displays step content', () => {
      render(
        <MultiStep>
          <div>First step content</div>
          <div>Second step content</div>
        </MultiStep>
      );

      expect(screen.getByText('First step content')).toBeInTheDocument();
      expect(screen.queryByText('Second step content')).not.toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('navigates to next step on next button click', async () => {
      const user = userEvent.setup();

      render(
        <MultiStep>
          <TestStep title="Step 1" isValid={true} />
          <TestStep title="Step 2" />
        </MultiStep>
      );

      const nextButton = screen.getByLabelText('Next step');
      await user.click(nextButton);

      expect(screen.getByText('Step 2')).toBeInTheDocument();
    });

    it('navigates to previous step on prev button click', async () => {
      const user = userEvent.setup();

      render(
        <MultiStep activeStep={1}>
          <TestStep title="Step 1" />
          <TestStep title="Step 2" isValid={true} />
        </MultiStep>
      );

      const prevButton = screen.getByLabelText('Previous step');
      await user.click(prevButton);

      expect(screen.getByText('Step 1')).toBeInTheDocument();
    });

    it('disables prev button on first step', () => {
      render(
        <MultiStep>
          <TestStep title="Step 1" />
          <TestStep title="Step 2" />
        </MultiStep>
      );

      const prevButton = screen.getByLabelText('Previous step');
      expect(prevButton).toBeDisabled();
    });

    it('hides next button on last step', () => {
      render(
        <MultiStep activeStep={1}>
          <TestStep title="Step 1" />
          <TestStep title="Step 2" />
        </MultiStep>
      );

      expect(screen.queryByLabelText('Next step')).not.toBeInTheDocument();
    });

    it('allows clicking on step indicators to navigate', async () => {
      const user = userEvent.setup();

      render(
        <MultiStep>
          <TestStep title="Step 1" isValid={true} />
          <TestStep title="Step 2" />
          <TestStep title="Step 3" />
        </MultiStep>
      );

      const step3Indicator = screen.getByText('Step 3').closest('li');
      await user.click(step3Indicator!);

      expect(screen.getByText('Step 3')).toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    it('disables next button when step is invalid', () => {
      render(
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

      render(
        <MultiStep onValidationError={onValidationError}>
          <TestStep title="Step 1" isValid={false} />
          <TestStep title="Step 2" />
        </MultiStep>
      );

      const step2Indicator = screen.getByText('Step 2').closest('li');
      await user.click(step2Indicator!);

      expect(onValidationError).toHaveBeenCalledWith(0);
      expect(screen.getByText('Step 1')).toBeInTheDocument();
    });
  });

  describe('Controlled Mode', () => {
    it('uses controlled activeStep prop', () => {
      const { rerender } = render(
        <MultiStep activeStep={0}>
          <TestStep title="Step 1" />
          <TestStep title="Step 2" />
        </MultiStep>
      );

      expect(screen.getByText('Step 1')).toBeInTheDocument();

      rerender(
        <MultiStep activeStep={1}>
          <TestStep title="Step 1" />
          <TestStep title="Step 2" />
        </MultiStep>
      );

      expect(screen.getByText('Step 2')).toBeInTheDocument();
    });

    it('calls onStepChange callback', async () => {
      const onStepChange = vi.fn();
      const user = userEvent.setup();

      render(
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
    it('navigates with arrow keys', async () => {
      render(
        <MultiStep>
          <TestStep title="Step 1" isValid={true} />
          <TestStep title="Step 2" />
          <TestStep title="Step 3" />
        </MultiStep>
      );

      const container = screen.getByText('Step 1').closest('div')?.parentElement;

      fireEvent.keyDown(container!, { key: 'ArrowRight' });
      expect(screen.getByText('Step 2')).toBeInTheDocument();

      fireEvent.keyDown(container!, { key: 'ArrowLeft' });
      expect(screen.getByText('Step 1')).toBeInTheDocument();
    });

    it('respects validation when navigating with arrow keys', () => {
      render(
        <MultiStep>
          <TestStep title="Step 1" isValid={false} />
          <TestStep title="Step 2" />
        </MultiStep>
      );

      const container = screen.getByText('Step 1').closest('div')?.parentElement;

      fireEvent.keyDown(container!, { key: 'ArrowRight' });
      expect(screen.getByText('Step 1')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('includes proper ARIA attributes', () => {
      render(
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
      render(
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
    it('accepts custom button content', () => {
      render(
        <MultiStep prevButtonContent="Back" nextButtonContent="Forward">
          <TestStep title="Step 1" isValid={true} />
          <TestStep title="Step 2" />
        </MultiStep>
      );

      expect(screen.getByText('Back')).toBeInTheDocument();
      expect(screen.getByText('Forward')).toBeInTheDocument();
    });

    it('can hide navigation with showNavigation prop', () => {
      render(
        <MultiStep showNavigation={false}>
          <TestStep title="Step 1" />
          <TestStep title="Step 2" />
        </MultiStep>
      );

      expect(screen.queryByLabelText('Previous step')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Next step')).not.toBeInTheDocument();
    });

    it('applies custom styles', () => {
      const customStyles = {
        component: { backgroundColor: 'red' },
      };

      render(
        <MultiStep styles={customStyles}>
          <TestStep title="Step 1" />
        </MultiStep>
      );

      const component = screen.getByText('Step 1').closest('div')?.parentElement?.parentElement;
      expect(component).toHaveStyle({ backgroundColor: 'red' });
    });
  });
});