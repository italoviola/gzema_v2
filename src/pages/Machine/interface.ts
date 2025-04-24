import { SelectOptions } from 'components/Select/interface';
import { StoredCncToolsData } from 'types/api';

export type FieldState = {
  value: string | number;
  options: SelectOptions;
  error: boolean;
  message: string | undefined;
};

export type RenderFieldProps = {
  label: string;
  name: keyof StoredCncToolsData;
  type: string;
  options: SelectOptions;
}[];

export type FormState = {
  [key in keyof StoredCncToolsData]: FieldState;
};
