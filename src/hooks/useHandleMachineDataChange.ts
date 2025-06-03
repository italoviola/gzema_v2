import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  removeContourFromOperation,
  deleteOperation,
  removeContour,
} from 'state/part/partSlice';
import { editApp } from 'state/app/appSlice';

import { ToolDressingOptionItem, ToolOptionItem } from 'types/formattedTools';
import { Part, ContourItem, OperationItem } from 'types/part';
import { App } from 'types/app';

import useFormattedTools from './useFormattedTools';
import useFormattedDressingTools from './useFormattedDressingTools';

const useHandleMachineDataChange = () => {
  const dispatch = useDispatch();
  const formattedTools = useFormattedTools();
  const formattedDressingTools = useFormattedDressingTools();

  const appState = useSelector((state: { app: App }) => state.app);
  const part = useSelector((state: { part: Part }) => state.part);

  useEffect(() => {
    // Cannot execute useEffect if formattedTools or formattedDressingTools are not ready
    if (
      !appState.hasFixFromMachineDataChange &&
      (appState.hasFormattedToolsUpdate || appState.hasGrindingWheelUpdate)
    )
      return;

    part.operations.forEach((operation: OperationItem) => {
      const tool = formattedTools.find(
        (t: ToolOptionItem) => t.id === operation.toolId,
      );
      if (!tool || tool.type === 0) {
        dispatch(deleteOperation(operation.id));
        return;
      }

      const operationToolType = tool.type;
      operation.contoursIds.forEach((contourId: number) => {
        const contour = part.contours.find(
          (contourItem: ContourItem) => contourItem.id === contourId,
        );
        if (contour && contour.type !== operationToolType) {
          dispatch(
            removeContourFromOperation({
              operationId: operation.id,
              contourId: contour.id,
            }),
          );
        }

        if (contour && contour.dressingTool) {
          const match = contour.dressingTool.match(/^([a-zA-Z]+)(\d+)$/);
          const baseName = match ? match[1] : '';
          const usedQuantity = match ? parseInt(match[2], 10) : 0;

          const dressingToolItem = formattedDressingTools.find((dt) => {
            const dtBaseName = dt.name
              .replace(/^tool\d/, '')
              .replace('Qtd', '');
            return dtBaseName === baseName;
          });

          if (!dressingToolItem || usedQuantity > dressingToolItem.quantity) {
            dispatch(
              removeContourFromOperation({
                operationId: operation.id,
                contourId: contour.id,
              }),
            );
          }
        }
      });
    });

    formattedDressingTools.forEach((dressingTool: ToolDressingOptionItem) => {
      const typeName = dressingTool.name
        .replace(/^tool\d/, '')
        .replace('Qtd', '');

      part.contours.forEach((contour) => {
        if (contour.dressingTool && contour.dressingTool.startsWith(typeName)) {
          // Extrai o sufixo numérico do nome da ferramenta de dressagem
          const match = contour.dressingTool.match(/\d+$/);
          const suffix = match ? parseInt(match[0], 10) : 0;

          if (suffix > dressingTool.quantity) {
            dispatch(removeContour(contour.id));
          }
        }
      });
    });

    dispatch(editApp({ hasFixFromMachineDataChange: undefined }));
  }, [
    appState.hasFixFromMachineDataChange,
    appState.hasGrindingWheelUpdate,
    appState.hasFormattedToolsUpdate,
    formattedTools,
    formattedDressingTools,
    part,
    dispatch,
  ]);
};

export default useHandleMachineDataChange;
