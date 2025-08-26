import { ElementItem } from 'types/part';

export interface ElementFormProps {
  element?: ElementItem | null;
  onClose?: () => void;
  isNew?: boolean;
}

export type OptionItems = Array<{ value: string; label: string }>;
