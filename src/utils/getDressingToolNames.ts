import {
  DressingTools,
  DressingToolsNames,
  ToolDressingOptionItem,
} from 'types/tools';

export function getDressingToolNames(
  formattedTools: { id: number }[],
  fDressingTools: ToolDressingOptionItem[],
): DressingTools {
  return formattedTools.reduce((acc, tool) => {
    const dressingTools = fDressingTools.filter(
      (dressingTool: ToolDressingOptionItem) => dressingTool.toolId === tool.id,
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
}
