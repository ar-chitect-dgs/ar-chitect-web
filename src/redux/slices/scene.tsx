/* eslint-disable no-param-reassign */
import {
  createSlice,
  Dispatch,
  lruMemoize,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState, ThunkActionVoid } from '..';
import { Scene } from '../../types/Scene';
import { round } from '../../utils/utils';

export interface SceneState {
  scene: Scene;
}

export enum Axis {
  X,
  Y,
  Z,
}

interface MovePayload {
  id: number;
  value: number;
  axis: Axis;
}

interface MoveToPayload {
  id: number;
  x: number;
  z: number;
}

interface AddModelPayload {
  objectId: string;
  name: string;
  color: string;
  url: string;
}

interface RemoveModelPayload {
  id: number
}

export const initialState: SceneState = {
  scene: {
    corners: [],
    objectIds: [],
    objects: {},
    activeObjectId: null,
    hoveredObjectId: null,
  },
};

const sceneSlice = createSlice({
  name: 'scene',
  initialState,
  reducers: {
    hover: (state, action: PayloadAction<number | null>) => {
      const id = action.payload;

      if (id != null && !state.scene.objectIds.includes(id)) {
        console.warn(`No object with id ${id} found.`);
      }

      state.scene.hoveredObjectId = id;
    },
    activate: (state, action: PayloadAction<number | null>) => {
      const id = action.payload;

      if (id != null && !state.scene.objectIds.includes(id)) {
        console.warn(`No object with id ${id} found.`);
      }

      state.scene.activeObjectId = state.scene.activeObjectId == null ? id : null;
    },
    move: (state, action: PayloadAction<MovePayload>) => {
      const { id, axis, value } = action.payload;
      const val = round(value, 2);

      const object = state.scene.objects[id];

      if (id != null && !state.scene.objectIds.includes(id)) {
        console.warn(`No object with id ${id} found.`);
      }

      switch (axis) {
        case Axis.X:
          object.position = {
            x: val,
            y: object.position.y,
            z: object.position.z,
          };
          break;
        case Axis.Y:
          object.position = {
            x: object.position.x,
            y: Math.max(val, 0),
            z: object.position.z,
          };
          break;
        case Axis.Z:
          object.position = {
            x: object.position.x,
            y: object.position.y,
            z: val,
          };
          break;
        default:
          console.warn(`Wrong axis ${axis}`);
          break;
      }
    },
    moveTo: (state, action: PayloadAction<MoveToPayload>) => {
      const { id, x, z } = action.payload;

      const object = state.scene.objects[id];

      if (id != null && !state.scene.objectIds.includes(id)) {
        console.warn(`No object with id ${id} found.`);
      }

      object.position = { x: round(x, 2), y: object.position.y, z: round(z, 2) };
    },
    rotate: (state, action: PayloadAction<MovePayload>) => {
      const { id, axis, value: val } = action.payload;

      const value = round(val, 2);

      const object = state.scene.objects[id];

      if (id != null && !state.scene.objectIds.includes(id)) {
        console.warn(`No object with id ${id} found.`);
      }

      switch (axis) {
        case Axis.X:
          object.rotation = {
            x: value,
            y: object.rotation.y,
            z: object.rotation.z,
          };
          break;
        case Axis.Y:
          object.rotation = {
            x: object.rotation.x,
            y: value,
            z: object.rotation.z,
          };
          break;
        case Axis.Z:
          object.rotation = {
            x: object.rotation.x,
            y: object.rotation.y,
            z: value,
          };
          break;
        default:
          console.warn(`Wrong axis ${axis}`);
          break;
      }
    },
    add: (state, action: PayloadAction<AddModelPayload>) => {
      const {
        objectId, name, color, url,
      } = action.payload;

      const newId = state.scene.objectIds.length === 0
        ? 0
        : Math.max(...state.scene.objectIds) + 1;

      const newObject = {
        inProjectId: newId,
        objectId,
        name,
        color,
        url,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        active: true,
        hovered: false,
      };

      const { objects, objectIds } = state.scene;
      objects[newId] = newObject;
      objectIds.push(newId);
      state.scene.activeObjectId = newId;
    },
    remove: (state, action: PayloadAction<RemoveModelPayload>) => {
      const { id } = action.payload;
      const { scene } = state;

      scene.activeObjectId = null;

      delete scene.objects[id];
      const index = scene.objectIds.indexOf(id, 0);
      if (index > -1) {
        scene.objectIds.splice(index, 1);
      }
    },
    setScene: (state, action: PayloadAction<Partial<Scene>>) => {
      state.scene = { ...state.scene, ...action.payload };
    },
    clearScene: (state) => {
      state.scene = initialState.scene;
    },
  },
});

export const {
  hover, activate, move, moveTo, rotate, add, remove, setScene, clearScene,
} = sceneSlice.actions;

export const sceneSelector = lruMemoize(
  (state: RootState) => state.sceneReducer,
);

export default sceneSlice.reducer;

export function hoverObject(
  id: number,
): ThunkActionVoid {
  return async (dispatch: Dispatch) => {
    dispatch(hover(id));
  };
}

export function unhoverObject(): ThunkActionVoid {
  return async (dispatch: Dispatch) => {
    dispatch(hover(null));
  };
}

export function activateObject(
  id: number,
): ThunkActionVoid {
  return async (dispatch: Dispatch) => {
    dispatch(activate(id));
  };
}

export function disactivateObject(): ThunkActionVoid {
  return async (dispatch: Dispatch) => {
    dispatch(activate(null));
  };
}

export function changeActiveState(id: number): ThunkActionVoid {
  return async (dispatch: Dispatch) => {
    dispatch(activate(id));
  };
}

export function moveObject(
  id: number,
  newValue: number,
  axis: Axis,
): ThunkActionVoid {
  return async (dispatch: Dispatch) => {
    dispatch(move({ id, value: newValue, axis }));
  };
}

export function moveObjectTo(
  id: number,
  x: number,
  z: number,
): ThunkActionVoid {
  return async (dispatch: Dispatch) => {
    dispatch(moveTo({ id, x, z }));
  };
}

export function rotateObject(
  id: number,
  newValue: number,
  axis: Axis,
): ThunkActionVoid {
  return async (dispatch: Dispatch) => {
    dispatch(rotate({ id, value: newValue, axis }));
  };
}

export function addModel(
  objectId: string,
  modelName: string,
  color: string,
  url: string,
): ThunkActionVoid {
  return async (dispatch: Dispatch) => {
    dispatch(add({
      objectId, name: modelName, color, url,
    }));
  };
}

export function deleteModel(
  id: number,
): ThunkActionVoid {
  return async (dispatch: Dispatch) => {
    dispatch(remove({ id }));
  };
}
