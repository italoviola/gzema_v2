import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ElementItem, Elements } from 'types/element';
import { v4 as uuidv4 } from 'uuid';

export const initialState: Elements = {
  items: [],
  selectedElementId: null,
  isFormOpen: false,
};

const elementsSlice = createSlice({
  name: 'elements',
  initialState,
  reducers: {
    // Ações existentes modificadas para trabalhar com a nova estrutura
    addElement: (state, action: PayloadAction<Omit<ElementItem, 'id'>>) => {
      // calc central point if not provided
      const xaxis =
        action.payload.xaxis ||
        (action.payload.leftZAxis + action.payload.rightZAxis) / 2;

      state.items.push({
        ...action.payload,
        xaxis,
        id: uuidv4(),
        label: action.payload.label || `Novo Elemento`,
      });
    },
    editElement: (state, action: PayloadAction<ElementItem>) => {
      const index = state.items.findIndex(
        (element) => element.id === action.payload.id,
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removeElement: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (element) => element.id !== action.payload,
      );

      // Se o elemento removido estava selecionado, limpe a seleção
      if (state.selectedElementId === action.payload) {
        state.selectedElementId = null;
        state.isFormOpen = false;
      }
    },

    // Novas ações para gerenciar a seleção
    selectElement: (state, action: PayloadAction<string>) => {
      state.selectedElementId = action.payload;
      state.isFormOpen = true;
    },
    deselectElement: (state) => {
      state.selectedElementId = null;
      state.isFormOpen = false;
    },
    toggleElementForm: (state, action: PayloadAction<boolean | undefined>) => {
      state.isFormOpen =
        action.payload !== undefined ? action.payload : !state.isFormOpen;
    },
  },
});

export const {
  addElement,
  editElement,
  removeElement,
  selectElement,
  deselectElement,
  toggleElementForm,
} = elementsSlice.actions;

export default elementsSlice.reducer;
