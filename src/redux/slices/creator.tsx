/* eslint-disable no-param-reassign */
import {
  createSlice, Dispatch, lruMemoize, PayloadAction,
} from '@reduxjs/toolkit';
import { RootState, ThunkActionVoid } from '..';
import { Point2D } from '../../types/Point';
import { round } from '../../utils/utils';

interface CreatorState {
  points: Point2D[];
}

interface AddPointPayload {
  x: number;
  y: number;
}

export const initialState: CreatorState = {
  points: [],
};

const creatorSlice = createSlice({
  name: 'creator',
  initialState,
  reducers: {
    add: (state: CreatorState, action: PayloadAction<AddPointPayload>) => {
      const x = round(action.payload.x, 2);
      const y = round(action.payload.y, 2);
      state.points = [...state.points, { x, y }];
    },
    normalize: (state: CreatorState, _action: PayloadAction<void>) => {
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
        x: total.x / points.length,
        y: total.y / points.length,
      };

      const normalizedPoints = points.map((point) => ({
        x: point.x - centerOfMass.x,
        y: point.y - centerOfMass.y,
      }));

      state.points = normalizedPoints;
    },
  },
});

export const { add, normalize } = creatorSlice.actions;

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

export function normalizePoints(): ThunkActionVoid {
  return async (dispatch: Dispatch) => {
    dispatch(normalize());
  };
}
