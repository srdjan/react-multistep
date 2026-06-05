import { useState, useEffect } from "react";
import { useReportValidity } from "react-multistep";
import type { StepComponentProps } from "react-multistep";
import { WizardChrome } from "./WizardChrome";

export const StepOne = (_props: StepComponentProps<{ title: string }>) => {
  const report = useReportValidity();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    report(
      firstName.trim().length > 0
        ? { status: "valid" }
        : { status: "invalid", message: "First name is required." }
    );
  }, [firstName, report]);

  return (
    <WizardChrome>
      <div className="container u-full-width">
        <div className="row">
          <div className="six columns">
            <label>
              First Name
              {firstName.length === 0 && (
                <span style={{ fontSize: "1rem", color: "red" }}>&nbsp;[ Required ]</span>
              )}
            </label>
            <input
              className="u-full-width"
              placeholder="First Name"
              type="text"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="six columns">
            <label>Last Name</label>
            <input
              className="u-full-width"
              placeholder="Last Name"
              type="text"
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
            />
          </div>
        </div>
      </div>
    </WizardChrome>
  );
};
