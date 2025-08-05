export interface ElementItem {
  id: string;
  label: string;
  xaxis: number; // Mantemos para referência e compatibilidade
  zaxis: number; // Mantemos como ponto central vertical
  leftZAxis: number;
  rightZAxis: number;
  leftDiameter: number;
  rightDiameter: number;
}

export interface Elements extends Array<ElementItem> {}
