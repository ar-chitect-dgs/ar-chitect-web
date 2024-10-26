import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { Scene } from "../types/Scene";

interface SceneState {
  scene: Scene;
  // temp
  hovered: boolean;
  active: boolean;
}

export const initialState: SceneState = {
  scene: {
    objects: [
      { id: 1, name: "box", position: [0, 0, 0], active: false, hovered: false },
      { id: 2, name: "box", position: [0, 1, 0], active: false, hovered: false },
      { id: 3, name: "box", position: [0, 1, -1], active: false, hovered: false }
    ]
  },
  hovered: false,
  active: false,
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
  active: state.sceneReducer.active,
  scene: state.sceneReducer.scene
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