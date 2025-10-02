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
  selectedElementId: undefined,
  isElementFormOpen: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    editApp: (state, action: PayloadAction<App>) => {
      Object.assign(state, action.payload);
    },
    // Adicionando os reducers para gerenciar o elemento selecionado
    selectElement: (state, action: PayloadAction<string>) => {
      state.selectedElementId = action.payload;
      state.isElementFormOpen = true;
    },
    deselectElement: (state) => {
      state.selectedElementId = undefined;
      state.isElementFormOpen = false;
    },
    toggleElementForm: (state, action: PayloadAction<boolean | undefined>) => {
      state.isElementFormOpen =
        action.payload !== undefined
          ? action.payload
          : !state.isElementFormOpen;
    },
  },
});

export const { editApp, selectElement, deselectElement, toggleElementForm } =
  appSlice.actions;

export default appSlice.reducer;
