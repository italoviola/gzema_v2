export interface App {
  fileName?: string;
  isSaved?: boolean;
  lastSavedFileState?: string;
  lastFilePathSaved?: string;
  lastGeneratedCodes?: string[];
  hasMachineDataChange?: boolean;
  hasMachineDataFix?: boolean;
}
