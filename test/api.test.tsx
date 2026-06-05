import { describe, it, expect, vi, render } from "./harness";
import React, { useEffect } from "react";
import MultiStep from "../src/MultiStep";
import {
  useMultiStep,
  useMultiStepState,
  useMultiStepNavigation,
  useMultiStepA11y,
  useReportValidity,
  type MultiStepApi,
  type MultiStepA11y,
} from "../src/MultiStepContext";
import type { StepComponentProps, StepValidity } from "../src/interfaces";
import * as publicApi from "../src/index";

type StepProps = StepComponentProps<{ title: string }>;

// A step that reports a fixed validity and captures the a11y prop-getters so a
// test can read what they produce without rendering chrome of its own.
const makeA11yProbe = (validity: StepValidity = { status: "valid" }) => {
  let captured: MultiStepA11y | undefined;
  const Probe = (_props: StepProps) => {
    const report = useReportValidity();
    useEffect(() => {
      report(validity);
    }, [report]);
    captured = useMultiStepA11y();
    return <div>probe</div>;
  };
  const getA11y = (): MultiStepA11y => {
    if (!captured) throw new Error("a11y probe was never rendered");
    return captured;
  };
  return { Probe, getA11y };
};

// A step that reports the validity passed via props (so a test can hold several
// steps at different statuses) and captures the full API.
const makeStatusProbe = () => {
  let captured: MultiStepApi | undefined;
  const Probe = ({ validity }: StepComponentProps<{ title: string; validity: StepValidity }>) => {
    const report = useReportValidity();
    useEffect(() => {
      report(validity);
    }, [report, validity]);
    captured = useMultiStep();
    return <div>probe</div>;
  };
  const getApi = (): MultiStepApi => {
    if (!captured) throw new Error("status probe was never rendered");
    return captured;
  };
  return { Probe, getApi };
};

// Like makeStatusProbe but captures the a11y prop-getters - lets a test drive
// step status via props while reading getNextButtonProps/getCompleteButtonProps.
const makeStatusProbeA11y = () => {
  let captured: MultiStepA11y | undefined;
  const Probe = ({ validity }: StepComponentProps<{ title: string; validity: StepValidity }>) => {
    const report = useReportValidity();
    useEffect(() => {
      report(validity);
    }, [report, validity]);
    captured = useMultiStepA11y();
    return <div>probe</div>;
  };
  const getA11y = (): MultiStepA11y => {
    if (!captured) throw new Error("a11y status probe was never rendered");
    return captured;
  };
  return { Probe, getA11y };
};

// A step that reports valid and captures the wizard API for the test to read.
// getApi() throws if the probe never rendered, so callers don't deal with undefined.
const makeProbe = () => {
  let captured: MultiStepApi | undefined;
  const Probe = (_props: StepProps) => {
    const report = useReportValidity();
    useEffect(() => {
      report({ status: "valid" });
    }, [report]);
    captured = useMultiStep();
    return <div>probe</div>;
  };
  const getApi = (): MultiStepApi => {
    if (!captured) throw new Error("probe was never rendered");
    return captured;
  };
  return { Probe, getApi };
};

describe("public API surface", () => {
  it("exposes exactly the expected runtime exports", () => {
    const keys = Object.keys(publicApi).sort().join(",");
    expect(keys).toBe(
      "default,useMultiStep,useMultiStepA11y,useMultiStepNavigation,useMultiStepState,useReducedMotion,useReportValidity"
    );
  });

  it("exposes MultiStep as the default export", () => {
    expect(typeof publicApi.default).toBe("function");
    expect(publicApi.default).toBe(MultiStep);
  });
});

describe("useMultiStep() shape", () => {
  it("returns the full MultiStepApi", () => {
    const { Probe, getApi } = makeProbe();

    render(
      <MultiStep>
        <Probe title="One" />
        <Probe title="Two" />
      </MultiStep>
    );

    const api = getApi();
    expect(typeof api.activeStep).toBe("number");
    expect(api.stepCount).toBe(2);
    expect(Array.isArray(api.steps)).toBe(true);
    expect(api.steps).toHaveLength(2);
    expect(typeof api.goToStep).toBe("function");
    expect(typeof api.next).toBe("function");
    expect(typeof api.previous).toBe("function");
    expect(typeof api.isStepValid).toBe("function");
    expect(api.currentStepValid).toBe(true);
    expect(api.isStepValid(0)).toBe(true);
  });

  it("exposes the new Step metadata fields", () => {
    const { Probe, getApi } = makeProbe();

    render(
      <MultiStep>
        <Probe title="One" />
        <Probe title="Two" />
      </MultiStep>
    );

    const [first, second] = getApi().steps;
    // index / isActive / status / isValid / title / tabId / panelId
    expect(first!.index).toBe(0);
    expect(first!.isActive).toBe(true);
    expect(second!.isActive).toBe(false);
    // Reported valid -> status "valid" and the derived isValid flag agrees.
    expect(first!.status).toBe("valid");
    expect(first!.isValid).toBe(first!.status === "valid");
    // ids come from useId: assert presence + tab/panel relationship, not literals.
    expect(typeof first!.tabId).toBe("string");
    expect(first!.tabId.length > 0).toBe(true);
    expect(first!.panelId.length > 0).toBe(true);
    expect(first!.tabId).not.toBe(second!.tabId);
    expect(first!.panelId).not.toBe(second!.panelId);
  });

  it("derives pristine/visited status from the visited flag", () => {
    // A step that never reports stays pending; status is pristine until visited.
    let captured: MultiStepApi | undefined;
    const SilentStep = (_props: StepProps) => {
      useReportValidity(); // resolves index but never reports
      captured = useMultiStep();
      return <div>silent</div>;
    };

    render(
      <MultiStep>
        <SilentStep title="One" />
        <SilentStep title="Two" />
      </MultiStep>
    );

    const steps = captured!.steps;
    // Step 0 is the initial active step -> visited -> "visited".
    expect(steps[0]!.status).toBe("visited");
    // Step 1 never visited, never reported -> "pristine".
    expect(steps[1]!.status).toBe("pristine");
    expect(steps[0]!.isValid).toBe(false);
  });
});

describe("derived state helpers", () => {
  it("derives isFirst / isLast / progress across positions", () => {
    const { Probe, getApi } = makeProbe();

    // Controlled activeStep so a rerender actually moves the active step
    // (defaultStep only seeds the initial mount).
    const { rerender } = render(
      <MultiStep activeStep={0}>
        <Probe title="One" />
        <Probe title="Two" />
        <Probe title="Three" />
      </MultiStep>
    );

    // First step: isFirst true, isLast false, progress 0/(3-1) = 0.
    let api = getApi();
    expect(api.isFirst).toBe(true);
    expect(api.isLast).toBe(false);
    expect(api.progress).toBe(0);

    rerender(
      <MultiStep activeStep={1}>
        <Probe title="One" />
        <Probe title="Two" />
        <Probe title="Three" />
      </MultiStep>
    );
    api = getApi();
    expect(api.isFirst).toBe(false);
    expect(api.isLast).toBe(false);
    expect(api.progress).toBe(0.5);

    rerender(
      <MultiStep activeStep={2}>
        <Probe title="One" />
        <Probe title="Two" />
        <Probe title="Three" />
      </MultiStep>
    );
    api = getApi();
    expect(api.isFirst).toBe(false);
    expect(api.isLast).toBe(true);
    expect(api.progress).toBe(1);
  });

  it("reports progress 1 for a single-step wizard", () => {
    const { Probe, getApi } = makeProbe();

    render(
      <MultiStep>
        <Probe title="Only" />
      </MultiStep>
    );

    const api = getApi();
    expect(api.isFirst).toBe(true);
    expect(api.isLast).toBe(true);
    expect(api.progress).toBe(1);
  });

  it("tracks visitedSteps and completedSteps from step status", () => {
    // Step 0 is the active (visited) step and reports valid; step 1 reports
    // invalid (so it is mounted and visited under keepMounted but not valid);
    // step 2 never reports and is never visited -> pristine.
    const { Probe, getApi } = makeStatusProbe();
    let captured2: MultiStepApi | undefined;
    const Silent = (_props: StepProps) => {
      useReportValidity();
      captured2 = useMultiStep();
      return <div>silent</div>;
    };
    void captured2;

    render(
      <MultiStep>
        <Probe title="One" validity={{ status: "valid" }} />
        <Probe title="Two" validity={{ status: "invalid", message: "nope" }} />
        <Silent title="Three" />
      </MultiStep>
    );

    const api = getApi();
    const steps = api.steps;
    // status: [valid, invalid, pristine]
    expect(steps.map((s) => s.status)).toEqual(["valid", "invalid", "pristine"]);
    // visited = status !== "pristine" -> indices 0 and 1.
    expect(api.visitedSteps).toEqual([0, 1]);
    // completed = status === "valid" -> index 0 only.
    expect(api.completedSteps).toEqual([0]);
  });

  it("exposes currentStepError only when the active step is invalid", () => {
    const { Probe, getApi } = makeStatusProbe();

    const { rerender } = render(
      <MultiStep>
        <Probe title="One" validity={{ status: "invalid", message: "fix me" }} />
        <Probe title="Two" validity={{ status: "valid" }} />
      </MultiStep>
    );

    // Active step (0) is invalid with a message -> currentStepError is that message.
    expect(getApi().currentStepError).toBe("fix me");

    // Active step now reports valid -> currentStepError clears to undefined.
    rerender(
      <MultiStep>
        <Probe title="One" validity={{ status: "valid" }} />
        <Probe title="Two" validity={{ status: "valid" }} />
      </MultiStep>
    );
    expect(getApi().currentStepError).toBe(undefined);
  });

  it("leaves currentStepError undefined for an invalid step without a message", () => {
    const { Probe, getApi } = makeStatusProbe();

    render(
      <MultiStep>
        <Probe title="One" validity={{ status: "invalid" }} />
        <Probe title="Two" validity={{ status: "valid" }} />
      </MultiStep>
    );

    // status is "invalid" but validity.message is undefined -> field stays undefined.
    expect(getApi().steps[0]!.status).toBe("invalid");
    expect(getApi().currentStepError).toBe(undefined);
  });

  it("sets canComplete only on a valid last step", () => {
    const { Probe, getApi } = makeStatusProbe();

    // Two valid steps, starting on the last (valid) step -> canComplete true.
    // Controlled activeStep so the rerenders below move the active step.
    const { rerender } = render(
      <MultiStep activeStep={1}>
        <Probe title="One" validity={{ status: "valid" }} />
        <Probe title="Two" validity={{ status: "valid" }} />
      </MultiStep>
    );
    expect(getApi().isLast).toBe(true);
    expect(getApi().canComplete).toBe(true);

    // Last step invalid -> canComplete false even though it is the last step.
    rerender(
      <MultiStep activeStep={1}>
        <Probe title="One" validity={{ status: "valid" }} />
        <Probe title="Two" validity={{ status: "invalid", message: "x" }} />
      </MultiStep>
    );
    expect(getApi().isLast).toBe(true);
    expect(getApi().canComplete).toBe(false);

    // Valid but NOT the last step -> canComplete false.
    rerender(
      <MultiStep activeStep={0}>
        <Probe title="One" validity={{ status: "valid" }} />
        <Probe title="Two" validity={{ status: "valid" }} />
      </MultiStep>
    );
    expect(getApi().isLast).toBe(false);
    expect(getApi().canComplete).toBe(false);
  });
});

describe("complete()", () => {
  it("fires onComplete on a valid last step", () => {
    const onComplete = vi.fn();
    const onValidationError = vi.fn();
    const { Probe, getApi } = makeStatusProbe();

    render(
      <MultiStep defaultStep={1} onComplete={onComplete} onValidationError={onValidationError}>
        <Probe title="One" validity={{ status: "valid" }} />
        <Probe title="Two" validity={{ status: "valid" }} />
      </MultiStep>
    );

    getApi().complete();

    expect(onComplete.mock.calls).toHaveLength(1);
    expect(onValidationError.mock.calls).toHaveLength(0);
  });

  it("reports onValidationError when the last step is invalid", () => {
    const onComplete = vi.fn();
    const onValidationError = vi.fn();
    const { Probe, getApi } = makeStatusProbe();

    render(
      <MultiStep defaultStep={1} onComplete={onComplete} onValidationError={onValidationError}>
        <Probe title="One" validity={{ status: "valid" }} />
        <Probe title="Two" validity={{ status: "invalid", message: "x" }} />
      </MultiStep>
    );

    getApi().complete();

    expect(onComplete.mock.calls).toHaveLength(0);
    expect(onValidationError).toHaveBeenCalledWith(1);
  });

  it("reports onValidationError when not on the last step", () => {
    const onComplete = vi.fn();
    const onValidationError = vi.fn();
    const { Probe, getApi } = makeStatusProbe();

    // Active step 0 is valid but it is NOT the last step -> complete() must not
    // fire onComplete; it reports a validation error against the active index.
    render(
      <MultiStep defaultStep={0} onComplete={onComplete} onValidationError={onValidationError}>
        <Probe title="One" validity={{ status: "valid" }} />
        <Probe title="Two" validity={{ status: "valid" }} />
      </MultiStep>
    );

    getApi().complete();

    expect(onComplete.mock.calls).toHaveLength(0);
    expect(onValidationError).toHaveBeenCalledWith(0);
  });
});

describe("useMultiStepA11y() getters", () => {
  it("getStepListProps sets role=list and the Progress label", () => {
    const { Probe, getA11y } = makeA11yProbe();

    render(
      <MultiStep activeStep={0}>
        <Probe title="One" />
        <Probe title="Two" />
      </MultiStep>
    );

    const props = getA11y().getStepListProps();
    expect(props.role).toBe("list");
    expect(props["aria-label"]).toBe("Progress");
  });

  it("getStepProps wires id/aria-controls/data-status and aria-current on the active step", () => {
    const { Probe, getA11y } = makeA11yProbe();

    render(
      <MultiStep activeStep={0}>
        <Probe title="One" />
        <Probe title="Two" />
      </MultiStep>
    );

    const a11y = getA11y();
    const active = a11y.getStepProps(0);
    const other = a11y.getStepProps(1);

    expect(active.type).toBe("button");
    expect(active["aria-current"]).toBe("step");
    expect(other["aria-current"]).toBe(undefined);

    // id is the step's tabId; aria-controls is its panelId; data-status its status.
    expect(typeof active.id).toBe("string");
    expect((active.id as string).length > 0).toBe(true);
    expect(typeof active["aria-controls"]).toBe("string");
    expect((active["aria-controls"] as string).length > 0).toBe(true);
    expect(active["data-status"]).toBe("valid");
  });

  it("getStepProps disables a forward-locked step", () => {
    // Step 0 reports invalid; step 1 cannot be reached, so its step button is
    // disabled, while the current (0) step button is not.
    const { Probe, getA11y } = makeA11yProbe({ status: "invalid", message: "x" });

    render(
      <MultiStep>
        <Probe title="One" />
        <Probe title="Two" />
      </MultiStep>
    );

    const a11y = getA11y();
    // index <= activeStep is always navigable -> step 0 enabled.
    expect(a11y.getStepProps(0).disabled).toBe(false);
    // step 0 not valid -> forward gate to index 1 is closed -> disabled.
    expect(a11y.getStepProps(1).disabled).toBe(true);
  });

  it("getStepProps composes its goToStep onClick with a caller override", () => {
    const { Probe, getA11y } = makeA11yProbe();

    render(
      <MultiStep activeStep={0}>
        <Probe title="One" />
        <Probe title="Two" />
      </MultiStep>
    );

    // Invoking the composed onClick runs the caller override (base goToStep(1)
    // runs first; both must fire). We assert the override ran via a side effect.
    const calls: string[] = [];
    const props = getA11y().getStepProps(1, { onClick: () => calls.push("override") });
    expect(typeof props.onClick).toBe("function");
    props.onClick?.({} as React.MouseEvent<HTMLButtonElement>);
    expect(calls).toEqual(["override"]);
  });

  it("getPanelProps sets id, aria-labelledby and tabIndex -1", () => {
    const { Probe, getA11y } = makeA11yProbe();

    render(
      <MultiStep>
        <Probe title="One" />
        <Probe title="Two" />
      </MultiStep>
    );

    const a11y = getA11y();
    const panel = a11y.getPanelProps();
    const activeStep = a11y.getStepProps(0);

    expect(panel.role).toBe("region");
    expect(panel.tabIndex).toBe(-1);
    // The panel id matches the active step button's aria-controls, and the
    // panel's aria-labelledby matches the active step button's id.
    expect(panel.id).toBe(activeStep["aria-controls"]);
    expect(panel["aria-labelledby"]).toBe(activeStep.id);
  });

  it("getErrorRegionProps uses role=status and a polite live region", () => {
    const { Probe, getA11y } = makeA11yProbe();

    render(
      <MultiStep>
        <Probe title="One" />
        <Probe title="Two" />
      </MultiStep>
    );

    const props = getA11y().getErrorRegionProps();
    expect(props.role).toBe("status");
    expect(props["aria-live"]).toBe("polite");
    expect(props["aria-atomic"]).toBe(true);
  });

  it("getPreviousButtonProps disables on the first step", () => {
    const { Probe, getA11y } = makeA11yProbe();

    const { rerender } = render(
      <MultiStep activeStep={0}>
        <Probe title="One" />
        <Probe title="Two" />
      </MultiStep>
    );

    let prev = getA11y().getPreviousButtonProps();
    expect(prev.type).toBe("button");
    expect(prev["aria-label"]).toBe("Previous step");
    expect(prev.disabled).toBe(true);

    rerender(
      <MultiStep activeStep={1}>
        <Probe title="One" />
        <Probe title="Two" />
      </MultiStep>
    );
    prev = getA11y().getPreviousButtonProps();
    expect(prev.disabled).toBe(false);
  });

  it("getNextButtonProps disables when the current step is invalid", () => {
    const { Probe, getA11y } = makeStatusProbeA11y();

    const { rerender } = render(
      <MultiStep>
        <Probe title="One" validity={{ status: "invalid", message: "x" }} />
        <Probe title="Two" validity={{ status: "valid" }} />
      </MultiStep>
    );

    let next = getA11y().getNextButtonProps();
    expect(next.type).toBe("button");
    expect(next["aria-label"]).toBe("Next step");
    expect(next.disabled).toBe(true);

    // Current step now valid -> Next button enabled.
    rerender(
      <MultiStep>
        <Probe title="One" validity={{ status: "valid" }} />
        <Probe title="Two" validity={{ status: "valid" }} />
      </MultiStep>
    );
    next = getA11y().getNextButtonProps();
    expect(next.disabled).toBe(false);
  });

  it("getNextButtonProps disables on the last step", () => {
    const { Probe, getA11y } = makeStatusProbeA11y();

    render(
      <MultiStep defaultStep={1}>
        <Probe title="One" validity={{ status: "valid" }} />
        <Probe title="Two" validity={{ status: "valid" }} />
      </MultiStep>
    );

    const next = getA11y().getNextButtonProps();
    expect(next.type).toBe("button");
    expect(next["aria-label"]).toBe("Next step");
    expect(next.disabled).toBe(true);
  });

  it("getCompleteButtonProps disables unless canComplete (no default aria-label)", () => {
    const { Probe, getA11y } = makeStatusProbeA11y();

    // Last step valid -> canComplete -> enabled.
    const { rerender } = render(
      <MultiStep defaultStep={1}>
        <Probe title="One" validity={{ status: "valid" }} />
        <Probe title="Two" validity={{ status: "valid" }} />
      </MultiStep>
    );

    let complete = getA11y().getCompleteButtonProps();
    expect(complete.type).toBe("button");
    expect(complete.disabled).toBe(false);
    // The spec sets no default aria-label on the complete button.
    expect(complete["aria-label"]).toBe(undefined);

    // Last step invalid -> not canComplete -> disabled.
    rerender(
      <MultiStep defaultStep={1}>
        <Probe title="One" validity={{ status: "valid" }} />
        <Probe title="Two" validity={{ status: "invalid", message: "x" }} />
      </MultiStep>
    );
    complete = getA11y().getCompleteButtonProps();
    expect(complete.disabled).toBe(true);
  });

  it("throws outside a MultiStep provider", () => {
    const Bare = () => {
      useMultiStepA11y();
      return null;
    };
    expect(() => render(<Bare />)).toThrow(
      "useMultiStep must be used within a MultiStep component"
    );
  });
});

describe("provider guards", () => {
  it("useMultiStep throws outside MultiStep", () => {
    const Bare = () => {
      useMultiStep();
      return null;
    };
    expect(() => render(<Bare />)).toThrow(
      "useMultiStep must be used within a MultiStep component"
    );
  });

  it("useMultiStepState throws outside MultiStep", () => {
    const Bare = () => {
      useMultiStepState();
      return null;
    };
    expect(() => render(<Bare />)).toThrow(
      "useMultiStepState must be used within a MultiStep component"
    );
  });

  it("useMultiStepNavigation throws outside MultiStep", () => {
    const Bare = () => {
      useMultiStepNavigation();
      return null;
    };
    expect(() => render(<Bare />)).toThrow(
      "useMultiStepNavigation must be used within a MultiStep component"
    );
  });

  it("useReportValidity throws outside a MultiStep step", () => {
    const Bare = () => {
      useReportValidity();
      return null;
    };
    expect(() => render(<Bare />)).toThrow(
      "useReportValidity must be used within a MultiStep step"
    );
  });
});

describe("reducer / step-count edges", () => {
  it("honors defaultStep for uncontrolled mode", () => {
    const { Probe, getApi } = makeProbe();

    render(
      <MultiStep defaultStep={2}>
        <Probe title="One" />
        <Probe title="Two" />
        <Probe title="Three" />
      </MultiStep>
    );

    expect(getApi().activeStep).toBe(2);
  });

  it("clamps an out-of-range defaultStep to the last step", () => {
    const { Probe, getApi } = makeProbe();

    render(
      <MultiStep defaultStep={9}>
        <Probe title="One" />
        <Probe title="Two" />
        <Probe title="Three" />
      </MultiStep>
    );

    expect(getApi().activeStep).toBe(2);
  });

  it("clamps an out-of-range controlled activeStep to the last step", () => {
    const { Probe, getApi } = makeProbe();

    render(
      <MultiStep activeStep={9}>
        <Probe title="One" />
        <Probe title="Two" />
      </MultiStep>
    );

    expect(getApi().activeStep).toBe(1);
  });

  it("ignores out-of-range goToStep targets", () => {
    const { Probe, getApi } = makeProbe();

    render(
      <MultiStep>
        <Probe title="One" />
        <Probe title="Two" />
      </MultiStep>
    );

    const before = getApi().activeStep;
    getApi().goToStep(-1);
    expect(getApi().activeStep).toBe(before);
    getApi().goToStep(99);
    expect(getApi().activeStep).toBe(before);
  });

  it("clamps the active step when the child count shrinks", () => {
    const { Probe, getApi } = makeProbe();

    const { rerender } = render(
      <MultiStep defaultStep={2}>
        <Probe title="One" />
        <Probe title="Two" />
        <Probe title="Three" />
      </MultiStep>
    );
    expect(getApi().activeStep).toBe(2);

    rerender(
      <MultiStep defaultStep={2}>
        <Probe title="One" />
        <Probe title="Two" />
      </MultiStep>
    );

    expect(getApi().stepCount).toBe(2);
    expect(getApi().activeStep).toBe(1);
  });
});
