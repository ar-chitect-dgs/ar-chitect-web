import { combineReducers, Dispatch } from '@reduxjs/toolkit';
import { enableMapSet } from 'immer';

import sceneReducer from './scene';

enableMapSet();

const rootReducer = combineReducers({
  sceneReducer,
});
export type RootState = ReturnType<typeof rootReducer>

export default rootReducer;

export type ThunkActionVoid = (dispatch: Dispatch) => Promise<void>;
