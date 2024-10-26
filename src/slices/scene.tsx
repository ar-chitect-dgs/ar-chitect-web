import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { Scene } from "../types/Scene";

// todo address warnings

interface SceneState {
  scene: Scene;
  // temp
  hovered: boolean;
  active: boolean;
}

interface ClickPayload {
  id: number,
  value: number,
}

export const initialState: SceneState = {
  scene: {
    // todo make it a map
    objects: [
      { id: 0, name: "box", position: { x: 0, y: 0, z: 0 }, active: false, hovered: false },
      { id: 1, name: "box", position: { x: 0, y: 2, z: 0 }, active: false, hovered: false },
      { id: 2, name: "box", position: { x: 0, y: 0, z: 2 }, active: false, hovered: false }
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
    move: (state, action: PayloadAction<ClickPayload>) => {
      const id = action.payload.id
      const val = action.payload.value
      const object = state.scene.objects.find(obj => obj.id === id);
      if (object) {
        object.position = { x: object.position.x, y: val, z: object.position.z };
      }
    }
  }
})

export const { hover, click, move } = sceneSlice.actions;

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

export function moveObject(id: number, newValue: number) {
  return async (dispatch: Dispatch) => {
    dispatch(move({ id: id, value: newValue }))
  }
}