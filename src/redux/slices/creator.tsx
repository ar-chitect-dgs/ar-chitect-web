/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-param-reassign */
import {
  createSlice, Dispatch, lruMemoize, PayloadAction,
} from '@reduxjs/toolkit';
import { RootState, ThunkActionVoid } from '..';
import { Point2D } from '../../types/Point';
import { round } from '../../utils/utils';

export enum Interaction {
  Idle = 1,
  AddingVertex,
  MovingVertex,
  DeletingVertex
}

interface CreatorState {
  points: Point2D[];
  interaction: Interaction;
}

interface AddPointPayload {
  x: number;
  y: number;
}

interface MovePointPayload {
  x: number;
  y: number;
  id: number;
}

interface DeletePointPayload {
  id: number;
}

interface ChangeInteractionPayload {
  interaction: Interaction;
}

export const initialState: CreatorState = {
  points: [],
  interaction: Interaction.AddingVertex,
};

const creatorSlice = createSlice({
  name: 'creator',
  initialState,
  reducers: {
    add: (state: CreatorState, action: PayloadAction<AddPointPayload>) => {
      if (state.interaction !== Interaction.AddingVertex) return;

      const x = round(action.payload.x, 2);
      const y = round(action.payload.y, 2);
      state.points = [...state.points, { x, y }];
    },
    move: (state: CreatorState, action: PayloadAction<MovePointPayload>) => {
      if (state.interaction !== Interaction.MovingVertex) return;

      const { id } = action.payload;

      if (id < 0 && id >= state.points.length) {
        console.warn(`Index outside of bounds: ${id}.`);
      }

      const x = round(action.payload.x, 2);
      const y = round(action.payload.y, 2);
      state.points[action.payload.id] = { x, y };
    },
    remove: (state: CreatorState, action: PayloadAction<DeletePointPayload>) => {
      if (state.interaction !== Interaction.DeletingVertex) return;

      const { id } = action.payload;

      if (id < 0 && id >= state.points.length) {
        console.warn(`Index outside of bounds: ${id}.`);
      }

      state.points.splice(id, 1);
    },
    changeInteraction: (state: CreatorState, action: PayloadAction<ChangeInteractionPayload>) => {
      state.interaction = action.payload.interaction;
    },
    clear: (state: CreatorState) => {
      state.interaction = Interaction.AddingVertex;
      state.points = [];
    },
  },
});

export const {
  add, move, remove, changeInteraction, clear,
} = creatorSlice.actions;

export const creatorSelector = lruMemoize(
  (state: RootState) => state.creatorReducer,
);

export default creatorSlice.reducer;

export function addPointToPlane(
  x: number,
  y: number,
): ThunkActionVoid {
  return async (dispatch: Dispatch) => {
    dispatch(add({ x, y }));
  };
}

export function movePoint(
  id: number,
  x: number,
  y: number,
): ThunkActionVoid {
  return async (dispatch: Dispatch) => {
    dispatch(move({ x, y, id }));
  };
}

export function deletePoint(
  id: number,
)
: ThunkActionVoid {
  return async (dispatch: Dispatch) => {
    dispatch(remove({ id }));
  };
}

export function changeInteractionState(i: Interaction): ThunkActionVoid {
  return async (dispatch: Dispatch) => {
    dispatch(changeInteraction({ interaction: i }));
  };
}

export function clearCreatorState(): ThunkActionVoid {
  return async (dispatch: Dispatch) => {
    dispatch(clear());
  };
}
