import { configureStore } from '@reduxjs/toolkit';
import partsReducer from './part/partSlice';
import appReducer from './app/appSlice';
import elementsReducer from './elements/elementsSlice';

export const store = configureStore({
  reducer: {
    part: partsReducer,
    app: appReducer,
    elements: elementsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
