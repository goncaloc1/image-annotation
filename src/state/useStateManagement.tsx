import { AnnotationMode } from "@/app/types";
import React, {
  ActionDispatch,
  createContext,
  ReactNode,
  useContext,
  useReducer,
} from "react";

type StateManagementProps = {
  image: HTMLImageElement | null;
  mode: AnnotationMode;
  base64Image: string | null;
};

const getDefault = (): StateManagementProps => ({
  image: null,
  mode: "polygon",
  base64Image: null,
});

const defaultState = getDefault();

const StateManagementContext =
  createContext<StateManagementProps>(defaultState);

const StateManagementDispatchContext =
  createContext<ActionDispatch<any> | null>(null);

export enum StateManagementActionType {
  SET_POLYGON_MODE = "set_polygon_mode",
  SET_ARROW_MODE = "set_arrow_mode",
}

type StateManagementAction = {
  type: StateManagementActionType;
  payload: any;
};

const stateManagementReducer = (
  state: StateManagementProps,
  action: StateManagementAction
): StateManagementProps => {
  switch (action.type) {
    case StateManagementActionType.SET_POLYGON_MODE:
      return state.mode !== "polygon" ? { ...state, mode: "polygon" } : state;
    case StateManagementActionType.SET_ARROW_MODE:
      return state.mode !== "arrow" ? { ...state, mode: "arrow" } : state;
    default:
      throw Error("Unknown state management action type");
  }
};

type StateManagementProviderProps = {
  children: ReactNode;
};

export const StateManagementProvider = ({
  children,
}: StateManagementProviderProps) => {
  const [state, dispatch] = useReducer(stateManagementReducer, defaultState);

  return (
    <StateManagementContext.Provider value={state}>
      <StateManagementDispatchContext.Provider value={dispatch}>
        {children}
      </StateManagementDispatchContext.Provider>
    </StateManagementContext.Provider>
  );
};

export const useStateManagement = () => {
  const state = useContext(StateManagementContext);

  if (!state) {
    throw Error(
      "'useStateManagement' must be used within 'StateManagementProvider'"
    );
  }

  return state;
};

export const useStateManagementDispatch = () => {
  const dispatch = useContext(StateManagementDispatchContext);

  if (!dispatch) {
    throw Error(
      "'useStateManagementDispatch' must be used within 'StateManagementProvider'"
    );
  }

  return dispatch;
};
