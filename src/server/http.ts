/**
 * HTTP layer - routing and Request/Response handling.
 * Effects at the edge: this is where HTTP I/O happens.
 */

import type { SessionStore, Clock } from "./ports";
import type { WizardConfig, SessionId } from "./types";
import { SessionId as mkSessionId } from "./types";
import { handleStepSubmit, handleNavigation, handleInitialize } from "./middleware";

type Handler = (req: Request) => Promise<Response> | Response;

/**
 * Create a request handler for the wizard.
 * This is the main entry point for HTTP integration.
 */
export const createWizardHandler = (
  config: WizardConfig,
  store: SessionStore,
  clock: Clock,
): Handler => {
  const ports = { store, clock };

  return async (req: Request) => {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter(Boolean);

    if (pathParts[0] !== "wizard") {
      return new Response("Not found", { status: 404 });
    }

    const sessionId = pathParts[1] ? mkSessionId(pathParts[1]) : null;
    if (!sessionId) {
      return new Response("Missing session ID", { status: 400 });
    }

    if (req.method === "GET") {
      const result = await handleInitialize(config, ports, sessionId);

      if (!result.ok) {
        return new Response(JSON.stringify(result.error), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(result.value, {
        headers: { "Content-Type": "text/html" },
      });
    }

    if (req.method === "POST") {
      const action = pathParts[2];

      if (action === "update" || action === "submit") {
        const contentType = req.headers.get("content-type") || "";
        let formData: unknown;

        if (contentType.includes("application/json")) {
          formData = await req.json();
        } else {
          const form = await req.formData();
          formData = Object.fromEntries(form.entries());
        }

        const result = await handleStepSubmit(config, ports, sessionId, formData);

        if (!result.ok) {
          return new Response(JSON.stringify(result.error), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(result.value, {
          headers: { "Content-Type": "text/html" },
        });
      }

      if (action === "next") {
        const result = await handleNavigation(config, ports, sessionId, "next");

        if (!result.ok) {
          return new Response(JSON.stringify(result.error), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(result.value, {
          headers: { "Content-Type": "text/html" },
        });
      }

      if (action === "previous") {
        const result = await handleNavigation(config, ports, sessionId, "previous");

        if (!result.ok) {
          return new Response(JSON.stringify(result.error), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(result.value, {
          headers: { "Content-Type": "text/html" },
        });
      }

      if (action === "goto") {
        const targetIndex = Number(pathParts[3]);
        if (isNaN(targetIndex)) {
          return new Response("Invalid step index", { status: 400 });
        }

        const result = await handleNavigation(config, ports, sessionId, {
          goto: targetIndex,
        });

        if (!result.ok) {
          return new Response(JSON.stringify(result.error), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(result.value, {
          headers: { "Content-Type": "text/html" },
        });
      }

      return new Response("Unknown action", { status: 400 });
    }

    return new Response("Method not allowed", { status: 405 });
  };
};