export interface ElementItem {
  id: string;
  label: string;
  xaxis: number;
  leftZAxis: number;
  rightZAxis: number;
  leftDiameter: number;
  rightDiameter: number;
}

export interface ElementItems extends Array<ElementItem> {}

export interface Elements {
  items: ElementItems;
  selectedElementId: string | null;
  isFormOpen: boolean;
}
