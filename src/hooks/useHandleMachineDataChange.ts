import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editApp } from 'state/app/appSlice';
import { removeContourFromOperation } from 'state/part/partSlice';
import { Part, ContourItem, OperationItem } from 'types/part';
import useFormattedTools from './useFormattedTools';

const useHandleMachineDataChange = () => {
  const dispatch = useDispatch();
  const formattedTools = useFormattedTools();

  const hasMachineDataFix = useSelector(
    (state: { app: { hasMachineDataFix: boolean } }) =>
      state.app.hasMachineDataFix,
  );
  const part = useSelector((state: { part: Part }) => state.part);

  useEffect(() => {
    if (!hasMachineDataFix) return;

    part.operations.forEach((operation: OperationItem) => {
      // Descobre o tipo da ferramenta da operação
      const operationToolType = formattedTools.find(
        (tool) => tool.id === operation.toolId,
      )?.type;

      if (!operationToolType) return;

      // Para cada contorno da operação, verifica se o tipo bate
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

    // Resetar o estado de hasMachineDataFix após processar as alterações
    dispatch(editApp({ hasMachineDataFix: undefined }));
  }, [hasMachineDataFix, part, formattedTools, dispatch]);
};

export default useHandleMachineDataChange;
