import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { deleteOperation, editOperation } from 'state/part/partSlice';
import { editApp } from 'state/app/appSlice';

import { Operations } from 'types/part';

import useFormattedTools from './useFormattedTools';

const useInitializeOperationToolId = () => {
  const dispatch = useDispatch();
  const formattedTools = useFormattedTools();
  const operations = useSelector(
    (state: { part: { operations: Operations } }) => state.part.operations,
  );

  useEffect(() => {
    const firstValidTool = formattedTools.find((tool) => tool.type !== 0);
    if (!firstValidTool) {
      // console.error('No valid tool found');
      // if (operations.length > 0) {
      //   console.warn('Deleting operation with no valid tool');
      //   dispatch(deleteOperation(operations[0].id));
      //   dispatch(editApp({ isSaved: true }));
      // }
      return;
    }

    operations.forEach((operation) => {
      const tool = formattedTools.find((t) => t.id === operation.toolId);
      if (tool && tool.type === 0) {
        dispatch(
          editOperation({
            id: operation.id,
            operation: {
              toolId: firstValidTool.id,
              name: operation.name,
              bAxisAngle: operation.bAxisAngle,
            },
          }),
          editApp({
            isSaved: true,
          }),
        );
      }
    });
  }, [formattedTools, operations, dispatch]);
};

export default useInitializeOperationToolId;
