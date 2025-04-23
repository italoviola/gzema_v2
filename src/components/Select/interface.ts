import React from 'react';

export interface ToolOptionItem {
  id: number;
  label: string;
  type: number;
  value: number;
}

export interface ToolOptions extends Array<ToolOptionItem> {}

export interface ToolDressingOptionItem {
  name: string;
  quantity: number;
  toolId: number;
}

export interface ToolDressingOptions extends Array<ToolDressingOptionItem> {}

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
}
