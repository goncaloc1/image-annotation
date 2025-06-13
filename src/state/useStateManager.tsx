import { AnnotationMode } from "@/app/types";
import React, {
  Dispatch,
  createContext,
  ReactNode,
  useContext,
  useReducer,
} from "react";

type StateManagerProps = {
  image: HTMLImageElement | null;
  mode: AnnotationMode;
  base64Image: string | null;
  exportTrigger: number;
};

const getDefault = (): StateManagerProps => ({
  image: null,
  mode: "polygon",
  base64Image: null,
  exportTrigger: 0,
});

const defaultState = getDefault();

const StateManagerContext = createContext<StateManagerProps>(defaultState);

const StateManagerDispatchContext =
  createContext<Dispatch<StateManagerAction> | null>(null);

export enum StateManagerActionType {
  SET_POLYGON_MODE = "set_polygon_mode",
  SET_ARROW_MODE = "set_arrow_mode",
  EXPORT = "export",
}

type StateManagerAction = {
  type: StateManagerActionType;
};

const StateManagerReducer = (
  state: StateManagerProps,
  action: StateManagerAction
): StateManagerProps => {
  switch (action.type) {
    case StateManagerActionType.SET_POLYGON_MODE:
      return state.mode !== "polygon" ? { ...state, mode: "polygon" } : state;
    case StateManagerActionType.SET_ARROW_MODE:
      return state.mode !== "arrow" ? { ...state, mode: "arrow" } : state;
    case StateManagerActionType.EXPORT:
      return { ...state, exportTrigger: state.exportTrigger + 1 };
    default:
      throw Error("Unknown state management action type");
  }
};

type StateManagerProviderProps = {
  children: ReactNode;
};

export const StateManagerProvider = ({
  children,
}: StateManagerProviderProps) => {
  const [state, dispatch] = useReducer(StateManagerReducer, defaultState);

  return (
    <StateManagerContext.Provider value={state}>
      <StateManagerDispatchContext.Provider value={dispatch}>
        {children}
      </StateManagerDispatchContext.Provider>
    </StateManagerContext.Provider>
  );
};

export const useStateManager = () => {
  const state = useContext(StateManagerContext);

  if (!state) {
    throw Error("'useStateManager' must be used within 'StateManagerProvider'");
  }

  return state;
};

export const useStateManagerDispatch = () => {
  const dispatch = useContext(StateManagerDispatchContext);

  if (!dispatch) {
    throw Error(
      "'useStateManagerDispatch' must be used within 'StateManagerProvider'"
    );
  }

  return dispatch;
};
