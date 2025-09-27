/**
 * Core types for server-side multi-step wizard implementation.
 * All types follow Light FP principles: branded primitives, ADTs, immutability.
 */

// ============================================================================
// RESULT TYPE (Foundational)
// ============================================================================

export type Result<T, E> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const err = <E>(error: E): Result<never, E> => ({ ok: false, error });

// ============================================================================
// BRANDED PRIMITIVES
// ============================================================================

export type SessionId = string & { readonly __brand: "SessionId" };
export type StepId = string & { readonly __brand: "StepId" };

export const SessionId = (raw: string): SessionId => raw as SessionId;
export const StepId = (raw: string): StepId => raw as StepId;

// ============================================================================
// DOMAIN ERRORS (Discriminated Union / ADT)
// ============================================================================

export type WizardError =
  | { readonly type: "SESSION_NOT_FOUND"; readonly sessionId: SessionId }
  | { readonly type: "INVALID_STEP_INDEX"; readonly index: number; readonly max: number }
  | { readonly type: "VALIDATION_FAILED"; readonly errors: Readonly<Record<string, string>> }
  | { readonly type: "STEP_NOT_FOUND"; readonly stepId: StepId }
  | { readonly type: "RENDER_FAILED"; readonly stepId: StepId; readonly reason: string }
  | { readonly type: "SESSION_STORE_ERROR"; readonly reason: string }
  | { readonly type: "CANNOT_PROCEED"; readonly reason: string };

// ============================================================================
// SESSION STATE (Pure Data)
// ============================================================================

export type WizardSession = {
  readonly id: SessionId;
  readonly currentStep: number;
  readonly stepData: ReadonlyArray<unknown>;
  readonly stepValidity: ReadonlyArray<boolean>;
  readonly metadata: Readonly<Record<string, unknown>>;
  readonly createdAt: string;
  readonly updatedAt: string;
};

export const createSession = (
  id: SessionId,
  totalSteps: number,
  now: string,
): WizardSession => ({
  id,
  currentStep: 0,
  stepData: Array(totalSteps).fill(null),
  stepValidity: Array(totalSteps).fill(false),
  metadata: {},
  createdAt: now,
  updatedAt: now,
});

// ============================================================================
// VALIDATION RESULT (ADT)
// ============================================================================

export type ValidationResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly errors: Readonly<Record<string, string>> };

export const validationOk = (): ValidationResult => ({ ok: true });
export const validationErr = (errors: Record<string, string>): ValidationResult => ({
  ok: false,
  errors,
});

// ============================================================================
// STEP CONTEXT & DEFINITION
// ============================================================================

export type StepContext = {
  readonly session: WizardSession;
  readonly stepIndex: number;
  readonly data: unknown;
  readonly errors: Readonly<Record<string, string>> | null;
};

export type StepDefinition = {
  readonly id: StepId;
  readonly title: string;
  readonly validate: (data: unknown) => ValidationResult;
  readonly render: (ctx: StepContext) => Result<string, string>;
  readonly canSkip?: (session: WizardSession) => boolean;
};

// ============================================================================
// WIZARD CONFIGURATION
// ============================================================================

export type WizardConfig = {
  readonly steps: ReadonlyArray<StepDefinition>;
  readonly sessionTTL?: number;
};

// ============================================================================
// WIZARD ACTIONS (HATEOAS State)
// ============================================================================

export type WizardActions = {
  readonly canGoNext: boolean;
  readonly canGoPrevious: boolean;
  readonly canGoToStep: (index: number) => boolean;
  readonly canSubmit: boolean;
};