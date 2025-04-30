import { StoredCncData } from 'types/api';
import { B_AXIS_NO_SPIN, NOTATION_ZEMA } from './constants';

export const defaultData: StoredCncData = {
  notationPattern: NOTATION_ZEMA,
  hasBAxis: B_AXIS_NO_SPIN,
};

export const loadCncData = async () => {
  const savedData: StoredCncData = await window.electron.store.get('cnc');

  console.log('savedData', savedData);
  console.log('defaultData', defaultData);

  if (savedData) return savedData;
  return defaultData;
};
