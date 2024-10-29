import { combineReducers, configureStore, Dispatch } from '@reduxjs/toolkit';

import { useDispatch } from 'react-redux';
import sceneReducer from './slices/scene';

const rootReducer = combineReducers({
  sceneReducer,
});
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;

export const store = configureStore({ reducer: rootReducer });

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export type ThunkActionVoid = (dispatch: Dispatch) => Promise<void>;
