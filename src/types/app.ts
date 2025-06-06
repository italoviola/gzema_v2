export interface App {
  fileName?: string;
  isSaved?: boolean;
  lastSavedFileState?: string;
  lastFilePathSaved?: string;
  lastGeneratedCodes?: string[];
  hasImportedMachineDataChange?: true;
  hasFixFromMachineDataChange?: true;
  hasGrindingWheelUpdate?: true;
  hasSaveStatusUpdate?: true;
  hasFormattedToolsUpdate?: true;
  hasImportedMachineDataFToolsUpdate?: true;
}
