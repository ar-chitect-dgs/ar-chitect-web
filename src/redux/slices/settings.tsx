/* eslint-disable no-param-reassign */
import {
  createSlice, Dispatch, lruMemoize, PayloadAction,
} from '@reduxjs/toolkit';
import { RootState, ThunkActionVoid } from '..';
import { defaultKeyBinds, EditorAction, KeyBinds } from '../../types/KeyBinds';

export interface SettingsState {
  keyBinds: KeyBinds;
}

export const initialState: SettingsState = {
  keyBinds: defaultKeyBinds,
};

type SetPayload = {
  actionName: EditorAction,
  key: string,
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<SetPayload>) => {
      const { actionName, key } = action.payload;
      state.keyBinds[actionName] = key;
    },
  },
});

export const {
  set,
} = settingsSlice.actions;

export const settingsSelector = lruMemoize(
  (state: RootState) => state.settingsReducer,
);

export default settingsSlice.reducer;

export function setKeyBind(
  actionName: EditorAction, key: string,
): ThunkActionVoid {
  return async (dispatch: Dispatch) => {
    dispatch(set({ actionName, key }));
  };
}
