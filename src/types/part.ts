import {
  TYPE_EXTERNAL,
  TYPE_INTERNAL,
  MACHINING_GRINDING,
  MACHINING_DRESSING,
} from 'utils/constants';

// Types
export type ContourType = typeof TYPE_EXTERNAL | typeof TYPE_INTERNAL;
export type Machining = typeof MACHINING_GRINDING | typeof MACHINING_DRESSING;
export type CornerType =
  | { type: 'rounded'; radiusType: 'convex' | 'concave'; radius: number }
  | { type: 'chamfer'; length: number; angle: number }
  | { type: 'none' };

// Interfaces
export interface ActionParamItem {
  id: string;
  fakeId?: string;
  placeholder: string;
}

export interface ActionParams extends Array<ActionParamItem> {}

export interface ActivitiyItem {
  id: number;
  actionCode: string;
  actionParams: ActionParams;
}

export interface Activities extends Array<ActivitiyItem> {}

export interface ContourItem {
  id: number;
  name: string;
  machining: Machining;
  type: ContourType;
  activities: Activities;
  dressingTool?: string;
}

export interface Contours extends Array<ContourItem> {}

export interface OperationItem {
  id: number;
  name: string;
  toolId: number;
  bAxisAngle: number;
  contoursIds: number[];
  contoursIdsExcluded?: number[];
}

export interface Operations extends Array<OperationItem> {}

export interface GWDressingToolsDataItem {
  name: string;
  bAxisAngle: number;
}

export interface GWDressingToolsData extends Array<GWDressingToolsDataItem> {}

export interface GrindingWheelsItem {
  id: number;
  label: string;
  xSafetyDistance: number;
  zSafetyDistance: number;
  dressingToolsData: GWDressingToolsData;
}

export interface GrindingWheels extends Array<GrindingWheelsItem> {}

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

export interface ElementItems extends Array<ElementItem> {}

export interface Part {
  id: string;
  contours: Contours;
  operations: Operations;
  grindingWheels: GrindingWheels;
  elements: ElementItems;
}
