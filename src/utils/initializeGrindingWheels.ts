import { ToolOptionItem } from 'types/formattedTools';
import {
  GrindingWheels,
  GrindingWheelsItem,
  GWDressingToolsData,
} from 'types/part';

export const initializeGrindingWheels = (
  formattedTools: ToolOptionItem[],
  dressingToolNames: Record<string, string[]>,
): GrindingWheels => {
  return formattedTools.map((tool: ToolOptionItem): GrindingWheelsItem => {
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
  });
};
