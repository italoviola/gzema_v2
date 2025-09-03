export interface ChartProps {
  points?: Points;
}

export interface Points extends Array<PointItem> {}

export interface PointItem {
  id: string;
  x: number;
  y: number;
  radius: number;
  fill: string;
}
