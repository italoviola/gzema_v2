import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ElementItem, Elements } from 'types/element';
import { v4 as uuidv4 } from 'uuid';

export const initialState: Elements = [];

const elementsSlice = createSlice({
  name: 'elements',
  initialState,
  reducers: {
    addElement: (state, action: PayloadAction<Omit<ElementItem, 'id'>>) => {
      // calc central point if not provided
      const xaxis =
        action.payload.xaxis ||
        (action.payload.leftZAxis + action.payload.rightZAxis) / 2;

      state.push({
        ...action.payload,
        xaxis,
        id: uuidv4(),
        label: action.payload.label || `Novo Elemento`,
      });
    },
    editElement: (state, action: PayloadAction<ElementItem>) => {
      const index = state.findIndex(
        (element) => element.id === action.payload.id,
      );
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    removeElement: (state, action: PayloadAction<string>) => {
      return state.filter((element) => element.id !== action.payload);
    },
  },
});

export const { addElement, editElement, removeElement } = elementsSlice.actions;

export default elementsSlice.reducer;
