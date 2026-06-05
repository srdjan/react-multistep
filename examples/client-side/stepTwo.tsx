import { useState, useEffect } from "react";
import { useReportValidity } from "react-multistep";
import type { StepComponentProps } from "react-multistep";
import { WizardChrome } from "./WizardChrome";

export const StepTwo = (_props: StepComponentProps<{ title: string }>) => {
  const report = useReportValidity();
  const [email, setEmail] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");

  useEffect(() => {
    const hasEmail = email.trim().length > 0;
    if (!hasEmail) {
      report({ status: "invalid", message: "Enter your email address." });
      return;
    }
    if (email !== emailConfirm) {
      report({ status: "invalid", message: "Email addresses must match." });
      return;
    }
    report({ status: "valid" });
  }, [email, emailConfirm, report]);

  return (
    <WizardChrome>
      <div className="container">
        <div className="row">
          <div className="six columns">
            <label>Your email</label>
            <input
              className="u-full-width required"
              placeholder="test@mailbox.com"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
        </div>
        <div className="row">
          <div className="six columns">
            <label>Confirm email</label>
            <input
              className="u-full-width"
              placeholder="Confirm email"
              type="email"
              onChange={(e) => setEmailConfirm(e.target.value)}
              value={emailConfirm}
            />
          </div>
        </div>
        <p style={{ fontStyle: "italic", fontSize: "0.9rem" }}>
          Email addresses must match to proceed.
        </p>
      </div>
    </WizardChrome>
  );
};
