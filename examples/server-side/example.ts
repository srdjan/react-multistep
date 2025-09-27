/**
 * Basic server-side wizard example using HTMX.
 * Demonstrates Light FP patterns with pure functions and Result types.
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

// Define steps with pure validation and render functions
const steps: readonly StepDefinition[] = [
  {
    id: makeStepId("personal-info"),
    title: "Personal Information",
    validate: (data) => {
      const d = data as { name?: string; email?: string };
      const errors: Record<string, string> = {};

      if (!d.name || d.name.length < 2) {
        errors.name = "Name must be at least 2 characters";
      }
      if (!d.email || !d.email.includes("@")) {
        errors.email = "Invalid email address";
      }

      return Object.keys(errors).length > 0 ? validationErr(errors) : validationOk();
    },
    render: (ctx: StepContext) => {
      const data = ctx.data as { name?: string; email?: string } | null;
      const errors = ctx.errors || {};

      const html = `
        <fieldset>
          <legend>Personal Information</legend>

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
            <label for="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value="${data?.email || ""}"
              hx-post="/wizard/${ctx.session.id}/update"
              hx-trigger="change"
              hx-target="#wizard-content"
              hx-swap="outerHTML"
              required
            />
            ${errors.email ? `<span class="error">${errors.email}</span>` : ""}
          </div>
        </fieldset>
      `;

      return ok(html);
    },
  },
  {
    id: makeStepId("preferences"),
    title: "Preferences",
    validate: (data) => {
      // Always valid - checkboxes are optional
      return validationOk();
    },
    render: (ctx: StepContext) => {
      const data = ctx.data as { newsletter?: boolean; notifications?: boolean } | null;

      const html = `
        <fieldset>
          <legend>Your Preferences</legend>

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
                name="notifications"
                ${data?.notifications ? "checked" : ""}
                hx-post="/wizard/${ctx.session.id}/update"
                hx-trigger="change"
                hx-target="#wizard-content"
                hx-swap="outerHTML"
                hx-vals='js:{notifications: event.target.checked}'
              />
              Enable notifications
            </label>
          </div>
        </fieldset>
      `;

      return ok(html);
    },
  },
  {
    id: makeStepId("review"),
    title: "Review & Submit",
    validate: () => validationOk(),
    render: (ctx: StepContext) => {
      const personal = ctx.session.stepData[0] as { name: string; email: string };
      const prefs = ctx.session.stepData[1] as { newsletter: boolean; notifications: boolean };

      const html = `
        <div class="review">
          <h3>Review Your Information</h3>

          <section>
            <h4>Personal Information</h4>
            <dl>
              <dt>Name:</dt>
              <dd>${personal?.name || "N/A"}</dd>
              <dt>Email:</dt>
              <dd>${personal?.email || "N/A"}</dd>
            </dl>
          </section>

          <section>
            <h4>Preferences</h4>
            <dl>
              <dt>Newsletter:</dt>
              <dd>${prefs?.newsletter ? "Yes" : "No"}</dd>
              <dt>Notifications:</dt>
              <dd>${prefs?.notifications ? "Yes" : "No"}</dd>
            </dl>
          </section>

          <p><em>All information looks correct! Ready to submit.</em></p>
        </div>
      `;

      return ok(html);
    },
  },
];

// Create wizard configuration
const config: WizardConfig = { steps };

// Create handler with dependency injection (ports pattern)
const handler = createWizardHandler(config, inMemorySessionStore(), systemClock());

// Start a basic HTTP server using Node's built-in http module
import { createServer } from "http";
import { readFileSync } from "fs";
import { join } from "path";

const server = createServer(async (nodeReq, nodeRes) => {
  const url = `http://localhost:8000${nodeReq.url}`;

  if (nodeReq.url === "/" || nodeReq.url === "/test.html") {
    const html = readFileSync(join(__dirname, "test.html"), "utf-8");
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

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`✨ Wizard server running at http://localhost:${PORT}`);
  console.log(`📝 Browser test: http://localhost:${PORT}/`);
  console.log(`📝 Direct API: http://localhost:${PORT}/wizard/test-session-123`);
});