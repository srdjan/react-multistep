import { useState, useEffect } from "react";
import { useReportValidity } from "react-multistep";
import type { StepComponentProps } from "react-multistep";
import { WizardChrome } from "./WizardChrome";

export const StepFour = (_props: StepComponentProps<{ title: string }>) => {
  const report = useReportValidity();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    report(
      checked
        ? { status: "valid" }
        : { status: "invalid", message: "You must accept the terms to continue." }
    );
  }, [checked, report]);

  return (
    <WizardChrome>
      <div className="container">
        <form className="row">
          <div className="ten columns terms">
            <span>By clicking "Accept" I agree that:</span>
            <ul className="docs-terms">
              <li>
                I have read and accepted the <a href="#">User Agreement</a>
              </li>
              <li>
                I have read and accepted the <a href="#">Privacy Policy</a>
              </li>
              <li>I am at least 18 years old</li>
            </ul>
            <span>
              <label>
                Accept {": "}
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => setChecked(e.target.checked)}
                />
              </label>
            </span>
            <button style={{ float: "right" }} disabled={!checked}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </WizardChrome>
  );
};
