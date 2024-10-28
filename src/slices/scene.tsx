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

export enum Axis {
  X,
  Y,
  Z,
}

interface HoverPayload {
  id: number,
  hovered: boolean,
}

interface MovePayload {
  id: number,
  value: number,
  axis: Axis,
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
    hover: (state, action: PayloadAction<HoverPayload>) => {
      console.log(action.payload.id)
      state.scene.objects[action.payload.id].hovered = action.payload.hovered;
    },
    click: (state, action: PayloadAction<number>) => {
      state.scene.objects[action.payload].active = !state.scene.objects[action.payload].active;
    },
    move: (state, action: PayloadAction<MovePayload>) => {
      const id = action.payload.id
      const val = action.payload.value
      const axis = action.payload.axis

      const object = state.scene.objects.find(obj => obj.id === id);
      if (object) {
        switch (axis) {
          case Axis.X:
            object.position = { x: val, y: object.position.y, z: object.position.z };
            break;
          case Axis.Y:
            object.position = { x: object.position.x, y: val, z: object.position.z };
            break;
          case Axis.Z:
            object.position = { x: object.position.x, y: object.position.z, z: val };
            break;
        }

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

export function changeHoveredState(id: number, hovered: boolean) {
  return async (dispatch: Dispatch) => {
    dispatch(hover({ id, hovered }))
  }
}

export function changeActiveState(id: number) {
  return async (dispatch: Dispatch) => {
    dispatch(click(id))
  }
}

export function moveObject(id: number, newValue: number, axis: Axis) {
  return async (dispatch: Dispatch) => {
    dispatch(move({ id: id, value: newValue, axis }))
  }
}