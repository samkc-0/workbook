import { createContext, useContext, useReducer } from "react";

const STORAGE_KEY = "userProgress";

type ProgressState = Record<string, any>;

const initialState: ProgressState = JSON.parse(
  localStorage.getItem(STORAGE_KEY) || "{}"
);

const progressReducer = (
  state: ProgressState,
  action: { type: string; payload?: any }
) => {
  switch (action.type) {
    case "SET_PROGRESS":
      const newState = { ...state, ...action.payload };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    default:
      return state;
  }
};

const ProgressContext = createContext<
  { state: ProgressState; dispatch: React.Dispatch<any> } | undefined
>(undefined);

export const ProgressProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(progressReducer, initialState);

  return (
    <ProgressContext.Provider value={{ state, dispatch }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
};
