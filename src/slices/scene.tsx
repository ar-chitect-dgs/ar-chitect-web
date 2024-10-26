import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";

interface SceneState {
  active: boolean,
  hovered: boolean,
}

export const initialState: SceneState = {
  active: false,
  hovered: false,
}

const sceneSlice = createSlice({
  name: 'scene',
  initialState,
  reducers: {
    hover: (state, action: PayloadAction<boolean>) => {
      state.hovered = action.payload;
    },
    click: (state) => {
      state.active = !state.active;
    },
  }
})

export const { hover, click } = sceneSlice.actions;

export const sceneSelector = (state: RootState) => ({
  hovered: state.sceneReducer.hovered,
  active: state.sceneReducer.active
});

export default sceneSlice.reducer;

export function changeHoveredState(hovered: boolean) {
  return async (dispatch: Dispatch) => {
    dispatch(hover(hovered))
  }
}

export function changeActiveState() {
  return async (dispatch: Dispatch) => {
    dispatch(click())
  }
}