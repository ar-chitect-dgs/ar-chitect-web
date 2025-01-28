/* eslint-disable no-param-reassign */
import {
  createSlice, Dispatch, lruMemoize, PayloadAction,
} from '@reduxjs/toolkit';
import { RootState, ThunkActionVoid } from '..';
import { defaultKeyBinds, EditorAction, KeyBinds } from '../../types/KeyBinds';

export interface Settings {
  keyBinds: KeyBinds;
  displayBoundingBoxes: boolean;
  useEditorSliders: boolean;
}

export const defaultSettings: Settings = {
  keyBinds: defaultKeyBinds,
  displayBoundingBoxes: false,
  useEditorSliders: false,
};

type SetPayload = {
  actionName: EditorAction,
  key: string,
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState: defaultSettings,
  reducers: {
    setKeyBind: (state: Settings, action: PayloadAction<SetPayload>) => {
      const { actionName, key } = action.payload;
      state.keyBinds[actionName] = key;
    },
    setBoundingBoxes: (state: Settings, _action: PayloadAction<void>) => {
      state.displayBoundingBoxes = !state.displayBoundingBoxes;
    },
    setEditorSliders: (state: Settings, _action: PayloadAction<void>) => {
      state.useEditorSliders = !state.useEditorSliders;
    },
    apply: (state: Settings, action: PayloadAction<KeyBinds>) => {
      state.keyBinds = action.payload;
    },
  },
});

export const {
  setKeyBind: set, apply, setBoundingBoxes, setEditorSliders,
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

export function applyNewKeyBinds(
  keyBinds: KeyBinds,
): ThunkActionVoid {
  return async (dispatch: Dispatch) => {
    dispatch(apply(keyBinds));
  };
}

export function switchBoundingBoxes(): ThunkActionVoid {
  return async (dispatch: Dispatch) => {
    dispatch(setBoundingBoxes());
  };
}

export function switchEditorSliders(): ThunkActionVoid {
  return async (dispatch: Dispatch) => {
    dispatch(setEditorSliders());
  };
}
