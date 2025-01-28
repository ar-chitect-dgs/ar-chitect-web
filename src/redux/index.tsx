import { combineReducers, configureStore, Dispatch } from '@reduxjs/toolkit';

import { useDispatch } from 'react-redux';
import creatorReducer from './slices/creator';
import projectReducer from './slices/project';
import sceneReducer from './slices/editor';
import settingsReducer from './slices/settings';

const rootReducer = combineReducers({
  sceneReducer,
  creatorReducer,
  projectReducer,
  settingsReducer,
});
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;

export const store = configureStore({ reducer: rootReducer });
export type StoreType = typeof store;

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export type ThunkActionVoid = (dispatch: Dispatch) => Promise<void>;
