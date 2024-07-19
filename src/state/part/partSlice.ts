import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Part, ContourItem, ActivitiyItem, OperationItem } from 'types/part';

interface EditContourPayload {
  id: number;
  changes: Partial<Part>;
}

const initialActivity: ActivitiyItem = {
  id: 1,
  xaxis: '',
  zaxis: '',
  fvalue: '',
  actionCode: '',
  aParamId: '',
  aParamValue: null,
  bParamId: '',
  bParamValue: null,
  cParamId: '',
  cParamValue: null,
};

export const initialState: Part = {
  id: 1,
  name: 'Nova Peça',
  contours: [
    {
      id: 1,
      name: 'Contorno',
      type: 'Internal',
      activities: [
        {
          id: 1,
          xaxis: '',
          zaxis: '',
          fvalue: '',
          actionCode: '',
          aParamId: '',
          aParamValue: null,
          bParamId: '',
          bParamValue: null,
          cParamId: '',
          cParamValue: null,
        },
      ],
    },
    {
      id: 2,
      name: 'Contorno',
      type: 'Internal',
      activities: [
        {
          id: 1,
          xaxis: '',
          zaxis: '',
          fvalue: '',
          actionCode: '',
          aParamId: '',
          aParamValue: null,
          bParamId: '',
          bParamValue: null,
          cParamId: '',
          cParamValue: null,
        },
      ],
    },
    {
      id: 3,
      name: 'Contorno',
      type: 'Internal',
      activities: [
        {
          id: 1,
          xaxis: '',
          zaxis: '',
          fvalue: '',
          actionCode: '',
          aParamId: '',
          aParamValue: null,
          bParamId: '',
          bParamValue: null,
          cParamId: '',
          cParamValue: null,
        },
      ],
    },
    {
      id: 4,
      name: 'Contorno',
      type: 'Internal',
      activities: [
        {
          id: 1,
          xaxis: '',
          zaxis: '',
          fvalue: '',
          actionCode: '',
          aParamId: '',
          aParamValue: null,
          bParamId: '',
          bParamValue: null,
          cParamId: '',
          cParamValue: null,
        },
      ],
    },
    {
      id: 5,
      name: 'Contorno',
      type: 'Internal',
      activities: [
        {
          id: 1,
          xaxis: '',
          zaxis: '',
          fvalue: '',
          actionCode: '',
          aParamId: '',
          aParamValue: null,
          bParamId: '',
          bParamValue: null,
          cParamId: '',
          cParamValue: null,
        },
      ],
    },
    {
      id: 6,
      name: 'Contorno',
      type: 'Internal',
      activities: [
        {
          id: 1,
          xaxis: '',
          zaxis: '',
          fvalue: '',
          actionCode: '',
          aParamId: '',
          aParamValue: null,
          bParamId: '',
          bParamValue: null,
          cParamId: '',
          cParamValue: null,
        },
      ],
    },
    {
      id: 7,
      name: 'Contorno',
      type: 'Internal',
      activities: [
        {
          id: 1,
          xaxis: '',
          zaxis: '',
          fvalue: '',
          actionCode: '',
          aParamId: '',
          aParamValue: null,
          bParamId: '',
          bParamValue: null,
          cParamId: '',
          cParamValue: null,
        },
      ],
    },
    {
      id: 8,
      name: 'Contorno',
      type: 'Internal',
      activities: [
        {
          id: 1,
          xaxis: '',
          zaxis: '',
          fvalue: '',
          actionCode: '',
          aParamId: '',
          aParamValue: null,
          bParamId: '',
          bParamValue: null,
          cParamId: '',
          cParamValue: null,
        },
      ],
    },
    {
      id: 9,
      name: 'Contorno',
      type: 'Internal',
      activities: [
        {
          id: 1,
          xaxis: '',
          zaxis: '',
          fvalue: '',
          actionCode: '',
          aParamId: '',
          aParamValue: null,
          bParamId: '',
          bParamValue: null,
          cParamId: '',
          cParamValue: null,
        },
      ],
    },
  ],
  operations: [
    {
      id: 1,
      grindingWheelId: 1,
      name: 'Operação',
      contoursIds: [],
      dAngle: '0',
    },
  ],
};

const partSlice = createSlice({
  name: 'parts',
  initialState,
  reducers: {
    addContour: (
      state,
      action: PayloadAction<Omit<Omit<ContourItem, 'id'>, 'activities'>>,
    ) => {
      const maxId = Math.max(...state.contours.map((contour) => contour.id), 0);
      state.contours.push({
        ...action.payload,
        id: maxId + 1,
        activities: [initialActivity],
      });
    },
    addOperation: (
      state,
      action: PayloadAction<Omit<Omit<OperationItem, 'id'>, 'contoursIds'>>,
    ) => {
      const maxId = Math.max(
        ...state.operations.map((operation) => operation.id),
        0,
      );
      state.operations.push({
        ...action.payload,
        id: maxId + 1,
        contoursIds: [],
      });
    },
    editOperation: (
      state,
      action: PayloadAction<{
        id: number;
        operation: Omit<Omit<OperationItem, 'id'>, 'contoursIds'>;
      }>,
    ) => {
      const { id, operation } = action.payload;
      const operationIndex = state.operations.findIndex((op) => op.id === id);
      if (operationIndex !== -1) {
        state.operations[operationIndex] = {
          ...state.operations[operationIndex],
          ...operation,
        };
      }
    },
    deleteOperation: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      const index = state.operations.findIndex(
        (operation) => operation.id === id,
      );
      if (index !== -1) {
        state.operations.splice(index, 1);
      }
    },
    addContourToOperation: (
      state,
      action: PayloadAction<{ operationId: number; contourId: number }>,
    ) => {
      const operation = state.operations.find(
        (op) => op.id === action.payload.operationId,
      );
      if (
        operation &&
        !operation.contoursIds.includes(action.payload.contourId)
      ) {
        operation.contoursIds.push(action.payload.contourId);
      }
    },
    removeContourFromOperation: (
      state,
      action: PayloadAction<{ operationId: number; contourId: number }>,
    ) => {
      const operation = state.operations.find(
        (op) => op.id === action.payload.operationId,
      );
      if (operation) {
        operation.contoursIds = operation.contoursIds.filter(
          (id) => id !== action.payload.contourId,
        );
      }
    },
    changeContourPositionAtOperation: (
      state,
      action: PayloadAction<{
        operationId: number;
        contourId: number;
        direction: 'up' | 'down';
      }>,
    ) => {
      const { operationId, contourId, direction } = action.payload;
      const operation = state.operations.find((op) => op.id === operationId); // encontrar a operação correta

      if (!operation) return; // se a operação não for encontrada, retorne

      const index = operation.contoursIds.findIndex((id) => id === contourId);
      if (index < 0) return;

      if (direction === 'up' && index > 0) {
        const temp = operation.contoursIds[index];
        operation.contoursIds[index] = operation.contoursIds[index - 1];
        operation.contoursIds[index - 1] = temp;
      } else if (
        direction === 'down' &&
        index < operation.contoursIds.length - 1
      ) {
        const temp = operation.contoursIds[index];
        operation.contoursIds[index] = operation.contoursIds[index + 1];
        operation.contoursIds[index + 1] = temp;
      }
    },
    replacePart: (_, action: PayloadAction<Part>) => {
      return action.payload;
    },
    removeContour: (state, action: PayloadAction<number>) => {
      state.contours = state.contours.filter(
        (contour) => contour.id !== action.payload,
      );
    },
    editContour: (state, action: PayloadAction<EditContourPayload>) => {
      const { id, changes } = action.payload;
      const index = state.contours.findIndex((contour) => contour.id === id);
      if (index !== -1) {
        state.contours[index] = {
          ...state.contours[index],
          ...changes,
        };
      }
    },
  },
});

export const {
  replacePart,
  removeContour,
  editContour,
  addContour,
  addOperation,
  editOperation,
  deleteOperation,
  addContourToOperation,
  removeContourFromOperation,
  changeContourPositionAtOperation,
} = partSlice.actions;

export default partSlice.reducer;
