import { createContext, useReducer } from "react";

export const StoreContext = createContext();

export const ACTION_TYPES = {
  SET_LAT_LONG: "SET_LAT_LONG",
  SET_STORES_NEAR: "SET_STORES_NEAR",
};

const storeReducer = (state, action = {}) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LAT_LONG:
      return { ...state, latLong: action.payload.latLong };
    case ACTION_TYPES.SET_STORES_NEAR:
      return { ...state, storesNear: action.payload.storesNear };
  }
};

const StoreProvider = ({ children }) => {
  const initalstate = {
    latLong: "",
    storesNear: [],
  };

  const [state, dispatch] = useReducer(storeReducer, initalstate);

  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
};

export default StoreProvider;
