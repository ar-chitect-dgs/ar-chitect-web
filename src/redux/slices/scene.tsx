/* eslint-disable no-param-reassign */
import {
  createSlice,
  Dispatch,
  lruMemoize,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState, ThunkActionVoid } from '..';
import { Scene } from '../../types/Scene';

export interface SceneState {
  scene: Scene;
}

export enum Axis {
  X,
  Y,
  Z,
}

interface HoverPayload {
  id: number;
  hovered: boolean;
}

interface MovePayload {
  id: number;
  value: number;
  axis: Axis;
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
    objectIds: [0, 1],
    objects: {
      0: {
        inProjectId: 0,
        objectId: 'sofa_1',
        name: 'Sofa 1',
        color: 'default',
        url: 'https://firebasestorage.googleapis.com/v0/b/ar-chitect-a0b25.appspot.com/o/models%2Fsofa_1_default.glb?alt=media&token=7116eb13-5d8c-48e8-a078-ed742179e772',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        active: false,
        hovered: false,
      },
      1: {
        inProjectId: 1,
        objectId: 'sofa_1',
        name: 'Sofa 1',
        color: 'creme',
        url: 'https://firebasestorage.googleapis.com/v0/b/ar-chitect-a0b25.appspot.com/o/models%2Fsofa_1_creme.glb?alt=media&token=500fb3cd-dd57-4bee-aaed-f5ce55009981',
        position: { x: 3, y: 0, z: -2 },
        rotation: { x: 0, y: Math.PI, z: 0 },
        active: false,
        hovered: false,
      },
    },
    selectedObjectId: null,
    projectName: 'My project',
    projectId: '',
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
      const { scene } = state;

      if (!object) {
        console.warn(`No object with id ${id} found.`);
        return;
      }

      scene.selectedObjectId = id;
      object.active = !object.active;
    },
    // todo abstract move and rotate
    move: (state, action: PayloadAction<MovePayload>) => {
      const { id, axis, value } = action.payload;

      const object = state.scene.objects[id];

      if (!object) {
        console.warn(`No object with id ${id} found.`);
        return;
      }

      switch (axis) {
        case Axis.X:
          object.position = {
            x: value,
            y: object.position.y,
            z: object.position.z,
          };
          break;
        case Axis.Y:
          object.position = {
            x: object.position.x,
            y: value,
            z: object.position.z,
          };
          break;
        case Axis.Z:
          object.position = {
            x: object.position.x,
            y: object.position.y,
            z: value,
          };
          break;
        default:
          console.warn(`Wrong axis ${axis}`);
          break;
      }
    },
    rotate: (state, action: PayloadAction<MovePayload>) => {
      const { id, axis, value } = action.payload;

      const object = state.scene.objects[id];

      if (!object) {
        console.warn(`No object with id ${id} found.`);
        return;
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
      state.scene.selectedObjectId = newId;
    },
    remove: (state, action: PayloadAction<RemoveModelPayload>) => {
      const { id } = action.payload;
      const { scene } = state;

      scene.selectedObjectId = null;

      delete scene.objects[id];
      const index = scene.objectIds.indexOf(id, 0);
      if (index > -1) {
        scene.objectIds.splice(index, 1);
      }
    },
    set: (state, action: PayloadAction<Scene>) => {
      state.scene = action.payload;
    },
    clear: (state) => {
      state.scene = initialState.scene;
    },
    changeName: (state, action: PayloadAction<string>) => {
      state.scene.projectName = action.payload;
    },
  },
});

export const {
  hover, click, move, rotate, add, remove, set, clear, changeName,
} = sceneSlice.actions;

export const sceneSelector = lruMemoize(
  (state: RootState) => state.sceneReducer,
);

export default sceneSlice.reducer;

export function changeHoveredState(
  id: number,
  hovered: boolean,
): ThunkActionVoid {
  return async (dispatch: Dispatch) => {
    dispatch(hover({ id, hovered }));
  };
}

export function changeActiveState(id: number): ThunkActionVoid {
  return async (dispatch: Dispatch) => {
    dispatch(click(id));
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
