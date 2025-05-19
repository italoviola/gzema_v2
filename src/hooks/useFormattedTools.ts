import { useState, useEffect } from 'react';

import { loadTools } from 'utils/loadTools';
import { TYPE_EXTERNAL, TYPE_INTERNAL } from 'utils/constants';

import { Tools } from 'types/api';
import { ToolOptions } from 'types/formattedTools';
import { useSelector } from 'react-redux';

export const fetchFormattedTools = async (): Promise<ToolOptions> => {
  const tools: Tools = await loadTools();
  if (tools) {
    const toolVars: (keyof Tools)[] = [
      'tool1Var',
      'tool2Var',
      'tool3Var',
      'tool4Var',
    ];
    return toolVars
      .filter((prop) => tools[prop as keyof Tools] !== 0)
      .map((prop) => {
        // Extrai o número do nome da propriedade, ex: "tool1Var" -> 1
        const match = prop.match(/\d+/);
        const id = match ? Number(match[0]) : 0;
        let label = `Rebolo ${id} (${tools[prop].toString()})`;
        if (tools[prop] === TYPE_EXTERNAL) {
          label = `Rebolo ${id} (Externo)`;
        } else if (tools[prop] === TYPE_INTERNAL) {
          label = `Rebolo ${id} (Interno)`;
        } else {
          label = `Rebolo ${id} (Inexistente)`;
        }
        return {
          id,
          label,
          type: tools[prop],
          value: id,
        };
      });
  }
  return [];
};

const useFormattedTools = () => {
  const [formattedTools, setFormattedTools] = useState<ToolOptions>([]);
  const hasMachineDataChange = useSelector(
    (state: { app: { hasMachineDataChange: boolean } }) =>
      state.app.hasMachineDataChange,
  );

  useEffect(() => {
    const fetchTools = async () => {
      const fTools = await fetchFormattedTools();
      setFormattedTools(fTools);
    };

    fetchTools();
  }, [hasMachineDataChange]);

  return formattedTools;
};

export default useFormattedTools;
