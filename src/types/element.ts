export interface ElementItem {
  id: string;
  label: string;
  xaxis: number;
  leftZAxis: number;
  rightZAxis: number;
  leftDiameter: number;
  rightDiameter: number;
  corners: Corners;
}

export interface Corners {
  left: CornerType;
  right: CornerType;
}

export type CornerType =
  | { type: 'rounded'; radiusType: 'convex' | 'concave'; radius: number }
  | { type: 'chamfer'; length: number; angle: number }
  | { type: 'none' };

export interface ElementItems extends Array<ElementItem> {}

export interface Elements {
  items: ElementItems;
  selectedElementId: string | null;
  isFormOpen: boolean;
}
