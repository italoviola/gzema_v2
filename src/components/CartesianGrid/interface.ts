export interface CartesianGridProps {
  zoomLevel: number;
  stagePosition: { x: number; y: number };
  strokeWidth: number;
  getFontSize: () => number;
  stageWidth?: number;
  stageHeight?: number;
}

export interface GenerateGridParams {
  isHorizontal: boolean;
  min: number;
  max: number;
  fixed1: number;
  fixed2: number;
  mainKey: string;
  labelKey: string;
  subKey: string;
  intermediateStepSize: number;
  baseGridSize: number;
  zoomLevel: number;
  strokeWidth: number;
  getFontSize: () => number;
  stagePosition: { x: number; y: number };
  stageWidth: number;
  stageHeight: number;
}
