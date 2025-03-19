import { useState, useEffect } from 'react';
import useFormattedTools from 'hooks/useFormattedTools';
import useFormattedDressingTools from 'hooks/useFormattedDressingTools';

interface DressingToolNames {
  [key: string]: string[];
}

const useRelatedTools = () => {
  const formattedTools = useFormattedTools();
  const fDressingTools = useFormattedDressingTools();
  const [dressingToolNames, setDressingToolNames] = useState<DressingToolNames>(
    {},
  );

  useEffect(() => {
    const toolNames = formattedTools.reduce((acc, tool) => {
      const dressingTools = fDressingTools.filter(
        (dressingTool) => dressingTool.toolId === tool.id,
      );

      acc[`tool${tool.id}`] = dressingTools.flatMap((dressingTool) =>
        [...Array(dressingTool.quantity)].map((_, i) => {
          const noPrefixToolName = dressingTool.name
            .replace(/tool[1-4]/, '')
            .replace('Qtd', '');
          return `${noPrefixToolName}${i + 1}`;
        }),
      );

      return acc;
    }, {} as DressingToolNames);

    setDressingToolNames(toolNames);
  }, [formattedTools, fDressingTools]);

  return dressingToolNames;
};

export default useRelatedTools;
