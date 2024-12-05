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

interface RoomState {
  points: Point2D[];
  interaction: Interaction;
}

interface AddPointPayload {
  x: number;
  y: number;
}

interface ChangeInteractionPayload {
  interaction: Interaction;
}

export const initialState: RoomState = {
  points: [],
  interaction: Interaction.AddingVertex,
};

const roomSlice = createSlice({
  name: 'creator',
  initialState,
  reducers: {
    add: (state: RoomState, action: PayloadAction<AddPointPayload>) => {
      const x = round(action.payload.x, 2);
      const y = round(action.payload.y, 2);
      state.points = [...state.points, { x, y }];
    },
    normalize: (state: RoomState, _action: PayloadAction<void>) => {
      const { points } = state;

      if (points.length === 0) return;

      const total = points.reduce(
        (acc, point) => {
          acc.x += point.x;
          acc.y += point.y;
          return acc;
        },
        { x: 0, y: 0 },
      );

      const centerOfMass = {
        x: round(total.x / points.length, 2),
        y: round(total.y / points.length, 2),
      };

      const normalizedPoints = points.map((point) => ({
        x: round(point.x - centerOfMass.x, 2),
        y: round(point.y - centerOfMass.y, 2),
      }));

      state.points = normalizedPoints;
    },
    changeInteraction: (state: RoomState, action: PayloadAction<ChangeInteractionPayload>) => {
      state.interaction = action.payload.interaction;
    },
  },
});

export const { add, normalize, changeInteraction } = roomSlice.actions;

export const roomSelector = lruMemoize(
  (state: RootState) => state.creatorReducer,
);

export default roomSlice.reducer;

export function addPointToPlane(
  x: number,
  y: number,
): ThunkActionVoid {
  return async (dispatch: Dispatch) => {
    dispatch(add({ x, y }));
  };
}

export function normalizePoints(): ThunkActionVoid {
  return async (dispatch: Dispatch) => {
    dispatch(normalize());
  };
}

export function changeInteractionState(i: Interaction): ThunkActionVoid {
  return async (dispatch: Dispatch) => {
    dispatch(changeInteraction({ interaction: i }));
  };
}
