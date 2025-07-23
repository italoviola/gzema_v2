export interface ElementItem {
  id: string;
  label: string;
  xaxis: number;
  zaxis: number;
  height: number;
  width: number;
  leftDiameter: number;
  rightDiameter: number;
}

export interface Elements extends Array<ElementItem> {}
