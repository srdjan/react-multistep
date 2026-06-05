// Type-level tests. Named *.test-d.ts so the runtime runner (test/run.mjs, which
// globs /\.test\.tsx?$/) skips it; it is still type-checked because
// tsconfig.test.json includes ["src", "test"]. Every @ts-expect-error below must
// catch a real error, or `tsc -p tsconfig.test.json` fails. The hook calls live
// inside a use*-named function so react-hooks/rules-of-hooks stays satisfied -
// the function is never executed, it exists purely for the type checker.
import type { ButtonHTMLAttributes } from "react";
import {
  useMultiStepState,
  useMultiStepNavigation,
  useMultiStepA11y,
  useReducedMotion,
} from "../src/index.js";
import type {
  StepComponentProps,
  StepValidity,
  StepChangeEvent,
  MultiStepProps,
} from "../src/index.js";

// Local assertion helper: forces T onto its argument at compile time.
const expectType = <T,>(_v: T): void => {};

function useTypeChecks(): void {
  // --- state slice exposes read state, not navigation actions ---
  const state = useMultiStepState();
  expectType<number>(state.activeStep);
  expectType<readonly unknown[]>(state.steps);
  expectType<boolean>(state.isNavigating);
  // @ts-expect-error goToStep is on the navigation slice, not state.
  void state.goToStep;

  // --- navigation slice exposes actions, not read state ---
  const nav = useMultiStepNavigation();
  expectType<(step: number) => void>(nav.goToStep);
  expectType<() => void>(nav.next);
  expectType<() => void>(nav.complete);
  // @ts-expect-error steps is on the state slice, not navigation.
  void nav.steps;

  // goToStep takes a number, not a string.
  nav.goToStep(1);
  // @ts-expect-error goToStep argument must be a number.
  nav.goToStep("1");

  // --- a11y getStepProps returns button-assignable props ---
  const a11y = useMultiStepA11y();
  const stepProps = a11y.getStepProps(0);
  expectType<ButtonHTMLAttributes<HTMLButtonElement>>(stepProps);

  // --- useReducedMotion is a boolean hook ---
  expectType<boolean>(useReducedMotion());
}
void useTypeChecks;

// --- StepComponentProps requires the extra prop ---
type EmailStep = StepComponentProps<{ email: string }>;
const goodStep: EmailStep = { email: "a@b.c" };
expectType<string>(goodStep.email);
// @ts-expect-error email is required by the Extra generic.
const badStep: EmailStep = {};
void badStep;

// --- StepValidity narrows on status ---
const narrow = (v: StepValidity): string | undefined => {
  if (v.status === "invalid") return v.message; // message only exists on invalid
  // @ts-expect-error message does not exist on the valid/pending members.
  return v.message;
};
void narrow;

// --- beforeStepChange event typing ---
const onBefore: NonNullable<MultiStepProps["beforeStepChange"]> = (event: StepChangeEvent) => {
  expectType<number>(event.from);
  expectType<number>(event.to);
  expectType<"next" | "previous" | "jump">(event.direction);
  // @ts-expect-error direction is a finite union, "sideways" is not a member.
  const bad: typeof event.direction = "sideways";
  void bad;
  return false; // boolean is an allowed return
};
void onBefore;
// void and Promise returns are also allowed.
const onBeforeVoid: NonNullable<MultiStepProps["beforeStepChange"]> = () => {};
const onBeforeAsync: NonNullable<MultiStepProps["beforeStepChange"]> = async () => true;
void onBeforeVoid;
void onBeforeAsync;
