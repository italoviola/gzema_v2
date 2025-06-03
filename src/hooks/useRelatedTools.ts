import { useState, useEffect } from 'react';

import useFormattedTools from 'hooks/useFormattedTools';
import useFormattedDressingTools from 'hooks/useFormattedDressingTools';
import {
  DressingTools,
  getDressingToolNames,
} from 'utils/getDressingToolNames';

const useRelatedTools = () => {
  const formattedTools = useFormattedTools();
  const fDressingTools = useFormattedDressingTools();
  const [dressingToolNames, setDressingToolNames] = useState<DressingTools>({});

  useEffect(() => {
    const toolNames = getDressingToolNames(formattedTools, fDressingTools);
    setDressingToolNames(toolNames);
  }, [formattedTools, fDressingTools]);

  return dressingToolNames;
};

export default useRelatedTools;
