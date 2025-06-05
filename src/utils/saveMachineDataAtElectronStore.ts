import { Machine } from 'types/fileTypes';
import { extractCncData } from './extractCncData';

export const saveMachineDataAtElectronStore = async (
  machine: Machine,
): Promise<void> => {
  const { cncData, toolsData } = extractCncData(machine);

  await window.electron.store.set('cnc', cncData);
  await window.electron.store.set('tools', toolsData);
};
