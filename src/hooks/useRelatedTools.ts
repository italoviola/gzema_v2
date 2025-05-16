import { useState, useEffect } from 'react';

import useFormattedTools from 'hooks/useFormattedTools';
import useFormattedDressingTools from 'hooks/useFormattedDressingTools';

import { ToolDressingOptionItem } from 'types/formattedTools';

export type DressingToolsNames =
  | 'fixedDiamond'
  | 'refractableDiamond'
  | 'dressingDisc'
  | 'fixedDressingRoller'
  | 'sCtrlMovableDressingRoller';

export interface DressingTools {
  [key: string]: string[];
}

const useRelatedTools = () => {
  const formattedTools = useFormattedTools();
  const fDressingTools = useFormattedDressingTools();
  const [dressingToolNames, setDressingToolNames] = useState<DressingTools>({});

  useEffect(() => {
    const toolNames: DressingTools = formattedTools.reduce((acc, tool) => {
      const dressingTools = fDressingTools.filter(
        (dressingTool: ToolDressingOptionItem) =>
          dressingTool.toolId === tool.id,
      );

      acc[`tool${tool.id}`] = dressingTools.flatMap(
        (dressingTool: ToolDressingOptionItem) =>
          [...Array(dressingTool.quantity)].map((_, i) => {
            const noPrefixToolName: DressingToolsNames = dressingTool.name
              .replace(/tool[1-4]/, '')
              .replace('Qtd', '') as DressingToolsNames;
            return `${noPrefixToolName}${i + 1}`;
          }),
      );

      return acc;
    }, {} as DressingTools);

    setDressingToolNames(toolNames);
  }, [formattedTools, fDressingTools]);

  return dressingToolNames;
};

export default useRelatedTools;
