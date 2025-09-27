/**
 * Example demonstrating step skipping with conditional navigation.
 * Shows how to use canSkip for optional steps.
 */

import type { WizardConfig, StepDefinition, StepContext } from "../../build/server";
import {
  createWizardHandler,
  inMemorySessionStore,
  systemClock,
  makeStepId,
  validationOk,
  validationErr,
  ok,
} from "../../build/server";

const steps: readonly StepDefinition[] = [
  // Step 1: Required - Basic Info
  {
    id: makeStepId("basic-info"),
    title: "Basic Information",
    validate: (data) => {
      const d = data as { name?: string; accountType?: string };
      const errors: Record<string, string> = {};

      if (!d.name || d.name.length < 2) {
        errors.name = "Name is required";
      }
      if (!d.accountType) {
        errors.accountType = "Account type is required";
      }

      return Object.keys(errors).length > 0 ? validationErr(errors) : validationOk();
    },
    render: (ctx: StepContext) => {
      const data = ctx.data as { name?: string; accountType?: string } | null;
      const errors = ctx.errors || {};

      return ok(`
        <fieldset>
          <legend>Basic Information</legend>

          <div class="form-field">
            <label for="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value="${data?.name || ""}"
              hx-post="/wizard/${ctx.session.id}/update"
              hx-trigger="change"
              hx-target="#wizard-content"
              hx-swap="outerHTML"
              required
            />
            ${errors.name ? `<span class="error">${errors.name}</span>` : ""}
          </div>

          <div class="form-field">
            <label for="accountType">Account Type:</label>
            <select
              id="accountType"
              name="accountType"
              hx-post="/wizard/${ctx.session.id}/update"
              hx-trigger="change"
              hx-target="#wizard-content"
              hx-swap="outerHTML"
            >
              <option value="">Choose...</option>
              <option value="personal" ${data?.accountType === "personal" ? "selected" : ""}>Personal</option>
              <option value="business" ${data?.accountType === "business" ? "selected" : ""}>Business</option>
            </select>
            ${errors.accountType ? `<span class="error">${errors.accountType}</span>` : ""}
          </div>
        </fieldset>
      `);
    },
  },

  // Step 2: Optional - Company Details (only for business accounts)
  {
    id: makeStepId("company-details"),
    title: "Company Details",
    canSkip: (session) => {
      // Skip this step if account type is "personal"
      const basicInfo = session.stepData[0] as { accountType?: string } | null;
      return basicInfo?.accountType === "personal";
    },
    validate: (data) => {
      const d = data as { company?: string; taxId?: string };
      const errors: Record<string, string> = {};

      if (!d.company || d.company.length < 2) {
        errors.company = "Company name is required";
      }
      if (!d.taxId) {
        errors.taxId = "Tax ID is required";
      }

      return Object.keys(errors).length > 0 ? validationErr(errors) : validationOk();
    },
    render: (ctx: StepContext) => {
      const basicInfo = ctx.session.stepData[0] as { accountType?: string } | null;
      const data = ctx.data as { company?: string; taxId?: string } | null;
      const errors = ctx.errors || {};

      // Show different content based on account type
      if (basicInfo?.accountType === "personal") {
        return ok(`
          <div class="skip-notice">
            <h3>Company Details</h3>
            <p>✅ This step is automatically skipped for personal accounts.</p>
            <p>You can navigate directly to the next step.</p>
          </div>
        `);
      }

      return ok(`
        <fieldset>
          <legend>Company Details</legend>

          <div class="form-field">
            <label for="company">Company Name:</label>
            <input
              type="text"
              id="company"
              name="company"
              value="${data?.company || ""}"
              hx-post="/wizard/${ctx.session.id}/update"
              hx-trigger="change"
              hx-target="#wizard-content"
              hx-swap="outerHTML"
              required
            />
            ${errors.company ? `<span class="error">${errors.company}</span>` : ""}
          </div>

          <div class="form-field">
            <label for="taxId">Tax ID:</label>
            <input
              type="text"
              id="taxId"
              name="taxId"
              value="${data?.taxId || ""}"
              hx-post="/wizard/${ctx.session.id}/update"
              hx-trigger="change"
              hx-target="#wizard-content"
              hx-swap="outerHTML"
              required
            />
            ${errors.taxId ? `<span class="error">${errors.taxId}</span>` : ""}
          </div>
        </fieldset>
      `);
    },
  },

  // Step 3: Optional - Marketing Preferences (always skippable)
  {
    id: makeStepId("marketing"),
    title: "Marketing Preferences",
    canSkip: () => true, // Always optional
    validate: () => validationOk(), // Always valid (optional step)
    render: (ctx: StepContext) => {
      const data = ctx.data as { newsletter?: boolean; marketing?: boolean } | null;

      return ok(`
        <fieldset>
          <legend>Marketing Preferences <em>(Optional)</em></legend>

          <p><strong>✓ This step can be skipped</strong> - you can jump directly to the final step.</p>

          <div class="form-field">
            <label>
              <input
                type="checkbox"
                name="newsletter"
                ${data?.newsletter ? "checked" : ""}
                hx-post="/wizard/${ctx.session.id}/update"
                hx-trigger="change"
                hx-target="#wizard-content"
                hx-swap="outerHTML"
                hx-vals='js:{newsletter: event.target.checked}'
              />
              Subscribe to newsletter
            </label>
          </div>

          <div class="form-field">
            <label>
              <input
                type="checkbox"
                name="marketing"
                ${data?.marketing ? "checked" : ""}
                hx-post="/wizard/${ctx.session.id}/update"
                hx-trigger="change"
                hx-target="#wizard-content"
                hx-swap="outerHTML"
                hx-vals='js:{marketing: event.target.checked}'
              />
              Receive marketing emails
            </label>
          </div>
        </fieldset>
      `);
    },
  },

  // Step 4: Required - Final Review
  {
    id: makeStepId("review"),
    title: "Review & Submit",
    validate: () => validationOk(),
    render: (ctx: StepContext) => {
      const basicInfo = ctx.session.stepData[0] as { name: string; accountType: string };
      const companyInfo = ctx.session.stepData[1] as { company?: string; taxId?: string };
      const marketing = ctx.session.stepData[2] as { newsletter?: boolean; marketing?: boolean };

      return ok(`
        <div class="review">
          <h3>Review Your Information</h3>

          <section>
            <h4>Basic Information</h4>
            <dl>
              <dt>Name:</dt>
              <dd>${basicInfo?.name || "N/A"}</dd>
              <dt>Account Type:</dt>
              <dd>${basicInfo?.accountType || "N/A"}</dd>
            </dl>
          </section>

          ${basicInfo?.accountType === "business" && companyInfo ? `
            <section>
              <h4>Company Details</h4>
              <dl>
                <dt>Company:</dt>
                <dd>${companyInfo.company || "N/A"}</dd>
                <dt>Tax ID:</dt>
                <dd>${companyInfo.taxId || "N/A"}</dd>
              </dl>
            </section>
          ` : ""}

          <section>
            <h4>Marketing Preferences</h4>
            <dl>
              <dt>Newsletter:</dt>
              <dd>${marketing?.newsletter ? "Yes" : "No"}</dd>
              <dt>Marketing Emails:</dt>
              <dd>${marketing?.marketing ? "Yes" : "No"}</dd>
            </dl>
          </section>

          <p><em>All information looks correct! Ready to submit.</em></p>
        </div>
      `);
    },
  },
];

// Create wizard configuration
const config: WizardConfig = { steps };

// Create handler with dependency injection
const handler = createWizardHandler(config, inMemorySessionStore(), systemClock());

// Start HTTP server
import { createServer } from "http";
import { readFileSync } from "fs";
import { join } from "path";

const server = createServer(async (nodeReq, nodeRes) => {
  const url = `http://localhost:8001${nodeReq.url}`;

  if (nodeReq.url === "/" || nodeReq.url === "/test.html") {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Skip Logic Demo</title>
  <script src="https://unpkg.com/htmx.org@1.9.10"></script>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 600px; margin: 40px auto; padding: 0 20px; }
    .step-indicators { list-style: none; padding: 0; display: flex; gap: 10px; margin-bottom: 30px; }
    .step-indicator { padding: 10px 15px; background: #f0f0f0; border-radius: 4px; font-size: 14px; }
    .step-indicator.current { background: #1EAEDB; color: white; }
    .step-indicator.complete { background: #5cb85c; color: white; }
    .step-indicator.clickable { cursor: pointer; border: none; }
    .step-indicator.skippable { background: #ffc107; color: black; }
    .form-field { margin-bottom: 20px; }
    .form-field label { display: block; margin-bottom: 5px; font-weight: 500; }
    .form-field input, .form-field select { width: 100%; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; }
    .error { color: #d9534f; font-size: 12px; margin-top: 4px; display: block; }
    .wizard-nav { display: flex; gap: 10px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
    .wizard-button { padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
    .wizard-button-prev { background: #f0f0f0; }
    .wizard-button-next, .wizard-button-submit { background: #1EAEDB; color: white; }
    .wizard-button:disabled { opacity: 0.5; cursor: not-allowed; }
    .skip-notice { background: #e7f3ff; padding: 20px; border-radius: 4px; margin: 20px 0; }
    fieldset { border: 1px solid #ddd; padding: 20px; border-radius: 4px; }
    legend { font-size: 18px; font-weight: 600; padding: 0 10px; }
    .review dl { display: grid; grid-template-columns: auto 1fr; gap: 10px; }
    .review dt { font-weight: 600; }
  </style>
</head>
<body>
  <h1>Step Skipping Demo</h1>
  <p>This wizard demonstrates conditional step skipping:</p>
  <ul>
    <li><strong>Personal accounts:</strong> Skip company details (Step 2)</li>
    <li><strong>Marketing preferences:</strong> Always optional (Step 3)</li>
    <li><strong>Jump behavior:</strong> Can skip directly from Step 1 to Step 4</li>
  </ul>

  <div id="wizard-content" hx-get="/wizard/skip-demo-session" hx-trigger="load" hx-swap="outerHTML">
    Loading...
  </div>
</body>
</html>`;
    nodeRes.writeHead(200, { "Content-Type": "text/html" });
    nodeRes.end(html);
    return;
  }

  // Convert Node request to Web API Request
  const request = new Request(url, {
    method: nodeReq.method,
    headers: nodeReq.headers as HeadersInit,
    body: nodeReq.method !== "GET" && nodeReq.method !== "HEAD"
      ? await new Promise<string>((resolve) => {
          let body = "";
          nodeReq.on("data", (chunk) => (body += chunk));
          nodeReq.on("end", () => resolve(body));
        })
      : undefined,
  });

  try {
    const response = await handler(request);
    const body = await response.text();

    nodeRes.writeHead(response.status, {
      "Content-Type": response.headers.get("Content-Type") || "text/html",
    });
    nodeRes.end(body);
  } catch (error) {
    console.error("Error:", error);
    nodeRes.writeHead(500);
    nodeRes.end("Internal Server Error");
  }
});

const PORT = 8001;
server.listen(PORT, () => {
  console.log(`✨ Skip Logic Demo running at http://localhost:${PORT}`);
  console.log(`📝 Try: http://localhost:${PORT}/`);
  console.log(`
Demo Flow:
1. Choose "Personal" → Step 2 becomes skippable
2. Choose "Business" → Step 2 requires company details
3. Step 3 (Marketing) is always optional
4. Try jumping from Step 1 directly to Step 4!
  `);
});