import { describe, it, expect, render } from "./harness";
import { useEffect } from "react";
import MultiStep from "../src/MultiStep";
import {
  useMultiStep,
  useMultiStepState,
  useMultiStepNavigation,
  useReportValidity,
  type MultiStepApi,
} from "../src/MultiStepContext";
import type { StepComponentProps } from "../src/interfaces";
import * as publicApi from "../src/index";

type StepProps = StepComponentProps<{ title: string }>;

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
      "default,useMultiStep,useMultiStepNavigation,useMultiStepState,useReportValidity"
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
