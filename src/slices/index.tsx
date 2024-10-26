import { combineReducers } from "@reduxjs/toolkit";

import sceneReducer from "./scene";

const rootReducer = combineReducers({
  sceneReducer,
})
export type RootState = ReturnType<typeof rootReducer>

export default rootReducer