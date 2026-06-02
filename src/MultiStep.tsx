import React, { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { ChildState, MultiStepProps, SignalParent } from "./interfaces.js";
import { MultiStepApi, MultiStepProvider, Step } from "./MultiStepContext.js";

interface MultiStepReducerState {
  internalActiveStep: number;
  stepValidity: boolean[];
  totalSteps: number;
}

type MultiStepReducerAction =
  | { type: "SYNC_STEPS"; totalSteps: number }
  | { type: "SET_ACTIVE"; step: number }
  | { type: "SET_STEP_VALID"; index: number; isValid: boolean };

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const createInitialState = (totalSteps: number, initialActive: number): MultiStepReducerState => ({
  internalActiveStep: initialActive,
  stepValidity: Array(totalSteps).fill(false),
  totalSteps,
});

const multiStepReducer = (
  state: MultiStepReducerState,
  action: MultiStepReducerAction
): MultiStepReducerState => {
  switch (action.type) {
    case "SYNC_STEPS": {
      const nextTotal = action.totalSteps;
      // No-op on mount / unchanged count: the initializer already seeded this.
      if (nextTotal === state.totalSteps) return state;
      const nextValidity: boolean[] = Array(nextTotal).fill(false);
      for (let i = 0; i < Math.min(state.stepValidity.length, nextTotal); i += 1) {
        nextValidity[i] = state.stepValidity[i] ?? false;
      }
      const lastIndex = Math.max(nextTotal - 1, 0);
      return {
        internalActiveStep: clamp(state.internalActiveStep, 0, lastIndex),
        stepValidity: nextValidity,
        totalSteps: nextTotal,
      };
    }
    case "SET_ACTIVE": {
      const lastIndex = Math.max(state.totalSteps - 1, 0);
      return { ...state, internalActiveStep: clamp(action.step, 0, lastIndex) };
    }
    case "SET_STEP_VALID": {
      const { index, isValid } = action;
      if (index >= state.stepValidity.length || state.stepValidity[index] === isValid) {
        return state;
      }
      const nextValidity = [...state.stepValidity];
      nextValidity[index] = isValid;
      return { ...state, stepValidity: nextValidity };
    }
    default:
      return state;
  }
};

export default function MultiStep(props: MultiStepProps) {
  const {
    children,
    activeStep: controlledActiveStep,
    onStepChange,
    defaultStep = 0,
    onValidationError,
  } = props;

  if (!children) {
    throw new TypeError("Error: MultiStep requires at least one child component");
  }

  const childrenArray = useMemo(() => {
    const parsed = React.Children.toArray(children).filter(React.isValidElement);
    if (parsed.length === 0) {
      throw new TypeError("Error: MultiStep requires at least one valid React element as a child");
    }
    return parsed as React.ReactElement[];
  }, [children]);

  const totalSteps = childrenArray.length;
  const lastStepIndex = Math.max(totalSteps - 1, 0);
  const isControlled = controlledActiveStep !== undefined;
  const initialActiveIndex = clamp(controlledActiveStep ?? defaultStep, 0, lastStepIndex);

  const [state, dispatch] = useReducer(
    multiStepReducer,
    { totalSteps, initialActive: initialActiveIndex },
    ({ totalSteps: steps, initialActive }) => createInitialState(steps, initialActive)
  );

  useEffect(() => {
    dispatch({ type: "SYNC_STEPS", totalSteps });
  }, [totalSteps]);

  // Keep internal state in sync while controlled, so position is retained if the
  // consumer later drops the activeStep prop.
  useEffect(() => {
    if (!isControlled) return;
    dispatch({ type: "SET_ACTIVE", step: clamp(controlledActiveStep, 0, lastStepIndex) });
  }, [isControlled, controlledActiveStep, lastStepIndex]);

  const activeChild = isControlled
    ? clamp(controlledActiveStep, 0, lastStepIndex)
    : state.internalActiveStep;

  const setChildValidity = useCallback((index: number, isValid: boolean) => {
    dispatch({ type: "SET_STEP_VALID", index, isValid });
  }, []);

  const childrenWithProps = useMemo(
    () =>
      childrenArray.map((child, index) => {
        const signalParent: SignalParent = (childState: ChildState) =>
          setChildValidity(index, childState.isValid);
        return React.cloneElement(child, { signalParent });
      }),
    [childrenArray, setChildValidity]
  );

  const { stepValidity } = state;
  const currentStepValid = stepValidity[activeChild] ?? false;
  const currentChild = childrenWithProps[activeChild] ?? null;

  // Snapshot the latest nav-relevant values into a ref so the navigation callbacks
  // below stay referentially stable - that lets useMultiStepNavigation consumers
  // skip re-rendering when only step state changes (the point of splitting the
  // state and navigation contexts).
  // Invariant: these callbacks must read every dynamic value from navRef.current,
  // never from a closure variable, or they will read stale state.
  const nav = {
    activeChild,
    currentStepValid,
    stepValidity,
    totalSteps,
    isControlled,
    onStepChange,
    onValidationError,
  };
  const navRef = useRef(nav);
  navRef.current = nav;

  const isStepValid = useCallback(
    (index: number) => navRef.current.stepValidity[index] ?? false,
    []
  );

  const goToStep = useCallback((step: number) => {
    const {
      activeChild,
      currentStepValid,
      totalSteps,
      isControlled,
      onStepChange,
      onValidationError,
    } = navRef.current;
    if (step < 0 || step >= totalSteps) return;
    if (step > activeChild && !currentStepValid) {
      onValidationError?.(activeChild);
      return;
    }
    if (!isControlled) dispatch({ type: "SET_ACTIVE", step });
    onStepChange?.(step);
  }, []);

  const next = useCallback(() => goToStep(navRef.current.activeChild + 1), [goToStep]);
  const previous = useCallback(() => goToStep(navRef.current.activeChild - 1), [goToStep]);

  const steps = useMemo<Step[]>(
    () =>
      childrenArray.map((child, index) => ({
        index,
        isActive: index === activeChild,
        isValid: stepValidity[index] ?? false,
        title: child.props?.title,
      })),
    [childrenArray, activeChild, stepValidity]
  );

  const contextValue = useMemo<MultiStepApi>(
    () => ({
      activeStep: activeChild,
      stepCount: totalSteps,
      steps,
      currentStepValid,
      isStepValid,
      goToStep,
      next,
      previous,
    }),
    [activeChild, totalSteps, steps, currentStepValid, isStepValid, goToStep, next, previous]
  );

  return <MultiStepProvider value={contextValue}>{currentChild}</MultiStepProvider>;
}
