export interface App {
  fileName?: string;
  isSaved?: boolean;
  lastSavedFileState?: string;
  lastFilePathSaved?: string;
  lastGeneratedCodes?: string[];
  hasImportedMachineDataChange?: true | undefined;
  hasFixFromMachineDataChange?: true | undefined;
  hasGrindingWheelUpdate?: true | undefined;
}
