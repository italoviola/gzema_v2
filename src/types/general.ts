import { GZemaFile } from './fileTypes';

export interface FileObject {
  data: GZemaFile;
  path: string | undefined;
  fileName: string;
}

export interface SaveObject {
  success: boolean;
  saveType: 'saveFile' | 'saveFileAs';
  filePath?: string;
}
