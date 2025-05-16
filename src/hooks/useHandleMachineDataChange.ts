import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { editApp } from 'state/app/appSlice';
import {
  removeContourFromOperation,
  deleteOperation,
  removeContour,
} from 'state/part/partSlice';

import { ToolDressingOptionItem, ToolOptionItem } from 'types/formattedTools';
import { Part, ContourItem, OperationItem } from 'types/part';

import useFormattedTools from './useFormattedTools';
import useFormattedDressingTools from './useFormattedDressingTools';
import useRelatedTools from './useRelatedTools';

const useHandleMachineDataChange = () => {
  const dispatch = useDispatch();
  const formattedTools = useFormattedTools();
  const formattedDressingTools = useFormattedDressingTools();
  const dressingToolsNames = useRelatedTools();

  const hasMachineDataFix = useSelector(
    (state: { app: { hasMachineDataFix: boolean } }) =>
      state.app.hasMachineDataFix,
  );
  const part = useSelector((state: { part: Part }) => state.part);

  useEffect(() => {
    if (!hasMachineDataFix) return;

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
      });
    });

    formattedDressingTools.forEach((dressingTool: ToolDressingOptionItem) => {
      // Filtra apenas os nomes do tipo correspondente (ex: fixedDiamond)
      const typeName = dressingTool.name
        .replace(/^tool\d/, '')
        .replace('Qtd', '');

      // Para cada contorno, verifica se o sufixo é maior que a quantidade
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

    // Resetar o estado de hasMachineDataFix após processar as alterações
    dispatch(editApp({ hasMachineDataFix: undefined }));
  }, [
    hasMachineDataFix,
    part,
    formattedTools,
    dispatch,
    formattedDressingTools,
    dressingToolsNames,
  ]);
};

export default useHandleMachineDataChange;
