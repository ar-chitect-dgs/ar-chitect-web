/* eslint-disable no-param-reassign */
import { createSlice, lruMemoize, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';
import { Project } from '../../types/Project';

type ProjectState = { project: Project };

const initialState: ProjectState = {
  project: {
    projectId: undefined,
    projectName: '',
    thumbnail: undefined,
    createdAt: 0,
    isNewProject: true,
  },
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProject(state, action: PayloadAction<Project>) {
      state.project = action.payload;
    },
    setThumbnail(state, action: PayloadAction<any>) {
      state.project.thumbnail = action.payload;
    },
    setProjectName(state, action: PayloadAction<string>) {
      state.project.projectName = action.payload;
    },
    setProjectId(state, action: PayloadAction<string>) {
      state.project.projectId = action.payload;
    },
    clearProject(state, _action: PayloadAction<any>) {
      state.project = initialState.project;
    },
  },
});

export const {
  setProject, setThumbnail, setProjectName, clearProject, setProjectId,
} = projectSlice.actions;

export const projectSelector = lruMemoize(
  (state: RootState) => state.projectReducer.project,
);

export default projectSlice.reducer;
