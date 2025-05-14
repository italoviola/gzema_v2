import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ToolOptionItem } from 'components/Select/interface';

import { setGrindingWheelData } from 'state/part/partSlice';

import {
  GrindingWheels,
  GrindingWheelsItem,
  GWDressingToolsData,
} from 'types/part';

import useRelatedTools from './useRelatedTools';
import useFormattedTools from './useFormattedTools';

const useInitializeGrindingWheels = () => {
  const dispatch = useDispatch();

  const dressingToolNames = useRelatedTools();
  const formattedTools = useFormattedTools();

  const selectorGrindingWheels = useSelector(
    (state: { part: { grindingWheels: GrindingWheels } }) =>
      state.part.grindingWheels,
  );

  useEffect(() => {
    if (
      selectorGrindingWheels.length === 0 &&
      formattedTools.length > 0 &&
      Object.entries(dressingToolNames).length > 0
    ) {
      const initialGrindingWheels: GrindingWheels = formattedTools.map(
        (tool: ToolOptionItem): GrindingWheelsItem => {
          const dressingTools = dressingToolNames[`tool${tool.id}`] || [];
          const dressingToolsData: GWDressingToolsData = dressingTools.map(
            (name) => ({
              name,
              bAxisAngle: 0,
            }),
          );

          return {
            id: tool.id,
            label: tool.label,
            xSafetyDistance: 0,
            zSafetyDistance: 0,
            dressingToolsData,
          };
        },
      );

      dispatch(setGrindingWheelData(initialGrindingWheels));
    }
  }, [selectorGrindingWheels, formattedTools, dressingToolNames, dispatch]);
};

export default useInitializeGrindingWheels;
