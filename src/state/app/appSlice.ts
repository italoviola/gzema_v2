import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { App } from 'types/app';

export const initialState: App = {
  fileName: 'Untitled',
  isSaved: true,
  lastSavedFileState: '',
  lastFilePathSaved: '',
  lastGeneratedCodes: [],
  hasImportedMachineDataChange: undefined,
  hasFixFromMachineDataChange: undefined,
  hasGrindingWheelUpdate: undefined,
  hasSaveStatusUpdate: undefined,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    editApp: (state, action: PayloadAction<App>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { editApp } = appSlice.actions;

export default appSlice.reducer;
