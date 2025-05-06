import { Machine } from 'types/fileTypes';
import { extractCncData } from './extractCncData';

export const setMachineData = async (machine: Machine): Promise<void> => {
  try {
    const { cncData, toolsData } = extractCncData(machine);

    await window.electron.store.set('cnc', cncData);
    await window.electron.store.set('tools', toolsData);

    console.log('Machine data successfully saved to electron-store.', machine);
  } catch (error) {
    console.error('Error saving machine data to electron-store:', error);
    // throw error;
  }
};
