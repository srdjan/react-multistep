/**
 * HTTP layer - routing and Request/Response handling.
 * Effects at the edge: this is where HTTP I/O happens.
 */

import type { SessionStore, Clock } from "./ports";
import type { WizardConfig, SessionId, WizardError, Result } from "./types";
import { SessionId as mkSessionId } from "./types";
import { handleStepSubmit, handleNavigation, handleInitialize } from "./middleware";
import type { WizardRenderOptions } from "./renderer";

type Handler = (req: Request) => Promise<Response> | Response;

const HTML_HEADERS = { "Content-Type": "text/html" } as const;
const JSON_HEADERS = { "Content-Type": "application/json" } as const;

const textResponse = (message: string, status: number) =>
  new Response(message, { status });

const htmlResponse = (markup: string, status = 200) =>
  new Response(markup, { status, headers: HTML_HEADERS });

const jsonResponse = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), { status, headers: JSON_HEADERS });

const wizardErrorStatus = (error: WizardError): number => {
  switch (error.type) {
    case "SESSION_NOT_FOUND":
    case "STEP_NOT_FOUND":
      return 404;
    case "VALIDATION_FAILED":
      return 422;
    case "SESSION_STORE_ERROR":
    case "RENDER_FAILED":
      return 500;
    case "CANNOT_PROCEED":
      return 409;
    case "INVALID_STEP_INDEX":
    default:
      return 400;
  }
};

const respondWizard = (result: Result<string, WizardError>) =>
  result.ok ? htmlResponse(result.value) : jsonResponse(result.error, wizardErrorStatus(result.error));

const parseRequestPayload = async (req: Request): Promise<unknown> => {
  const contentType = req.headers.get("content-type")?.toLowerCase() ?? "";

  if (contentType.includes("application/json")) {
    return req.json();
  }

  const form = await req.formData();
  return Object.fromEntries(form.entries());
};

/**
 * Create a request handler for the wizard.
 * This is the main entry point for HTTP integration.
 */
export const createWizardHandler = (
  config: WizardConfig,
  store: SessionStore,
  clock: Clock,
  renderOptions?: WizardRenderOptions,
): Handler => {
  const ports = { store, clock };

  return async (req: Request) => {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter(Boolean);

    if (pathParts[0] !== "wizard") {
      return textResponse("Not found", 404);
    }

    const sessionId = pathParts[1] ? mkSessionId(pathParts[1]) : null;
    if (!sessionId) {
      return textResponse("Missing session ID", 400);
    }

    if (req.method === "GET") {
      const result = await handleInitialize(config, ports, sessionId, renderOptions);
      return respondWizard(result);
    }

    if (req.method !== "POST") {
      return textResponse("Method not allowed", 405);
    }

    const action = pathParts[2];

    if (!action) {
      return textResponse("Missing action", 400);
    }

    switch (action) {
      case "update":
      case "submit": {
        let payload: unknown;
        try {
          payload = await parseRequestPayload(req);
        } catch (error) {
          return jsonResponse({ error: String(error) }, 400);
        }

        const result = await handleStepSubmit(config, ports, sessionId, payload, renderOptions);
        return respondWizard(result);
      }
      case "next": {
        const result = await handleNavigation(config, ports, sessionId, "next", renderOptions);
        return respondWizard(result);
      }
      case "previous": {
        const result = await handleNavigation(config, ports, sessionId, "previous", renderOptions);
        return respondWizard(result);
      }
      case "goto": {
        const targetIndex = Number(pathParts[3]);
        if (Number.isNaN(targetIndex)) {
          return textResponse("Invalid step index", 400);
        }

        const result = await handleNavigation(
          config,
          ports,
          sessionId,
          { goto: targetIndex },
          renderOptions,
        );
        return respondWizard(result);
      }
      default:
        return textResponse("Unknown action", 400);
    }
  };
};
