import {
  createSlice, Dispatch, lruMemoize, PayloadAction,
} from '@reduxjs/toolkit';
import { RootState, ThunkActionVoid } from '..';
import { Scene } from '../../types/Scene';

interface SceneState {
  scene: Scene;
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
    objectIds: [0, 1, 2],
    objects: {
      0: {
        id: 0, name: 'box', position: { x: 0, y: 0, z: 0 }, active: false, hovered: false,
      },
      1: {
        id: 1, name: 'box', position: { x: 0, y: 0, z: -2 }, active: false, hovered: false,
      },
      2: {
        id: 2, name: 'box', position: { x: 0, y: 2, z: 0 }, active: false, hovered: false,
      },
    },
  },
};

const sceneSlice = createSlice({
  name: 'scene',
  initialState,
  reducers: {
    hover: (state, action: PayloadAction<HoverPayload>) => {
      const { id } = action.payload;
      const object = state.scene.objects[id];

      if (!object) {
        console.warn(`No object with id ${id} found.`);
        return;
      }

      object.hovered = action.payload.hovered;
    },
    click: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const object = state.scene.objects[id];

      if (!object) {
        console.warn(`No object with id ${id} found.`);
        return;
      }

      object.active = !object.active;
    },
    move: (state, action: PayloadAction<MovePayload>) => {
      const { id, axis, value } = action.payload;

      const object = state.scene.objects[id];

      if (!object) {
        console.warn(`No object with id ${id} found.`);
        return;
      }

      switch (axis) {
        case Axis.X:
          object.position = { x: value, y: object.position.y, z: object.position.z };
          break;
        case Axis.Y:
          object.position = { x: object.position.x, y: value, z: object.position.z };
          break;
        case Axis.Z:
          object.position = { x: object.position.x, y: object.position.y, z: value };
          break;
        default:
          console.warn(`Wrong axis ${axis}`);
          break;
      }
    },
  },
});

export const { hover, click, move } = sceneSlice.actions;

export const sceneSelector = lruMemoize((state: RootState) => state.sceneReducer);

export default sceneSlice.reducer;

export function changeHoveredState(id: number, hovered: boolean): ThunkActionVoid {
  return async (dispatch: Dispatch) => {
    dispatch(hover({ id, hovered }));
  };
}

export function changeActiveState(id: number): ThunkActionVoid {
  return async (dispatch: Dispatch) => {
    dispatch(click(id));
  };
}

export function moveObject(id: number, newValue: number, axis: Axis): ThunkActionVoid {
  return async (dispatch: Dispatch) => {
    dispatch(move({ id, value: newValue, axis }));
  };
}
