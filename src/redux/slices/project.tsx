/* eslint-disable no-param-reassign */
import { createSlice, lruMemoize, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '..';

interface ProjectState {
  createdAt: number;
  projectName: string;
  projectId: string | undefined;
  thumbnail: any | null;
  isNewProject: boolean;
}

const initialState: ProjectState = {
  createdAt: 0,
  projectId: undefined,
  projectName: '',
  thumbnail: null,
  isNewProject: false,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProject(
      state,
      action: PayloadAction<{
        createdAt: number;
        projectName: string;
        projectId: string | undefined;
      }>,
    ) {
      state.createdAt = action.payload.createdAt;
      state.projectName = action.payload.projectName;
      state.projectId = action.payload.projectId;
    },
    setThumbnail(state, action: PayloadAction<any>) {
      state.thumbnail = action.payload;
    },
    setProjectName(state, action: PayloadAction<string>) {
      state.projectName = action.payload;
    },
  },
});

export const { setProject, setThumbnail, setProjectName } = projectSlice.actions;

export const projectSelector = lruMemoize(
  (state: RootState) => state.projectReducer,
);

export default projectSlice.reducer;
