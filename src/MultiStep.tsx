import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { ChildState, MultiStepProps } from "./interfaces";
import {
  MultiStepContextValue,
  MultiStepProvider,
} from "./MultiStepContext";

interface MultiStepReducerState {
  internalActiveStep: number;
  stepValidity: boolean[];
  totalSteps: number;
}

type MultiStepReducerAction =
  | { type: "SYNC_STEPS"; totalSteps: number }
  | { type: "SET_ACTIVE"; step: number }
  | { type: "SET_STEP_VALIDITY"; index: number; isValid: boolean };

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const createInitialState = (
  totalSteps: number,
  initialActive: number,
): MultiStepReducerState => ({
  internalActiveStep: initialActive,
  stepValidity: Array(totalSteps).fill(false),
  totalSteps,
});

const multiStepReducer = (
  state: MultiStepReducerState,
  action: MultiStepReducerAction,
): MultiStepReducerState => {
  switch (action.type) {
    case "SYNC_STEPS": {
      const nextTotal = action.totalSteps;
      const nextValidity = Array(nextTotal).fill(false);
      for (let i = 0; i < Math.min(state.stepValidity.length, nextTotal); i += 1) {
        nextValidity[i] = state.stepValidity[i];
      }
      const lastIndex = Math.max(nextTotal - 1, 0);
      const clampedActive = clamp(state.internalActiveStep, 0, lastIndex);
      return {
        internalActiveStep: clampedActive,
        stepValidity: nextValidity,
        totalSteps: nextTotal,
      };
    }
    case "SET_ACTIVE": {
      const lastIndex = Math.max(state.totalSteps - 1, 0);
      return {
        ...state,
        internalActiveStep: clamp(action.step, 0, lastIndex),
      };
    }
    case "SET_STEP_VALIDITY": {
      if (state.stepValidity[action.index] === action.isValid) {
        return state;
      }
      const nextValidity = [...state.stepValidity];
      if (action.index < nextValidity.length) {
        nextValidity[action.index] = action.isValid;
      }
      return {
        ...state,
        stepValidity: nextValidity,
      };
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
    initialStep = 0,
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
  const initialActiveIndex = clamp(controlledActiveStep ?? initialStep, 0, lastStepIndex);

  const [state, dispatch] = useReducer(
    multiStepReducer,
    { totalSteps, initialActive: initialActiveIndex },
    ({ totalSteps: steps, initialActive }) => createInitialState(steps, initialActive),
  );

  useEffect(() => {
    dispatch({ type: "SYNC_STEPS", totalSteps });
  }, [totalSteps]);

  useEffect(() => {
    if (controlledActiveStep === undefined) {
      return;
    }
    dispatch({
      type: "SET_ACTIVE",
      step: clamp(controlledActiveStep, 0, lastStepIndex),
    });
  }, [controlledActiveStep, lastStepIndex]);

  const activeChild = controlledActiveStep !== undefined
    ? clamp(controlledActiveStep, 0, lastStepIndex)
    : state.internalActiveStep;

  const handleStepChange = useCallback(
    (newStep: number) => {
      if (newStep < 0 || newStep >= totalSteps) return;

      if (controlledActiveStep === undefined) {
        dispatch({ type: "SET_ACTIVE", step: newStep });
      }
      onStepChange?.(newStep);
    },
    [totalSteps, controlledActiveStep, onStepChange],
  );

  const setStepValidity = useCallback((index: number, isValid: boolean) => {
    dispatch({ type: "SET_STEP_VALIDITY", index, isValid });
  }, []);

  const handleChildStateChange = useCallback((index: number, childState: ChildState) => {
    setStepValidity(index, childState.isValid);
  }, [setStepValidity]);

  const childrenWithProps = useMemo(
    () =>
      childrenArray.map((child, index) =>
        React.cloneElement(child, {
          signalParent: (childState: ChildState) => handleChildStateChange(index, childState),
        }),
      ),
    [childrenArray, handleChildStateChange],
  );

  const currentStepValid = state.stepValidity[activeChild] ?? false;
  const currentChild = childrenWithProps?.[activeChild] ?? null;

  const contextValue = useMemo<MultiStepContextValue>(() => {
    const ensureCanNavigate = (targetStep: number) => {
      if (targetStep > activeChild && !currentStepValid) {
        onValidationError?.(activeChild);
        return false;
      }
      return true;
    };

    const goToStep = (step: number) => {
      if (!ensureCanNavigate(step)) return;
      handleStepChange(step);
    };

    const next = () => {
      const target = activeChild + 1;
      if (target >= totalSteps) return;
      if (!ensureCanNavigate(target)) return;
      handleStepChange(target);
    };

    const previous = () => {
      const target = activeChild - 1;
      if (target < 0) return;
      handleStepChange(target);
    };

    const steps = childrenArray.map((child, index) => ({
      index,
      isActive: index === activeChild,
      isValid: state.stepValidity[index] ?? false,
      title: child.props?.title,
    }));

    return {
      activeStep: activeChild,
      stepCount: totalSteps,
      steps,
      goToStep,
      next,
      previous,
      setStepValidity,
      isStepValid: (index: number) => state.stepValidity[index] ?? false,
      currentStepValid,
    };
  }, [
    childrenArray,
    activeChild,
    currentStepValid,
    totalSteps,
    handleStepChange,
    onValidationError,
    setStepValidity,
    state.stepValidity,
  ]);

  return (
    <MultiStepProvider value={contextValue}>
      {currentChild}
    </MultiStepProvider>
  );
}
