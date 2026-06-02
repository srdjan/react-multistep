import { useState, useEffect } from "react";
import type { StepComponentProps } from "react-multistep";
import { WizardChrome } from "./WizardChrome";

export const StepTwo = ({ signalParent }: StepComponentProps<{ title: string }>) => {
  const [email, setEmail] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");

  useEffect(() => {
    signalParent?.({ isValid: email.trim().length > 0 && email === emailConfirm });
  }, [email, emailConfirm, signalParent]);

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
