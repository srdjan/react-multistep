import React, {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import type { MultiStepProps, StepStatus, StepValidity } from "./interfaces.js";
import {
  MultiStepApi,
  MultiStepProvider,
  Step,
  StepIndexProvider,
} from "./MultiStepContext.js";

interface MultiStepReducerState {
  internalActiveStep: number;
  validity: StepValidity[];
  visited: boolean[];
  totalSteps: number;
}

type MultiStepReducerAction =
  | { type: "SYNC_STEPS"; totalSteps: number }
  | { type: "SET_ACTIVE"; step: number }
  | { type: "SET_STEP_VALIDITY"; index: number; validity: StepValidity };

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

// Stable reference so inactive keepMounted wrappers don't churn the style attr.
const HIDDEN_STYLE: React.CSSProperties = { display: "none" };

const pendingValidity = (): StepValidity => ({ status: "pending" });

// Two validity results are equivalent for dispatch purposes when their status
// and (for invalid) message match; the errors map is reported wholesale so a
// status+message compare is enough to skip no-op churn.
const sameValidity = (a: StepValidity, b: StepValidity): boolean => {
  if (a.status !== b.status) return false;
  if (a.status === "invalid" && b.status === "invalid") return a.message === b.message;
  return true;
};

const deriveStatus = (validity: StepValidity, visited: boolean): StepStatus => {
  if (validity.status === "valid") return "valid";
  if (validity.status === "invalid") return "invalid";
  return visited ? "visited" : "pristine";
};

const focusHeadingOrWrapper = (heading: HTMLElement | null, wrapper: HTMLElement): void => {
  if (!heading) {
    wrapper.focus();
    return;
  }
  if (!heading.hasAttribute("tabindex")) heading.tabIndex = -1;
  heading.focus();
  if (heading.ownerDocument.activeElement !== heading) wrapper.focus();
};

// React 19 types element.props as unknown; pull an optional title without `any`.
const readTitle = (element: React.ReactElement): React.ReactNode => {
  const props: unknown = element.props;
  if (props !== null && typeof props === "object" && "title" in props) {
    return (props as { title?: React.ReactNode }).title;
  }
  return undefined;
};

const createInitialState = (totalSteps: number, initialActive: number): MultiStepReducerState => {
  const visited = Array(totalSteps).fill(false);
  if (totalSteps > 0) visited[initialActive] = true;
  return {
    internalActiveStep: initialActive,
    validity: Array.from({ length: totalSteps }, pendingValidity),
    visited,
    totalSteps,
  };
};

const multiStepReducer = (
  state: MultiStepReducerState,
  action: MultiStepReducerAction
): MultiStepReducerState => {
  switch (action.type) {
    case "SYNC_STEPS": {
      const nextTotal = action.totalSteps;
      // No-op on mount / unchanged count: the initializer already seeded this.
      if (nextTotal === state.totalSteps) return state;
      const overlap = Math.min(state.validity.length, nextTotal);
      const nextValidity: StepValidity[] = Array.from({ length: nextTotal }, pendingValidity);
      const nextVisited: boolean[] = Array(nextTotal).fill(false);
      for (let i = 0; i < overlap; i += 1) {
        nextValidity[i] = state.validity[i] ?? pendingValidity();
        nextVisited[i] = state.visited[i] ?? false;
      }
      const lastIndex = Math.max(nextTotal - 1, 0);
      return {
        internalActiveStep: clamp(state.internalActiveStep, 0, lastIndex),
        validity: nextValidity,
        visited: nextVisited,
        totalSteps: nextTotal,
      };
    }
    case "SET_ACTIVE": {
      const lastIndex = Math.max(state.totalSteps - 1, 0);
      const step = clamp(action.step, 0, lastIndex);
      if (step === state.internalActiveStep && state.visited[step]) return state;
      const nextVisited = [...state.visited];
      nextVisited[step] = true;
      return { ...state, internalActiveStep: step, visited: nextVisited };
    }
    case "SET_STEP_VALIDITY": {
      const { index, validity } = action;
      const current = state.validity[index];
      if (index >= state.validity.length || current === undefined) return state;
      if (sameValidity(current, validity)) return state;
      const nextValidity = [...state.validity];
      nextValidity[index] = validity;
      return { ...state, validity: nextValidity };
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
    mode = "keepMounted",
    onValidationError,
    onComplete,
    focusOnStepChange = "panel",
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

  // Stable validity channel: steps call useReportValidity() which routes here.
  const report = useCallback((index: number, validity: StepValidity) => {
    dispatch({ type: "SET_STEP_VALIDITY", index, validity });
  }, []);

  const { validity, visited } = state;
  const currentStepValid = validity[activeChild]?.status === "valid";

  // Stable ids for tab/panel aria wiring, derived from a single useId base.
  const idBase = useId();

  // Snapshot the latest nav-relevant values into a ref so the navigation callbacks
  // below stay referentially stable - that lets useMultiStepNavigation consumers
  // skip re-rendering when only step state changes (the point of splitting the
  // state and navigation contexts).
  // Invariant: these callbacks must read every dynamic value from navRef.current,
  // never from a closure variable, or they will read stale state.
  const nav = {
    activeChild,
    validity,
    totalSteps,
    isControlled,
    onStepChange,
    onValidationError,
    onComplete,
  };
  const navRef = useRef(nav);
  navRef.current = nav;

  const isStepValid = useCallback(
    (index: number) => navRef.current.validity[index]?.status === "valid",
    []
  );

  const goToStep = useCallback((step: number) => {
    const { activeChild, validity, totalSteps, isControlled, onStepChange, onValidationError } =
      navRef.current;
    if (step < 0 || step >= totalSteps) return;
    // Forward gate: every step between the current one and the target (exclusive)
    // must be valid. Backward navigation is always allowed.
    if (step > activeChild) {
      for (let i = activeChild; i < step; i += 1) {
        if (validity[i]?.status !== "valid") {
          onValidationError?.(i);
          return;
        }
      }
    }
    if (!isControlled) dispatch({ type: "SET_ACTIVE", step });
    onStepChange?.(step);
  }, []);

  const next = useCallback(() => goToStep(navRef.current.activeChild + 1), [goToStep]);
  const previous = useCallback(() => goToStep(navRef.current.activeChild - 1), [goToStep]);

  // Referentially stable like next/previous: reads everything from navRef.
  const complete = useCallback(() => {
    const { activeChild, validity, totalSteps, onComplete, onValidationError } = navRef.current;
    const onLast = activeChild === totalSteps - 1;
    const valid = validity[activeChild]?.status === "valid";
    if (onLast && valid) {
      onComplete?.();
    } else {
      onValidationError?.(activeChild);
    }
  }, []);

  const steps = useMemo<Step[]>(
    () =>
      childrenArray.map((child, index) => {
        const stepValidity = validity[index] ?? pendingValidity();
        const status = deriveStatus(stepValidity, visited[index] ?? false);
        return {
          index,
          isActive: index === activeChild,
          status,
          isValid: status === "valid",
          title: readTitle(child),
          tabId: `${idBase}-tab-${index}`,
          panelId: `${idBase}-panel-${index}`,
        };
      }),
    [childrenArray, activeChild, validity, visited, idBase]
  );

  // Derived, read-only values surfaced on the state slice.
  const isFirst = activeChild === 0;
  const isLast = activeChild === totalSteps - 1;
  const progress = totalSteps <= 1 ? 1 : activeChild / (totalSteps - 1);
  const canComplete = isLast && currentStepValid;
  const visitedSteps = useMemo(
    () => steps.filter((step) => step.status !== "pristine").map((step) => step.index),
    [steps]
  );
  const completedSteps = useMemo(
    () => steps.filter((step) => step.status === "valid").map((step) => step.index),
    [steps]
  );
  const activeValidity = validity[activeChild];
  const currentStepError =
    activeValidity?.status === "invalid" ? activeValidity.message : undefined;

  const contextValue = useMemo<MultiStepApi>(
    () => ({
      activeStep: activeChild,
      stepCount: totalSteps,
      steps,
      currentStepValid,
      isStepValid,
      isFirst,
      isLast,
      progress,
      canComplete,
      visitedSteps,
      completedSteps,
      currentStepError,
      goToStep,
      next,
      previous,
      complete,
    }),
    [
      activeChild,
      totalSteps,
      steps,
      currentStepValid,
      isStepValid,
      isFirst,
      isLast,
      progress,
      canComplete,
      visitedSteps,
      completedSteps,
      currentStepError,
      goToStep,
      next,
      previous,
      complete,
    ]
  );

  // Focus management is self-contained: MultiStep owns the ref to the active step
  // wrapper rather than routing through getPanelProps, so keepMounted's multiple
  // mounted panels don't collide on a single consumer ref.
  const activeWrapperRef = useRef<HTMLDivElement | null>(null);
  const prevActiveRef = useRef(activeChild);

  useLayoutEffect(() => {
    const previousActive = prevActiveRef.current;
    prevActiveRef.current = activeChild;
    // Skip the initial mount so focus is not stolen on first render.
    if (previousActive === activeChild) return;
    if (focusOnStepChange === false) return;
    const wrapper = activeWrapperRef.current;
    if (!wrapper) return;
    if (focusOnStepChange === "heading") {
      const heading = wrapper.querySelector<HTMLElement>("h1, h2, h3, h4, h5, h6");
      focusHeadingOrWrapper(heading, wrapper);
    } else {
      wrapper.focus();
    }
  }, [activeChild, focusOnStepChange]);

  const manageFocus = focusOnStepChange !== false;

  // keepMounted (default): render every step, hiding inactive ones so their
  // subtree stays mounted (preserving in-step state and running each step's
  // validity effect) while being removed from the visual + a11y tree. The active
  // wrapper takes tabIndex={-1} and the focus ref; inactive wrappers stay as-is.
  // unmount: render only the active step.
  const rendered =
    mode === "keepMounted"
      ? childrenArray.map((child, index) => {
          const inactive = index !== activeChild;
          return (
            <div
              key={index}
              hidden={inactive}
              style={inactive ? HIDDEN_STYLE : undefined}
              ref={inactive ? undefined : activeWrapperRef}
              tabIndex={inactive ? undefined : -1}
            >
              <StepIndexProvider index={index}>{child}</StepIndexProvider>
            </div>
          );
        })
      : childrenArray[activeChild]
        ? manageFocus
          ? (
              <div ref={activeWrapperRef} tabIndex={-1}>
                <StepIndexProvider index={activeChild}>
                  {childrenArray[activeChild]}
                </StepIndexProvider>
              </div>
            )
          : <StepIndexProvider index={activeChild}>{childrenArray[activeChild]}</StepIndexProvider>
        : null;

  return (
    <MultiStepProvider value={contextValue} report={report}>
      {rendered}
    </MultiStepProvider>
  );
}
