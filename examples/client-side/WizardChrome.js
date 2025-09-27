import React from 'react'
import { useMultiStepState, useStepNavigation } from 'react-multistep'
import { multiStepStyles } from './css/multistepStyles'

export const WizardChrome = ({ children }) => {
  const { steps, activeStep, stepCount, currentStepValid } = useMultiStepState()
  const { goToStep, next, previous } = useStepNavigation()

  const isLast = activeStep === stepCount - 1

  return (
    <div style={{ containerType: 'inline-size', containerName: 'multistep' }}>
      <div style={multiStepStyles.component}>
        <ol style={multiStepStyles.topNav} role='tablist' aria-label='Wizard steps'>
          {steps.map((step) => {
            const isActive = step.index === activeStep
            const style = {
              ...multiStepStyles.topNavStep,
              borderBottomColor: isActive ? 'var(--multistep-primary, #1EAEDB)' : 'var(--multistep-border, silver)',
            }
            return (
              <li key={step.index} style={style}>
                <button
                  role='tab'
                  type='button'
                  aria-selected={isActive}
                  onClick={() => goToStep(step.index)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    padding: 0,
                    width: '100%',
                    minHeight: 'var(--multistep-tap-target, 44px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isActive ? multiStepStyles.doing.color : multiStepStyles.todo.color,
                    cursor: 'pointer',
                    fontWeight: isActive ? '600' : '400',
                    fontSize: 'var(--multistep-font-size-step, 0.875rem)',
                  }}
                >
                  {step.title ?? step.index + 1}
                </button>
              </li>
            )
          })}
        </ol>
        <div style={multiStepStyles.section} role='tabpanel'>
          {children}
        </div>
        <div style={{
          ...multiStepStyles.section,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <button
            type='button'
            onClick={previous}
            disabled={activeStep === 0}
            aria-label='Previous step'
            style={multiStepStyles.prevButton}
          >
            ‹
          </button>
          {!isLast && (
            <button
              type='button'
              onClick={next}
              disabled={!currentStepValid}
              aria-label='Next step'
              style={multiStepStyles.nextButton}
            >
              ›
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
