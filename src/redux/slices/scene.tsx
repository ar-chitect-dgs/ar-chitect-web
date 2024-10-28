import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { RootState, ThunkActionVoid } from '..';
import { Scene } from '../../types/Scene';

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
    objectIds: [0, 1, 2],
    objects: new Map([
      [0, {
        id: 0, name: 'box', position: { x: 0, y: 0, z: 0 }, active: false, hovered: false,
      }],
      [1, {
        id: 1, name: 'box', position: { x: 0, y: 2, z: 0 }, active: false, hovered: false,
      }],
      [2, {
        id: 2, name: 'box', position: { x: 0, y: 0, z: 2 }, active: false, hovered: false,
      }],
    ]),
  },
  hovered: false,
  active: false,
};

const sceneSlice = createSlice({
  name: 'scene',
  initialState,
  reducers: {
    hover: (state, action: PayloadAction<HoverPayload>) => {
      const { id } = action.payload;
      const object = state.scene.objects.get(id);

      if (!object) {
        console.warn(`No object with id ${id} found.`);
        return;
      }

      object.hovered = action.payload.hovered;
    },
    click: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const object = state.scene.objects.get(id);

      if (!object) {
        console.warn(`No object with id ${id} found.`);
        return;
      }

      object.active = !object.active;
    },
    move: (state, action: PayloadAction<MovePayload>) => {
      const { id } = action.payload;
      const val = action.payload.value;
      const { axis } = action.payload;

      const object = state.scene.objects.get(id);

      if (!object) {
        console.warn(`No object with id ${id} found.`);
        return;
      }

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
        default:
          console.warn(`Wrong axis ${axis}`);
          break;
      }
    },
  },
});

export const { hover, click, move } = sceneSlice.actions;

export const sceneSelector = (state: RootState): SceneState => ({
  hovered: state.sceneReducer.hovered,
  active: state.sceneReducer.active,
  scene: state.sceneReducer.scene,
});

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
