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
