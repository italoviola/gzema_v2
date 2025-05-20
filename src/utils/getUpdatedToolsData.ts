import { loadTools } from 'utils/loadTools';
import { getFormattedTools, getDressingToolNames } from 'utils/yourFormatUtils'; // ajuste o caminho conforme necessário

export async function getUpdatedToolsData() {
  const toolsData = await loadTools();
  const formattedTools = getFormattedTools(toolsData);
  const dressingToolNames = getDressingToolNames(toolsData);
  return { formattedTools, dressingToolNames };
}