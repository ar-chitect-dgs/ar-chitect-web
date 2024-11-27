import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project } from '../../types/Project';

interface ProjectState {
  project: Project;
}

interface AddPointPayload {
  x: number;
  y: number;
}

export const initialState: ProjectState = {
  project: {
    projectName: '',
    objects: [],
    corners: [],
    isFirstTime: false,
    latitude: 0,
    longitude: 0,
    orientation: 0,
    createdAt: 0,
    modifiedAt: 0,
    thumb: '',
  },
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    addPoint: (state, action: PayloadAction<AddPointPayload>) => {

    },
  },
});

export const {
  addPoint,
} = projectSlice.actions;
