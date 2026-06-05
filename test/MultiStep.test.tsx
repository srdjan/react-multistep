import { describe, it, expect, vi, render, screen, fireEvent, within } from "./harness";
import userEvent from "./harness";
import React, { useEffect } from "react";
import MultiStep from "../src/MultiStep";
import {
  useMultiStepState,
  useMultiStepNavigation,
  useReportValidity,
} from "../src/MultiStepContext";
import type { MultiStepProps, StepComponentProps, StepValidity } from "../src/interfaces";

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
                id={step.tabId}
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
      <div role="tabpanel" id={active?.panelId} aria-labelledby={active?.tabId}>
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
      const tabId = tabs[0]!.getAttribute("id");
      const controls = tabs[0]!.getAttribute("aria-controls");
      expect(typeof tabId === "string" && tabId.length > 0).toBe(true);
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
});
