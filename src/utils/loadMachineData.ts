import { Machine } from 'types/fileTypes';

import { loadCncData } from './loadCncData';
import { loadTools } from './loadTools';

export const loadMachineData = async (): Promise<Machine> => {
  const cncData = await loadCncData();
  const toolsData = await loadTools();

  return {
    notationPattern: cncData.notationPattern,
    hasBAxis: cncData.hasBAxis,
    ...toolsData,
  };
};
