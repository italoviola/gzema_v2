import { ElementItem } from 'types/element';

export interface ElementFormProps {
  element?: ElementItem | null;
  onClose?: () => void;
  isNew?: boolean;
}
