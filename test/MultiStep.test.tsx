import {
  describe,
  it,
  expect,
  vi,
  render,
  screen,
  fireEvent,
  within,
  flushAsync,
  act,
} from "./harness";
import userEvent from "./harness";
import React, { useEffect } from "react";
import { renderToString } from "react-dom/server";
import MultiStep from "../src/MultiStep";
import {
  useMultiStep,
  useMultiStepState,
  useMultiStepNavigation,
  useReportValidity,
  type MultiStepApi,
} from "../src/MultiStepContext";
import { useReducedMotion } from "../src/useReducedMotion";
import type {
  MultiStepProps,
  StepChangeEvent,
  StepComponentProps,
  StepValidity,
} from "../src/interfaces";

// Headless chrome, rendered INSIDE each step so it can read the MultiStep
// context via the slice hooks. This mirrors the shipped example
// (examples/client-side/WizardChrome.tsx): each step wraps its content in the
// chrome. Because every mounted step renders its own chrome, tests that assert
// on a single tablist / single chrome run in mode="unmount" (only the active
// step is mounted), exactly as the example does. Dedicated tests below cover the
// default keepMounted mode where all steps stay mounted.
const WizardChrome = ({ children }: { children: React.ReactNode }) => {
  const { steps, activeStep, stepCount, currentStepValid } = useMultiStepState();
  const { goToStep, next, previous } = useMultiStepNavigation();
  const active = steps[activeStep];

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      previous();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
    }
  };

  return (
    <div onKeyDown={handleKeyDown} tabIndex={-1}>
      <ol role="tablist" aria-label="Form steps" style={{ listStyle: "none", padding: 0 }}>
        {steps.map((step) => {
          const isActive = step.index === activeStep;
          return (
            <li key={step.index} style={{ display: "inline-block", marginRight: "1rem" }}>
              <button
                role="tab"
                type="button"
                id={step.stepId}
                aria-controls={step.panelId}
                aria-selected={isActive}
                onClick={() => goToStep(step.index)}
              >
                {step.title ?? `Step ${step.index + 1}`}
              </button>
            </li>
          );
        })}
      </ol>
      <div role="tabpanel" id={active?.panelId} aria-labelledby={active?.stepId}>
        {children}
      </div>
      <div style={{ marginTop: "1rem" }}>
        <button
          type="button"
          aria-label="Previous step"
          onClick={previous}
          disabled={activeStep === 0}
        >
          &lsaquo;
        </button>
        {activeStep < stepCount - 1 && (
          <button
            type="button"
            aria-label="Next step"
            onClick={next}
            disabled={!currentStepValid}
            style={{ marginLeft: "0.5rem" }}
          >
            &rsaquo;
          </button>
        )}
      </div>
    </div>
  );
};

// A step reports validity via the useReportValidity() hook - no injected prop.
// `validity` drives the structured StepValidity union directly; the convenience
// `isValid` prop maps to valid/invalid for the common case.
type TestStepProps = StepComponentProps<{
  title: string;
  isValid?: boolean;
  validity?: StepValidity;
}>;

const TestStep = ({ title, isValid = true, validity }: TestStepProps) => {
  const report = useReportValidity();
  useEffect(() => {
    report(validity ?? (isValid ? { status: "valid" } : { status: "invalid" }));
  }, [report, isValid, validity]);

  return (
    <WizardChrome>
      <p>{title}</p>
    </WizardChrome>
  );
};

// A content-only step (no chrome) that reports a fixed validity from an effect.
// Used for inactive middle/last steps in keepMounted jumps: they mount and report
// without each rendering their own chrome/tablist (only the active step renders one).
const ReportOnlyStep = ({
  title,
  isValid,
}: StepComponentProps<{ title: string; isValid: boolean }>) => {
  const report = useReportValidity();
  useEffect(() => {
    report(isValid ? { status: "valid" } : { status: "invalid" });
  }, [report, isValid]);
  return <p>{title}</p>;
};

// Default to unmount so a single active chrome (single tablist) is in the DOM -
// the pattern the shipped example uses. keepMounted-specific tests opt in.
const renderWizard = (ui: React.ReactElement) => render(ui);

const wrapUnmount = (
  children: React.ReactNode,
  props: Omit<Partial<MultiStepProps>, "children" | "mode"> = {}
) => (
  <MultiStep mode="unmount" {...props}>
    {children}
  </MultiStep>
);

describe("MultiStep", () => {
  describe("Basic Rendering", () => {
    it("renders multiple children as steps", () => {
      renderWizard(
        wrapUnmount([
          <TestStep key="1" title="Step 1" />,
          <TestStep key="2" title="Step 2" />,
          <TestStep key="3" title="Step 3" />,
        ])
      );

      const tabs = screen.getAllByRole("tab");
      expect(tabs).toHaveLength(3);
      expect(tabs.map((tab) => tab.textContent)).toEqual(["Step 1", "Step 2", "Step 3"]);

      const panel = screen.getByRole("tabpanel");
      expect(within(panel).getByText("Step 1")).toBeInTheDocument();
    });

    it("renders single child", () => {
      renderWizard(wrapUnmount(<TestStep title="Only Step" />));

      const tabs = screen.getAllByRole("tab");
      expect(tabs).toHaveLength(1);
      expect(tabs[0]).toHaveTextContent("Only Step");

      const panel = screen.getByRole("tabpanel");
      expect(within(panel).getByText("Only Step")).toBeInTheDocument();
    });

    it("throws error when no children provided", () => {
      expect(() =>
        renderWizard(<MultiStep>{null as unknown as React.ReactElement}</MultiStep>)
      ).toThrow("Error: MultiStep requires at least one child component");
    });

    it("displays only the active step content (unmount mode)", () => {
      renderWizard(
        wrapUnmount([<TestStep key="1" title="Step 1" />, <TestStep key="2" title="Step 2" />])
      );

      const panel = screen.getByRole("tabpanel");
      expect(within(panel).getByText("Step 1")).toBeInTheDocument();
      expect(within(panel).queryByText("Step 2")).not.toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("navigates to next step on next button click", async () => {
      const user = userEvent.setup();

      renderWizard(
        wrapUnmount([
          <TestStep key="1" title="Step 1" isValid={true} />,
          <TestStep key="2" title="Step 2" />,
        ])
      );

      const nextButton = screen.getByLabelText("Next step");
      await user.click(nextButton);

      const activeTab = screen.getByRole("tab", { selected: true });
      expect(activeTab).toHaveTextContent("Step 2");

      const panel = screen.getByRole("tabpanel");
      expect(within(panel).getByText("Step 2")).toBeInTheDocument();
    });

    it("navigates to previous step on prev button click", async () => {
      const user = userEvent.setup();

      renderWizard(
        wrapUnmount([
          <TestStep key="1" title="Step 1" isValid={true} />,
          <TestStep key="2" title="Step 2" isValid={true} />,
        ])
      );

      await user.click(screen.getByLabelText("Next step"));
      await user.click(screen.getByLabelText("Previous step"));

      const activeTab = screen.getByRole("tab", { selected: true });
      expect(activeTab).toHaveTextContent("Step 1");

      const panel = screen.getByRole("tabpanel");
      expect(within(panel).getByText("Step 1")).toBeInTheDocument();
    });

    it("disables prev button on first step", () => {
      renderWizard(
        wrapUnmount([<TestStep key="1" title="Step 1" />, <TestStep key="2" title="Step 2" />])
      );

      expect(screen.getByLabelText("Previous step")).toBeDisabled();
    });

    it("hides next button on last step", () => {
      renderWizard(
        wrapUnmount([<TestStep key="1" title="Step 1" />, <TestStep key="2" title="Step 2" />], {
          activeStep: 1,
        })
      );

      expect(screen.queryByLabelText("Next step")).not.toBeInTheDocument();
    });

    it("jumps forward across steps when every step in range is valid", async () => {
      const user = userEvent.setup();

      // ReportOnlyStep (module-level): steps 2/3 mount and report valid under the
      // default keepMounted, so the 0 -> 2 jump's range gate passes.
      renderWizard(
        <MultiStep>
          <TestStep title="Step 1" isValid={true} />
          <ReportOnlyStep title="Step 2" isValid={true} />
          <ReportOnlyStep title="Step 3" isValid={true} />
        </MultiStep>
      );

      const step3Indicator = screen.getByRole("tab", { name: "Step 3" });
      await user.click(step3Indicator);

      // The jump succeeds: the active (selected) tab is now Step 3. The single
      // chrome belongs to the (now hidden) step 0, whose panel still wraps step
      // 0's content; step 3's own content is mounted (hidden) elsewhere.
      const activeTab = screen.getByRole("tab", { selected: true });
      expect(activeTab).toHaveTextContent("Step 3");
    });
  });

  describe("Validation", () => {
    it("disables next button when the active step is invalid", () => {
      renderWizard(
        wrapUnmount([
          <TestStep key="1" title="Step 1" isValid={false} />,
          <TestStep key="2" title="Step 2" />,
        ])
      );

      expect(screen.getByLabelText("Next step")).toBeDisabled();
    });

    it("disables next button while the active step is pending", () => {
      // A step that never reports stays pending, so the forward gate is closed.
      const PendingStep = ({ title }: StepComponentProps<{ title: string }>) => {
        useReportValidity(); // resolves the step index, but we never report
        return (
          <WizardChrome>
            <p>{title}</p>
          </WizardChrome>
        );
      };

      renderWizard(
        wrapUnmount([<PendingStep key="1" title="Step 1" />, <TestStep key="2" title="Step 2" />])
      );

      expect(screen.getByLabelText("Next step")).toBeDisabled();
    });

    it("prevents forward navigation and reports the first invalid index", async () => {
      const onValidationError = vi.fn();
      const user = userEvent.setup();

      renderWizard(
        wrapUnmount(
          [
            <TestStep key="1" title="Step 1" isValid={false} />,
            <TestStep key="2" title="Step 2" />,
          ],
          { onValidationError }
        )
      );

      const step2Indicator = screen.getByRole("tab", { name: "Step 2" });
      await user.click(step2Indicator);

      expect(onValidationError).toHaveBeenCalledWith(0);
      const activeTab = screen.getByRole("tab", { selected: true });
      expect(activeTab).toHaveTextContent("Step 1");
    });

    it("reports the first invalid index in a multi-step forward jump", async () => {
      const onValidationError = vi.fn();
      const user = userEvent.setup();

      // keepMounted (default): step 0 renders the only chrome (it is the active,
      // visible step); steps 1 and 2 are mounted but content-only and report
      // their validity. Step 1 is invalid, so a 0 -> 2 jump must abort on index 1.
      renderWizard(
        <MultiStep onValidationError={onValidationError}>
          <TestStep title="Step 1" isValid={true} />
          <ReportOnlyStep title="Step 2" isValid={false} />
          <ReportOnlyStep title="Step 3" isValid={true} />
        </MultiStep>
      );

      const step3Indicator = screen.getByRole("tab", { name: "Step 3" });
      await user.click(step3Indicator);

      // Jump 0 -> 2: step 0 valid, step 1 invalid -> gate aborts on index 1.
      expect(onValidationError).toHaveBeenCalledWith(1);
      expect(screen.getByRole("tab", { selected: true })).toHaveTextContent("Step 1");
    });

    it("allows backward navigation regardless of validity", async () => {
      const onStepChange = vi.fn();
      const onValidationError = vi.fn();
      const user = userEvent.setup();

      // Uncontrolled, starting on step 2 with both steps invalid. Navigating
      // backward must skip the forward gate: it changes step and never reports
      // a validation error.
      renderWizard(
        wrapUnmount(
          [
            <TestStep key="1" title="Step 1" isValid={false} />,
            <TestStep key="2" title="Step 2" isValid={false} />,
          ],
          { defaultStep: 1, onStepChange, onValidationError }
        )
      );

      await user.click(screen.getByLabelText("Previous step"));

      expect(onValidationError.mock.calls).toHaveLength(0);
      expect(onStepChange).toHaveBeenCalledWith(0);
      expect(screen.getByRole("tab", { selected: true })).toHaveTextContent("Step 1");
    });

    it("gates on the structured StepValidity union (pending/invalid/valid)", async () => {
      const onValidationError = vi.fn();
      const user = userEvent.setup();

      const ReportingStep = ({
        title,
        validity,
      }: StepComponentProps<{ title: string; validity: StepValidity }>) => {
        const report = useReportValidity();
        useEffect(() => {
          report(validity);
        }, [report, validity]);
        return (
          <WizardChrome>
            <p>{title}</p>
          </WizardChrome>
        );
      };

      // Step 1 reports pending: the Next button is disabled and a tab-driven
      // forward jump reports the pending step as the blocker.
      const { rerender } = renderWizard(
        wrapUnmount(
          [
            <ReportingStep key="1" title="Step 1" validity={{ status: "pending" }} />,
            <ReportingStep key="2" title="Step 2" validity={{ status: "valid" }} />,
          ],
          { onValidationError }
        )
      );

      expect(screen.getByLabelText("Next step")).toBeDisabled();

      // The Next button is disabled (React suppresses clicks on disabled
      // controls), so exercise the gate through the always-enabled Step 2 tab.
      await user.click(screen.getByRole("tab", { name: "Step 2" }));
      expect(onValidationError).toHaveBeenCalledWith(0);
      expect(screen.getByRole("tab", { selected: true })).toHaveTextContent("Step 1");

      // Now step 1 reports valid: the gate opens and Next advances.
      rerender(
        wrapUnmount(
          [
            <ReportingStep key="1" title="Step 1" validity={{ status: "valid" }} />,
            <ReportingStep key="2" title="Step 2" validity={{ status: "valid" }} />,
          ],
          { onValidationError }
        )
      );

      expect(screen.getByLabelText("Next step")).not.toBeDisabled();
      await user.click(screen.getByLabelText("Next step"));
      expect(screen.getByRole("tab", { selected: true })).toHaveTextContent("Step 2");
    });
  });

  describe("Render modes", () => {
    it("unmount mode renders only the active step subtree", async () => {
      const user = userEvent.setup();

      renderWizard(
        wrapUnmount([
          <TestStep key="1" title="Step 1" isValid={true} />,
          <TestStep key="2" title="Step 2" />,
        ])
      );

      // Exactly one chrome -> one tablist, one panel -> in the DOM at a time.
      expect(screen.getAllByRole("tablist")).toHaveLength(1);
      let panel = screen.getByRole("tabpanel");
      expect(within(panel).getByText("Step 1")).toBeInTheDocument();
      expect(within(panel).queryByText("Step 2")).not.toBeInTheDocument();

      await user.click(screen.getByLabelText("Next step"));

      expect(screen.getAllByRole("tablist")).toHaveLength(1);
      panel = screen.getByRole("tabpanel");
      expect(within(panel).getByText("Step 2")).toBeInTheDocument();
      expect(within(panel).queryByText("Step 1")).not.toBeInTheDocument();
    });

    it("keepMounted (default) keeps every step subtree in the DOM but hides inactive ones", () => {
      // Content-only steps (no chrome) so the assertion is about step content
      // presence/visibility, not the multiple chromes keepMounted would render.
      const ContentStep = ({ title }: StepComponentProps<{ title: string }>) => {
        const report = useReportValidity();
        useEffect(() => {
          report({ status: "valid" });
        }, [report]);
        return <p>{title}</p>;
      };

      renderWizard(
        <MultiStep>
          <ContentStep title="Alpha" />
          <ContentStep title="Beta" />
        </MultiStep>
      );

      // Both step contents are in the DOM (keepMounted is the default)...
      const alpha = screen.getByText("Alpha");
      const beta = screen.getByText("Beta");
      expect(alpha).toBeInTheDocument();
      expect(beta).toBeInTheDocument();

      // ...but the inactive step (Beta) lives under a hidden wrapper, while the
      // active step (Alpha) does not.
      const hiddenAncestor = (el: HTMLElement): boolean => {
        let node: HTMLElement | null = el;
        while (node) {
          if (node.hasAttribute("hidden")) return true;
          node = node.parentElement;
        }
        return false;
      };
      expect(hiddenAncestor(alpha as HTMLElement)).toBe(false);
      expect(hiddenAncestor(beta as HTMLElement)).toBe(true);
    });
  });

  describe("Controlled Mode", () => {
    it("uses controlled activeStep prop", () => {
      const { rerender } = renderWizard(
        wrapUnmount([<TestStep key="1" title="Step 1" />, <TestStep key="2" title="Step 2" />], {
          activeStep: 0,
        })
      );

      let activeTab = screen.getByRole("tab", { selected: true });
      expect(activeTab).toHaveTextContent("Step 1");

      rerender(
        wrapUnmount([<TestStep key="1" title="Step 1" />, <TestStep key="2" title="Step 2" />], {
          activeStep: 1,
        })
      );

      activeTab = screen.getByRole("tab", { selected: true });
      expect(activeTab).toHaveTextContent("Step 2");

      const panel = screen.getByRole("tabpanel");
      expect(within(panel).getByText("Step 2")).toBeInTheDocument();
    });

    it("calls onStepChange callback", async () => {
      const onStepChange = vi.fn();
      const user = userEvent.setup();

      renderWizard(
        wrapUnmount(
          [<TestStep key="1" title="Step 1" isValid={true} />, <TestStep key="2" title="Step 2" />],
          { onStepChange }
        )
      );

      await user.click(screen.getByLabelText("Next step"));
      expect(onStepChange).toHaveBeenCalledWith(1);
    });
  });

  describe("Keyboard Navigation", () => {
    it("navigates with arrow keys", () => {
      renderWizard(
        wrapUnmount([
          <TestStep key="1" title="Step 1" isValid={true} />,
          <TestStep key="2" title="Step 2" isValid={true} />,
          <TestStep key="3" title="Step 3" />,
        ])
      );

      const wizardRoot = () => screen.getByRole("tablist").parentElement as HTMLElement;

      fireEvent.keyDown(wizardRoot(), { key: "ArrowRight" });
      let activeTab = screen.getByRole("tab", { selected: true });
      expect(activeTab).toHaveTextContent("Step 2");

      fireEvent.keyDown(wizardRoot(), { key: "ArrowLeft" });
      activeTab = screen.getByRole("tab", { selected: true });
      expect(activeTab).toHaveTextContent("Step 1");
    });

    it("respects validation when navigating with arrow keys", () => {
      renderWizard(
        wrapUnmount([
          <TestStep key="1" title="Step 1" isValid={false} />,
          <TestStep key="2" title="Step 2" />,
        ])
      );

      const wizardRoot = screen.getByRole("tablist").parentElement!;

      fireEvent.keyDown(wizardRoot, { key: "ArrowRight" });
      const activeTab = screen.getByRole("tab", { selected: true });
      expect(activeTab).toHaveTextContent("Step 1");
    });
  });

  describe("Accessibility", () => {
    it("includes proper ARIA attributes", () => {
      renderWizard(
        wrapUnmount([<TestStep key="1" title="Step 1" />, <TestStep key="2" title="Step 2" />])
      );

      const tablist = screen.getByRole("tablist");
      expect(tablist).toHaveAttribute("aria-label", "Form steps");

      const tabs = screen.getAllByRole("tab");
      expect(tabs[0]).toHaveAttribute("aria-selected", "true");
      expect(tabs[1]).toHaveAttribute("aria-selected", "false");
    });

    it("wires each tab to its panel via stable, unique ids", () => {
      renderWizard(
        wrapUnmount([<TestStep key="1" title="Step 1" />, <TestStep key="2" title="Step 2" />])
      );

      const tabs = screen.getAllByRole("tab");
      // ids come from useId (do not hardcode the literal): assert the
      // relationship/uniqueness, not the exact string.
      const stepId = tabs[0]!.getAttribute("id");
      const controls = tabs[0]!.getAttribute("aria-controls");
      expect(typeof stepId === "string" && stepId.length > 0).toBe(true);
      expect(typeof controls === "string" && controls!.length > 0).toBe(true);
      expect(tabs[0]!.getAttribute("aria-controls")).not.toBe(
        tabs[1]!.getAttribute("aria-controls")
      );

      // The active tab's aria-controls points at the rendered panel's id.
      const panel = screen.getByRole("tabpanel");
      expect(tabs[0]!.getAttribute("aria-controls")).toBe(panel.getAttribute("id"));
    });

    it("has proper button labels", () => {
      renderWizard(
        wrapUnmount([<TestStep key="1" title="Step 1" />, <TestStep key="2" title="Step 2" />])
      );

      expect(screen.getByLabelText("Previous step")).toBeInTheDocument();
      expect(screen.getByLabelText("Next step")).toBeInTheDocument();
    });
  });

  describe("Customization", () => {
    it("drives navigation from in-step chrome via context hooks", async () => {
      const user = userEvent.setup();

      const CustomStep = ({
        title,
        isValid = true,
      }: StepComponentProps<{ title: string; isValid?: boolean }>) => {
        const report = useReportValidity();
        useEffect(() => {
          report(isValid ? { status: "valid" } : { status: "invalid" });
        }, [report, isValid]);

        const { next, previous } = useMultiStepNavigation();

        return (
          <div>
            <p>{title}</p>
            <button aria-label="custom-prev" onClick={previous}>
              Prev
            </button>
            <button aria-label="custom-next" onClick={next} style={{ marginLeft: "0.5rem" }}>
              Next
            </button>
            <WizardChrome>
              <span>chrome for {title}</span>
            </WizardChrome>
          </div>
        );
      };

      renderWizard(
        wrapUnmount([
          <CustomStep key="1" title="Step 1" isValid={true} />,
          <CustomStep key="2" title="Step 2" />,
        ])
      );

      await user.click(screen.getByLabelText("custom-next"));
      expect(screen.getByRole("tab", { selected: true })).toHaveTextContent("Step 2");
    });

    it("renders without navigation chrome when the consumer omits it", () => {
      const BareStep = ({ title }: StepComponentProps<{ title: string }>) => {
        const report = useReportValidity();
        useEffect(() => {
          report({ status: "valid" });
        }, [report]);
        return <p>{title}</p>;
      };

      renderWizard(
        <MultiStep>
          <BareStep title="Step 1" />
        </MultiStep>
      );

      expect(screen.queryByLabelText("Next step")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Previous step")).not.toBeInTheDocument();
      expect(screen.getByText("Step 1")).toBeInTheDocument();
    });
  });

  describe("Focus management (focusOnStepChange)", () => {
    // A step with an always-valid report, a plain heading, and a context-driven
    // Next button so a test can navigate by clicking inside the step content.
    // The component is responsible for making the heading programmatically
    // focusable when focusOnStepChange="heading".
    const FocusStep = ({ title }: StepComponentProps<{ title: string }>) => {
      const report = useReportValidity();
      const { next } = useMultiStepNavigation();
      useEffect(() => {
        report({ status: "valid" });
      }, [report]);
      return (
        <section>
          <h2>{title}</h2>
          <button type="button" aria-label={`advance-${title}`} onClick={next}>
            go
          </button>
        </section>
      );
    };

    // True iff `inner` is `el` or a descendant of it.
    const within_ = (el: Element | null, inner: Element | null): boolean =>
      el !== null && inner !== null && el.contains(inner);

    it("moves focus to the active panel wrapper after navigating (default 'panel')", async () => {
      const user = userEvent.setup();

      render(
        <MultiStep mode="unmount">
          <FocusStep title="One" />
          <FocusStep title="Two" />
        </MultiStep>
      );

      await user.click(screen.getByLabelText("advance-One"));

      // Step 2 is active; the wrapper around its content received focus. The
      // focused element is the tabIndex=-1 wrapper (a div), and it contains the
      // active step's heading.
      const focused = document.activeElement as HTMLElement;
      expect(focused.getAttribute("tabindex")).toBe("-1");
      expect(within_(focused, screen.getByText("Two"))).toBe(true);
    });

    it("focuses the heading inside the active step when focusOnStepChange='heading'", async () => {
      const user = userEvent.setup();

      render(
        <MultiStep mode="unmount" focusOnStepChange="heading">
          <FocusStep title="One" />
          <FocusStep title="Two" />
        </MultiStep>
      );

      await user.click(screen.getByLabelText("advance-One"));

      // The heading element of the now-active step receives focus directly.
      const focused = document.activeElement as HTMLElement;
      expect(focused.tagName).toBe("H2");
      expect(focused.textContent).toBe("Two");
      expect(focused.getAttribute("tabindex")).toBe("-1");
    });

    it("does not move focus when focusOnStepChange={false}", async () => {
      const user = userEvent.setup();

      render(
        <MultiStep mode="unmount" focusOnStepChange={false}>
          <FocusStep title="One" />
          <FocusStep title="Two" />
        </MultiStep>
      );

      // Move focus to a known element first, then navigate. The trigger button
      // unmounts with step 1, so afterward focus must NOT be on the new step's
      // wrapper/heading: it falls back to the document body (no wrapper is even
      // rendered in this mode).
      const trigger = screen.getByLabelText("advance-One") as HTMLElement;
      trigger.focus();
      expect(document.activeElement).toBe(trigger);

      await user.click(trigger);

      // Step 2 is active but focus was not stolen onto its content.
      const focused = document.activeElement;
      expect(within_(screen.getByText("Two"), focused)).toBe(false);
      // No focus-wrapper div (a div[tabindex="-1"]) is rendered around the step
      // when focus management is off: the active child renders bare.
      const hasFocusWrapper = (el: HTMLElement | null): boolean => {
        let node = el;
        while (node) {
          if (node.tagName === "DIV" && node.getAttribute("tabindex") === "-1") return true;
          node = node.parentElement;
        }
        return false;
      };
      expect(hasFocusWrapper(screen.getByText("Two") as HTMLElement)).toBe(false);
    });

    it("does not steal focus on initial mount", () => {
      // Put focus on an external element, then mount the wizard. The mount-time
      // layout effect must early-return (previousActive === activeChild), so
      // focus stays where it was.
      const outside = document.createElement("button");
      outside.setAttribute("aria-label", "outside");
      document.body.appendChild(outside);
      outside.focus();
      expect(document.activeElement).toBe(outside);

      render(
        <MultiStep mode="unmount">
          <FocusStep title="One" />
          <FocusStep title="Two" />
        </MultiStep>
      );

      // Focus was not moved into the wizard on first render.
      expect(document.activeElement).toBe(outside);
      outside.remove();
    });

    it("moves focus to the active step wrapper after navigating in default keepMounted mode", async () => {
      const user = userEvent.setup();

      // No `mode` prop -> default keepMounted: every step stays mounted, each in
      // its own wrapper div, and the active wrapper carries tabIndex=-1 + the
      // focus ref. This covers the default mode, which had no focus test (the
      // existing focus tests all force mode="unmount").
      render(
        <MultiStep>
          <FocusStep title="One" />
          <FocusStep title="Two" />
        </MultiStep>
      );

      // Advance from inside step One's content (its Next button drives next()).
      await user.click(screen.getByLabelText("advance-One"));

      // Step Two is active; focus landed on its tabIndex=-1 wrapper, which
      // contains the now-active step's heading. (In keepMounted all headings are
      // mounted, so assert containment of the ACTIVE step's heading specifically.)
      const focused = document.activeElement as HTMLElement;
      expect(focused.tagName).toBe("DIV");
      expect(focused.getAttribute("tabindex")).toBe("-1");
      expect(within_(focused, screen.getByText("Two"))).toBe(true);
      // The focused wrapper is the active one: step One's heading is NOT inside it.
      expect(within_(focused, screen.getByText("One"))).toBe(false);
    });

    it("focuses the heading in default keepMounted mode when focusOnStepChange='heading'", async () => {
      const user = userEvent.setup();

      render(
        <MultiStep focusOnStepChange="heading">
          <FocusStep title="One" />
          <FocusStep title="Two" />
        </MultiStep>
      );

      await user.click(screen.getByLabelText("advance-One"));

      // The active step's heading received focus directly (made focusable with
      // tabIndex=-1), even though every step stays mounted in keepMounted.
      const focused = document.activeElement as HTMLElement;
      expect(focused.tagName).toBe("H2");
      expect(focused.textContent).toBe("Two");
      expect(focused.getAttribute("tabindex")).toBe("-1");
    });
  });

  describe("beforeStepChange guard", () => {
    // A step that reports valid and captures the full wizard API so a test can
    // drive navigation (next/previous/goToStep) and read isNavigating.
    const makeApiProbe = () => {
      let captured: MultiStepApi | undefined;
      const Probe = ({ title }: StepComponentProps<{ title: string }>) => {
        const report = useReportValidity();
        useEffect(() => {
          report({ status: "valid" });
        }, [report]);
        captured = useMultiStep();
        return <p>{title}</p>;
      };
      const getApi = (): MultiStepApi => {
        if (!captured) throw new Error("api probe was never rendered");
        return captured;
      };
      return { Probe, getApi };
    };

    // A manually-resolvable promise so a test can hold an async guard pending
    // while it asserts on isNavigating, then settle it on demand.
    const defer = <T,>() => {
      let resolve!: (value: T) => void;
      let reject!: (reason?: unknown) => void;
      const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return { promise, resolve, reject };
    };

    // A typed beforeStepChange spy. vi.fn() here would type the prop as Mock
    // (returning unknown), which is not assignable to the guard signature, so we
    // wrap a typed impl and record calls/events ourselves.
    type Guard = NonNullable<MultiStepProps["beforeStepChange"]>;
    const spyGuard = (impl: Guard) => {
      const events: StepChangeEvent[] = [];
      const fn: Guard = (event) => {
        events.push(event);
        return impl(event);
      };
      return { fn, events, get calls() {
        return events.length;
      } };
    };

    it("vetoes the change when the guard returns false (active step unchanged)", async () => {
      const guard = spyGuard(() => false);
      const onStepChange = vi.fn();
      const { Probe, getApi } = makeApiProbe();

      render(
        <MultiStep beforeStepChange={guard.fn} onStepChange={onStepChange}>
          <Probe title="One" />
          <Probe title="Two" />
        </MultiStep>
      );

      await flushAsync();
      await act(() => getApi().next());
      await flushAsync();

      // The guard ran but returned false, so the step did not change and
      // onStepChange never fired.
      expect(guard.calls).toBe(1);
      expect(getApi().activeStep).toBe(0);
      expect(onStepChange.mock.calls).toHaveLength(0);
      // A synchronous false also leaves isNavigating cleared.
      expect(getApi().isNavigating).toBe(false);
    });

    it("passes a StepChangeEvent describing the requested move", async () => {
      const events: StepChangeEvent[] = [];
      const beforeStepChange = (event: StepChangeEvent) => {
        events.push(event);
      };
      const { Probe, getApi } = makeApiProbe();

      render(
        <MultiStep beforeStepChange={beforeStepChange}>
          <Probe title="One" />
          <Probe title="Two" />
          <Probe title="Three" />
        </MultiStep>
      );

      await flushAsync();
      // next(): 0 -> 1 is "next".
      await act(() => getApi().next());
      await flushAsync();
      // previous(): 1 -> 0 is "previous".
      await act(() => getApi().previous());
      await flushAsync();
      // goToStep(2) from 0: a non-adjacent move is "jump".
      await act(() => getApi().goToStep(2));
      await flushAsync();

      expect(events).toEqual([
        { from: 0, to: 1, direction: "next" },
        { from: 1, to: 0, direction: "previous" },
        { from: 0, to: 2, direction: "jump" },
      ]);
    });

    it("allows the change when the guard returns true", async () => {
      const guard = spyGuard(() => true);
      const { Probe, getApi } = makeApiProbe();

      render(
        <MultiStep beforeStepChange={guard.fn}>
          <Probe title="One" />
          <Probe title="Two" />
        </MultiStep>
      );

      await flushAsync();
      await act(() => getApi().next());
      await flushAsync();

      expect(getApi().activeStep).toBe(1);
    });

    it("allows the change when the guard returns undefined (void)", async () => {
      // Returning nothing must be treated as allow, not veto.
      const guard = spyGuard(() => undefined);
      const { Probe, getApi } = makeApiProbe();

      render(
        <MultiStep beforeStepChange={guard.fn}>
          <Probe title="One" />
          <Probe title="Two" />
        </MultiStep>
      );

      await flushAsync();
      await act(() => getApi().next());
      await flushAsync();

      expect(getApi().activeStep).toBe(1);
    });

    it("toggles isNavigating true-then-false and applies the change after the guard resolves", async () => {
      const gate = defer<boolean>();
      const beforeStepChange = () => gate.promise;
      const { Probe, getApi } = makeApiProbe();

      render(
        <MultiStep beforeStepChange={beforeStepChange}>
          <Probe title="One" />
          <Probe title="Two" />
        </MultiStep>
      );

      await flushAsync();
      expect(getApi().isNavigating).toBe(false);

      // Kick off the navigation; the guard is still pending.
      await act(() => getApi().next());
      await flushAsync();

      // While the async guard is in flight, isNavigating is true and the step
      // has NOT changed yet.
      expect(getApi().isNavigating).toBe(true);
      expect(getApi().activeStep).toBe(0);

      // Resolve the guard with true: the change commits and isNavigating clears.
      await act(async () => {
        gate.resolve(true);
        await gate.promise;
      });
      await flushAsync();

      expect(getApi().activeStep).toBe(1);
      expect(getApi().isNavigating).toBe(false);
    });

    it("aborts the change when an async guard rejects, clearing isNavigating", async () => {
      const gate = defer<boolean>();
      const beforeStepChange = () => gate.promise;
      const onStepChange = vi.fn();
      const { Probe, getApi } = makeApiProbe();

      render(
        <MultiStep beforeStepChange={beforeStepChange} onStepChange={onStepChange}>
          <Probe title="One" />
          <Probe title="Two" />
        </MultiStep>
      );

      await flushAsync();
      await act(() => getApi().next());
      await flushAsync();
      expect(getApi().isNavigating).toBe(true);

      // Reject the guard: the change aborts, the step stays put, isNavigating
      // clears (the finally block runs), and onStepChange never fires.
      await act(async () => {
        gate.reject(new Error("blocked"));
        await gate.promise.catch(() => {});
      });
      await flushAsync();

      expect(getApi().activeStep).toBe(0);
      expect(getApi().isNavigating).toBe(false);
      expect(onStepChange.mock.calls).toHaveLength(0);
    });

    it("aborts the change when a synchronous guard throws", async () => {
      const beforeStepChange = () => {
        throw new Error("nope");
      };
      const onStepChange = vi.fn();
      const { Probe, getApi } = makeApiProbe();

      render(
        <MultiStep beforeStepChange={beforeStepChange} onStepChange={onStepChange}>
          <Probe title="One" />
          <Probe title="Two" />
        </MultiStep>
      );

      await flushAsync();
      await act(() => getApi().next());
      await flushAsync();

      // The throw is caught inside the guard runner: no navigation, no callback,
      // isNavigating settles back to false.
      expect(getApi().activeStep).toBe(0);
      expect(getApi().isNavigating).toBe(false);
      expect(onStepChange.mock.calls).toHaveLength(0);
    });

    it("ignores an overlapping goToStep while an async guard is in flight", async () => {
      const gate = defer<boolean>();
      const guard = spyGuard(() => gate.promise);
      const { Probe, getApi } = makeApiProbe();

      render(
        <MultiStep beforeStepChange={guard.fn}>
          <Probe title="One" />
          <Probe title="Two" />
          <Probe title="Three" />
        </MultiStep>
      );

      await flushAsync();
      // Start a 0 -> 1 navigation; the guard stays pending.
      await act(() => getApi().goToStep(1));
      await flushAsync();
      expect(getApi().isNavigating).toBe(true);
      expect(guard.calls).toBe(1);

      // A second goToStep while isNavigating is dropped: the guard is not invoked
      // again and no extra navigation queues up.
      await act(() => getApi().goToStep(2));
      await flushAsync();
      expect(guard.calls).toBe(1);

      // Resolve the first guard: only the original 0 -> 1 move commits.
      await act(async () => {
        gate.resolve(true);
        await gate.promise;
      });
      await flushAsync();

      expect(getApi().activeStep).toBe(1);
      expect(getApi().isNavigating).toBe(false);
    });

    it("drops a second same-batch navigation via the synchronous navigatingRef latch", async () => {
      // Regression for the nav-race: two navigation calls fired in ONE act()
      // batch (synchronously, before any commit/re-render) must not both run the
      // async guard. The existing overlap test above settles the first guard
      // across SEPARATE act() calls and relies on the post-commit isNavigating
      // mirror; this one fires both calls in the same synchronous tick, so the
      // mirror is still false for both - only the synchronous navigatingRef latch
      // can drop the second. The guard must run ONCE and onStepChange ONCE.
      const gate = defer<boolean>();
      const guard = spyGuard(() => gate.promise);
      const onStepChange = vi.fn();
      const { Probe, getApi } = makeApiProbe();

      render(
        <MultiStep beforeStepChange={guard.fn} onStepChange={onStepChange}>
          <Probe title="One" />
          <Probe title="Two" />
          <Probe title="Three" />
        </MultiStep>
      );

      await flushAsync();

      // Two synchronous calls in a single act() batch: the first latches
      // navigatingRef.current = true before its await; the second sees the latch
      // and returns immediately. No re-render happens between them.
      await act(() => {
        getApi().goToStep(1);
        getApi().goToStep(2);
      });
      await flushAsync();

      // The latch dropped the second call: the guard ran exactly once.
      expect(guard.calls).toBe(1);
      expect(guard.events).toEqual([{ from: 0, to: 1, direction: "next" }]);
      // Still pending: the change has not committed and nothing fired yet.
      expect(getApi().isNavigating).toBe(true);
      expect(getApi().activeStep).toBe(0);
      expect(onStepChange.mock.calls).toHaveLength(0);

      // Resolve the single in-flight guard: only the first move (0 -> 1) commits,
      // and onStepChange fires exactly once with the first target.
      await act(async () => {
        gate.resolve(true);
        await gate.promise;
      });
      await flushAsync();

      expect(guard.calls).toBe(1);
      expect(onStepChange.mock.calls).toHaveLength(1);
      expect(onStepChange).toHaveBeenCalledWith(1);
      expect(getApi().activeStep).toBe(1);
      expect(getApi().isNavigating).toBe(false);
    });

    it("commits synchronously with no isNavigating flip when no guard is provided", async () => {
      // Without beforeStepChange the navigation is fully synchronous and
      // isNavigating is never set true.
      const seen: boolean[] = [];
      const { Probe, getApi } = makeApiProbe();

      render(
        <MultiStep>
          <Probe title="One" />
          <Probe title="Two" />
        </MultiStep>
      );

      await flushAsync();
      await act(() => {
        getApi().next();
        seen.push(getApi().isNavigating);
      });
      await flushAsync();

      expect(seen).toEqual([false]);
      expect(getApi().activeStep).toBe(1);
      expect(getApi().isNavigating).toBe(false);
    });

    it("does not run beforeStepChange for complete()", async () => {
      const guard = spyGuard(() => false);
      const onComplete = vi.fn();
      const { Probe, getApi } = makeApiProbe();

      // Start on the last (valid) step so complete() succeeds.
      render(
        <MultiStep defaultStep={1} beforeStepChange={guard.fn} onComplete={onComplete}>
          <Probe title="One" />
          <Probe title="Two" />
        </MultiStep>
      );

      await flushAsync();
      await act(() => getApi().complete());
      await flushAsync();

      // complete() is completion, not a step change: the guard must not run, and
      // onComplete fires despite the guard returning false.
      expect(guard.calls).toBe(0);
      expect(onComplete.mock.calls).toHaveLength(1);
    });
  });

  describe("useReducedMotion", () => {
    // A tiny consumer that surfaces the hook's value as text.
    const MotionProbe = () => {
      const reduced = useReducedMotion();
      return <span data-testid="rm">{reduced ? "reduced" : "full"}</span>;
    };

    // Install a window.matchMedia stub whose `matches` reflects whether the query
    // is the reduced-motion query. Returns a restore function.
    const stubMatchMedia = (matches: boolean) => {
      const original = window.matchMedia;
      const matchMedia = ((query: string) => ({
        matches: query === "(prefers-reduced-motion: reduce)" ? matches : false,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      })) as unknown as typeof window.matchMedia;
      window.matchMedia = matchMedia;
      return () => {
        if (original) window.matchMedia = original;
        else delete (window as { matchMedia?: typeof window.matchMedia }).matchMedia;
      };
    };

    it("reflects the matched reduced-motion query (true)", () => {
      const restore = stubMatchMedia(true);
      try {
        render(<MotionProbe />);
        expect(screen.getByText("reduced")).toBeInTheDocument();
      } finally {
        restore();
      }
    });

    it("reflects the matched reduced-motion query (false)", () => {
      const restore = stubMatchMedia(false);
      try {
        render(<MotionProbe />);
        expect(screen.getByText("full")).toBeInTheDocument();
      } finally {
        restore();
      }
    });

    it("is SSR-safe and returns false when matchMedia is absent", () => {
      const original = window.matchMedia;
      // Remove matchMedia entirely to mimic a no-DOM environment. getSnapshot's
      // getMatcher() returns null, so the hook must not throw and reports false.
      delete (window as { matchMedia?: typeof window.matchMedia }).matchMedia;
      try {
        render(<MotionProbe />);
        expect(screen.getByText("full")).toBeInTheDocument();
      } finally {
        if (original) window.matchMedia = original;
      }
    });

    // A controllable MediaQueryList stub: addEventListener captures the "change"
    // listener so a test can flip `matches` and fire it, driving the hook's
    // useSyncExternalStore subscription to re-read getSnapshot. matchMedia returns
    // the SAME object every call, so getSnapshot sees the mutated `matches`.
    const controllableMatchMedia = (initial: boolean) => {
      let matches = initial;
      const listeners = new Set<(event: { matches: boolean }) => void>();
      const mql = {
        get matches() {
          return matches;
        },
        media: "(prefers-reduced-motion: reduce)",
        onchange: null,
        addEventListener: (type: string, listener: (event: { matches: boolean }) => void) => {
          if (type === "change") listeners.add(listener);
        },
        removeEventListener: (type: string, listener: (event: { matches: boolean }) => void) => {
          if (type === "change") listeners.delete(listener);
        },
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      };
      const original = window.matchMedia;
      window.matchMedia = (() => mql) as unknown as typeof window.matchMedia;
      // Flip `matches` and notify every captured listener, as the platform would
      // when the media query result changes.
      const fireChange = (next: boolean) => {
        matches = next;
        for (const listener of listeners) listener({ matches: next });
      };
      const restore = () => {
        if (original) window.matchMedia = original;
        else delete (window as { matchMedia?: typeof window.matchMedia }).matchMedia;
      };
      return { fireChange, restore };
    };

    it("re-renders when the media query fires a change event", async () => {
      const media = controllableMatchMedia(false);
      try {
        render(<MotionProbe />);
        // Initial snapshot: matches=false -> "full".
        expect(screen.getByText("full")).toBeInTheDocument();

        // Flip the query to reduced and fire the captured "change" listener inside
        // act() so React processes the store update and re-renders.
        await act(() => media.fireChange(true));
        expect(screen.getByText("reduced")).toBeInTheDocument();

        // Flip back: the hook tracks the change in both directions.
        await act(() => media.fireChange(false));
        expect(screen.getByText("full")).toBeInTheDocument();
      } finally {
        media.restore();
      }
    });
  });

  describe("SSR (server render)", () => {
    // A step that reports validity from an effect via useReportValidity. On the
    // server, effects do not run, so the report is never called - the render must
    // still produce HTML and not throw.
    const SsrStep = ({ title }: StepComponentProps<{ title: string }>) => {
      const report = useReportValidity();
      useEffect(() => {
        report({ status: "valid" });
      }, [report]);
      return <p>{title}</p>;
    };

    it("renderToString produces HTML for a MultiStep without throwing", () => {
      // The provider tree, the steps using useReportValidity, the useId-derived
      // ids, and useReducedMotion's getServerSnapshot must all be no-DOM safe.
      const html = renderToString(
        <MultiStep>
          <SsrStep title="One" />
          <SsrStep title="Two" />
        </MultiStep>
      );

      expect(typeof html).toBe("string");
      expect(html.length > 0).toBe(true);
      // keepMounted (default) renders every step subtree, so both step contents
      // are present in the server markup.
      expect(html).toContain("One");
      expect(html).toContain("Two");
    });

    it("renders a step that reads useReducedMotion without DOM access", () => {
      // useReducedMotion must take its getServerSnapshot (false) path under
      // renderToString: there is no window.matchMedia subscription on the server.
      const MotionStep = ({ title }: StepComponentProps<{ title: string }>) => {
        const report = useReportValidity();
        useEffect(() => {
          report({ status: "valid" });
        }, [report]);
        const reduced = useReducedMotion();
        return <p>{`${title}:${reduced ? "reduced" : "full"}`}</p>;
      };

      const html = renderToString(
        <MultiStep>
          <MotionStep title="Solo" />
        </MultiStep>
      );

      // getServerSnapshot returns false -> "full" in the server markup, no throw.
      expect(html).toContain("Solo:full");
    });
  });
});
