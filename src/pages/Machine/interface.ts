import { SelectOptions } from 'components/Select/interface';
import { StoredCncToolsData } from 'types/api';

export type FieldState = {
  value: string | number;
  options?: SelectOptions;
  inputType?: 'select' | 'text';
  error: boolean;
  message: string | undefined;
};

export type RenderFieldProps = {
  label: string;
  name: keyof StoredCncToolsData;
  type: string;
  inputType?: 'select' | 'text';
  options?: SelectOptions;
  placeholder?: string;
}[];

export type FormState = {
  [key in keyof StoredCncToolsData]: FieldState;
};
