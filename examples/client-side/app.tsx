import { useState } from "react";
import { createRoot } from "react-dom/client";
import MultiStep from "react-multistep";
import type { StepChangeEvent } from "react-multistep";
import "react-multistep/styles";
import { StepOne } from "./stepOne";
import { StepTwo } from "./stepTwo";
import { StepThree } from "./stepThree";
import { StepFour } from "./stepFour";

// Simulated async persistence: resolves after a tick so isNavigating is
// observable in the UI (the chrome disables its buttons while it runs).
const persistStep = (event: StepChangeEvent) =>
  new Promise<void>((resolve) => {
    console.log(`Saving step ${event.from + 1} -> ${event.to + 1} (${event.direction})`);
    setTimeout(resolve, 600);
  });

function App() {
  const [activeStep, setActiveStep] = useState(0);

  // Each step renders its own WizardChrome (the chrome lives inside the step so
  // it can read the MultiStep context). With mode="unmount" only the active step
  // - and therefore a single chrome with a single set of useId-derived
  // tabId/panelId values - is in the DOM at a time, keeping the ARIA ids unique.
  //
  // onComplete fires when the user presses Finish on the last step and that step
  // is valid (canComplete). The Finish button comes from getCompleteButtonProps,
  // which gates itself on canComplete.
  const handleComplete = () => {
    console.log("Wizard completed");
    window.alert("All steps complete. Thanks!");
  };

  // M3 beforeStepChange guard: async-capable and able to veto. Here it simulates
  // saving the current step before the change commits (isNavigating stays true
  // while the promise is in flight). A backward jump across more than one step
  // asks for confirmation first; returning false vetoes the change.
  const handleBeforeStepChange = async (event: StepChangeEvent): Promise<boolean | void> => {
    if (event.direction === "jump" && event.to < event.from - 1) {
      const ok = window.confirm("Jump back and discard later steps?");
      if (!ok) return false;
    }
    await persistStep(event);
  };

  return (
    <div className="container">
      <MultiStep
        activeStep={activeStep}
        onStepChange={setActiveStep}
        beforeStepChange={handleBeforeStepChange}
        onComplete={handleComplete}
        mode="unmount"
      >
        <StepOne title="Step 1" />
        <StepTwo title="Step 2" />
        <StepThree title="Step 3" />
        <StepFour title="Step 4" />
      </MultiStep>
    </div>
  );
}

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(<App />);
}
