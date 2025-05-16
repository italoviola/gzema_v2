import React from 'react';
import { ToolOptions } from 'types/formattedTools';

export interface SelectOptionsItem {
  label: string;
  value: number;
}

export interface SelectOptions extends Array<SelectOptionsItem> {}

export interface SelectComponentProps {
  label?: string;
  name: string;
  options: ToolOptions | SelectOptions;
  onChange: (value: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string | number;
  disabled?: boolean;
}
