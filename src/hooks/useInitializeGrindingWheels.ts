import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setGrindingWheelData } from 'state/part/partSlice';
import {
  GrindingWheels,
  GrindingWheelsItem,
  GWDressingToolsData,
} from 'types/part';
import { ToolOptionItem } from 'components/Select/interface';

const useInitializeGrindingWheels = (
  selectorGrindingWheels: GrindingWheels,
  formattedTools: ToolOptionItem[],
  dressingToolNames: Record<string, string[]>,
) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectorGrindingWheels.length === 0 && formattedTools.length > 0) {
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
