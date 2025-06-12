import React from 'react';
import { Line, Text } from 'react-konva';

const MAIN_LINE_COLOR = '#1a1a1a';
const SECONDARY_LINE_COLOR = '#7a7979';
const INTERMEDIATE_LINE_COLOR = '#eee';
const SUB_LINE_COLOR = '#e5e9e5';

export interface GenerateGridParams {
  isVertical: boolean;
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
}

export function generateGrid({
  isVertical,
  min,
  max,
  fixed1,
  fixed2,
  mainKey,
  labelKey,
  subKey,
  intermediateStepSize,
  baseGridSize,
  zoomLevel,
  strokeWidth,
  getFontSize,
}: GenerateGridParams): React.ReactNode[] {
  const elements = [];
  for (let v = min; v <= max; v += intermediateStepSize) {
    // Usa as constantes de cor
    let strokeColor = INTERMEDIATE_LINE_COLOR;
    if (v % baseGridSize === 0) {
      strokeColor = MAIN_LINE_COLOR;
    } else if (zoomLevel > 10) {
      strokeColor = SECONDARY_LINE_COLOR;
    }

    elements.push(
      <Line
        key={`${mainKey}-${v}`}
        points={isVertical ? [v, fixed1, v, fixed2] : [fixed1, v, fixed2, v]}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />,
    );
    // Label
    if (v % baseGridSize === 0) {
      elements.push(
        <Text
          key={`${labelKey}-${v}`}
          x={isVertical ? v : 0}
          y={isVertical ? 0 : v}
          text={`${Math.round(v)}`}
          fontSize={getFontSize()}
          fill="black"
          offsetX={0}
          offsetY={0}
        />,
      );
    } else if (zoomLevel > 5 && v % (baseGridSize / 10) === 0) {
      elements.push(
        <Text
          key={`${labelKey}-small-${v}`}
          x={isVertical ? v : 0}
          y={isVertical ? 0 : v}
          text={`${Math.round(v)}`}
          fontSize={getFontSize()}
          fill="gray"
          offsetX={0}
          offsetY={0}
        />,
      );
    }
    // Sublinhas
    if (zoomLevel > 10) {
      const subStep = intermediateStepSize / 10;
      for (let sub = 1; sub < 10; sub += 1) {
        const subV = v + sub * subStep;
        if (subV > max) break;
        if (subV >= min && subV <= max) {
          elements.push(
            <Line
              key={`${subKey}-${v}-${sub}`}
              points={
                isVertical
                  ? [subV, fixed1, subV, fixed2]
                  : [fixed1, subV, fixed2, subV]
              }
              stroke={SUB_LINE_COLOR}
              strokeWidth={strokeWidth / 2}
            />,
          );
        }
      }
    }
  }
  return elements;
}
