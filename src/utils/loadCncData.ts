import { StoredCncData } from 'types/api';

// When refering to the tools, we use index the array index. Index 0 is tool 1, index 1 is tool 2, and so on.
export const defaultData: StoredCncData = {
  notationPattern: 0,
  hasBAxis: 0,
};

export const loadCncData = async () => {
  const savedData: StoredCncData = await window.electron.store.get('cnc');

  if (savedData) return savedData;
  return defaultData;
};
