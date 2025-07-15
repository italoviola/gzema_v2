export interface RulerProps {
  orientation: 'horizontal' | 'vertical';
  zoomLevel: number;
  stagePosition: { x: number; y: number };
  width: number;
  height: number;
}
