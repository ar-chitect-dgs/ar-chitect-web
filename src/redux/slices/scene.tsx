import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';

interface SceneState {
  active: boolean;
  hovered: boolean;
}

export const initialState: SceneState = {
  active: false,
  hovered: false,
};

const sceneSlice = createSlice({
  name: 'scene',
  initialState,
  reducers: {
    hover: (state, action: PayloadAction<boolean>) => {
      // eslint-disable-next-line no-param-reassign
      state.hovered = action.payload;
    },
    click: (state) => {
      // eslint-disable-next-line no-param-reassign
      state.active = !state.active;
    },
  },
});

export const { hover, click } = sceneSlice.actions;

export const sceneSelector = (state: RootState): SceneState => ({
  hovered: state.sceneReducer.hovered,
  active: state.sceneReducer.active,
});

export default sceneSlice.reducer;

export function changeHoveredState(
  hovered: boolean,
): (dispatch: Dispatch) => Promise<void> {
  return async (dispatch: Dispatch) => {
    dispatch(hover(hovered));
  };
}

export function changeActiveState() {
  return async (dispatch: Dispatch) => {
    dispatch(click());
  };
}
