"use strict";
var import_server = require("../../build/server");
var import_http = require("http");
var import_fs = require("fs");
var import_path = require("path");
const steps = [
  {
    id: (0, import_server.makeStepId)("personal-info"),
    title: "Personal Information",
    validate: (data) => {
      const d = data;
      const errors = {};
      if (!d.name || d.name.length < 2) {
        errors.name = "Name must be at least 2 characters";
      }
      if (!d.email || !d.email.includes("@")) {
        errors.email = "Invalid email address";
      }
      return Object.keys(errors).length > 0 ? (0, import_server.validationErr)(errors) : (0, import_server.validationOk)();
    },
    render: (ctx) => {
      const data = ctx.data;
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
      return (0, import_server.ok)(html);
    }
  },
  {
    id: (0, import_server.makeStepId)("preferences"),
    title: "Preferences",
    validate: (data) => {
      return (0, import_server.validationOk)();
    },
    render: (ctx) => {
      const data = ctx.data;
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
      return (0, import_server.ok)(html);
    }
  },
  {
    id: (0, import_server.makeStepId)("review"),
    title: "Review & Submit",
    validate: () => (0, import_server.validationOk)(),
    render: (ctx) => {
      const personal = ctx.session.stepData[0];
      const prefs = ctx.session.stepData[1];
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
      return (0, import_server.ok)(html);
    }
  }
];
const config = { steps };
const handler = (0, import_server.createWizardHandler)(config, (0, import_server.inMemorySessionStore)(), (0, import_server.systemClock)());
const server = (0, import_http.createServer)(async (nodeReq, nodeRes) => {
  const url = `http://localhost:8000${nodeReq.url}`;
  if (nodeReq.url === "/" || nodeReq.url === "/test.html") {
    const html = (0, import_fs.readFileSync)((0, import_path.join)(__dirname, "test.html"), "utf-8");
    nodeRes.writeHead(200, { "Content-Type": "text/html" });
    nodeRes.end(html);
    return;
  }
  const request = new Request(url, {
    method: nodeReq.method,
    headers: nodeReq.headers,
    body: nodeReq.method !== "GET" && nodeReq.method !== "HEAD" ? await new Promise((resolve) => {
      let body = "";
      nodeReq.on("data", (chunk) => body += chunk);
      nodeReq.on("end", () => resolve(body));
    }) : void 0
  });
  try {
    const response = await handler(request);
    const body = await response.text();
    nodeRes.writeHead(response.status, {
      "Content-Type": response.headers.get("Content-Type") || "text/html"
    });
    nodeRes.end(body);
  } catch (error) {
    console.error("Error:", error);
    nodeRes.writeHead(500);
    nodeRes.end("Internal Server Error");
  }
});
const PORT = 8e3;
server.listen(PORT, () => {
  console.log(`\u2728 Wizard server running at http://localhost:${PORT}`);
  console.log(`\u{1F4DD} Browser test: http://localhost:${PORT}/`);
  console.log(`\u{1F4DD} Direct API: http://localhost:${PORT}/wizard/test-session-123`);
});
