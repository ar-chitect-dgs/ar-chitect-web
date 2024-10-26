import { combineReducers, configureStore } from "@reduxjs/toolkit";

import sceneReducer from "./slices/scene";
import { useDispatch } from "react-redux";

const rootReducer = combineReducers({
  sceneReducer,
})
export type RootState = ReturnType<typeof rootReducer>

export default rootReducer

export const _store = configureStore({ reducer: rootReducer })

export type AppDispatch = typeof _store.dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()