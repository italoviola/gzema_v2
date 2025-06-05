import { StoredCncData } from 'types/api';
import { Machine } from 'types/fileTypes';

export const extractCncData = (
  machine: Machine,
): {
  cncData: StoredCncData;
  toolsData: Omit<Machine, keyof StoredCncData>;
} => {
  const { notationPattern, hasBAxis, ...toolsData } = machine;

  const cncData: StoredCncData = {
    notationPattern,
    hasBAxis,
  };

  return { cncData, toolsData };
};
