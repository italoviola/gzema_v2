import React from 'react';
import { Line, Rect, Text } from 'react-konva';

import { getTextOffset } from './utils';

const MAIN_LINE_COLOR = '#000000';
const SECONDARY_LINE_COLOR = '#7a7979';
const INTERMEDIATE_LINE_COLOR = '#7a7979';
const SUB_LINE_COLOR = '#a8a8a8';
const SUB_SUB_LINE_COLOR = '#91df91eb';

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
  stagePosition: { x: number; y: number };
  stageWidth: number;
  stageHeight: number;
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
  stagePosition,
  stageWidth,
  stageHeight,
}: GenerateGridParams): React.ReactNode[] {
  const elements = [];

  // Calcula os limites visíveis do grid
  let visibleMin = isVertical
    ? stagePosition.x / zoomLevel
    : stagePosition.y / zoomLevel;
  let visibleMax = isVertical
    ? (stagePosition.x + stageWidth) / zoomLevel
    : (stagePosition.y + stageHeight) / zoomLevel;

  // Garante que min < max
  if (visibleMin > visibleMax) {
    [visibleMin, visibleMax] = [visibleMax, visibleMin];
  }

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

    const fontSize = getFontSize();
    const padding = fontSize * 0.1; // ajuste conforme necessário
    const textValue = `${Math.round(v)}`;
    const textWidth = fontSize * textValue.length * 0.6; // aproximação
    const textHeight = fontSize;
    const { offsetX, offsetY } = getTextOffset(v, isVertical, fontSize);

    // Renderiza o texto principal apenas se zoomLevel < 512
    if (zoomLevel < 512) {
      elements.push(
        <Rect
          key={`bg-zoom${zoomLevel < 512 ? 'Low' : 'High'}-${labelKey}-${v}`}
          x={(isVertical ? v : 0) - offsetX - padding / 2}
          y={(isVertical ? 0 : v) - offsetY - padding / 2}
          width={textWidth + padding}
          height={textHeight + padding}
          fill="white"
        />,
      );
      elements.push(
        <Text
          key={`zoom${zoomLevel < 512 ? 'Low' : 'High'}-${labelKey}-${v}`}
          x={isVertical ? v : 0}
          y={isVertical ? 0 : v}
          text={textValue}
          fontSize={fontSize}
          fill="black"
          offsetX={offsetX}
          offsetY={offsetY}
          fontFamily="monospace"
          fontStyle="bold"
        />,
      );
    }

    // Sublinhas
    if (zoomLevel > 10) {
      const subStep = intermediateStepSize / 10;
      const subStart = Math.floor(min / subStep) * subStep;
      for (let subV = subStart; subV <= max; subV += subStep) {
        if (subV >= min && subV <= max) {
          elements.push(
            <Line
              key={`${subKey}-${v}-${subV}`}
              points={
                isVertical
                  ? [subV, fixed1, subV, fixed2]
                  : [fixed1, subV, fixed2, subV]
              }
              stroke={SUB_LINE_COLOR}
              strokeWidth={strokeWidth / 8}
            />,
          );

          // Só renderiza números e sub-sublinhas se zoomLevel >= 512
          if (zoomLevel >= 512) {
            const subFontSize = getFontSize();
            const subPadding = subFontSize * 0.1;
            const subTextValue = subV.toFixed(1); // Mostra décimos de milímetro
            const subTextWidth = subFontSize * subTextValue.length * 0.6;
            const subTextHeight = subFontSize;
            const { offsetX: subOffsetX, offsetY: subOffsetY } = getTextOffset(
              subV,
              isVertical,
              subFontSize,
            );

            elements.push(
              <Rect
                key={`bg-zoom${zoomLevel < 512 ? 'Low' : 'High'}-subText-${
                  isVertical ? 'v' : 'h'
                }-${subV}`}
                x={(isVertical ? subV : 0) - subOffsetX - subPadding / 2}
                y={(isVertical ? 0 : subV) - subOffsetY - subPadding / 2}
                width={subTextWidth + subPadding}
                height={subTextHeight + subPadding}
                fill="white"
              />,
            );
            elements.push(
              <Text
                key={`zoom${zoomLevel < 512 ? 'Low' : 'High'}-subText-${
                  isVertical ? 'v' : 'h'
                }-${subV}`}
                x={isVertical ? subV : 0}
                y={isVertical ? 0 : subV}
                text={subTextValue}
                fontSize={subFontSize}
                fill="black"
                offsetX={subOffsetX}
                offsetY={subOffsetY}
                fontFamily="monospace"
                fontStyle="bold"
              />,
            );

            // Sub-sublinhas (apenas para zoom muito alto)
            const subSubStep = subStep / 10;
            const subSubStart = Math.floor(subV / subSubStep) * subSubStep;
            for (
              let subSubV = subSubStart;
              subSubV < subV + subStep && subSubV <= max;
              subSubV += subSubStep
            ) {
              if (subSubV >= min && subSubV <= max) {
                elements.push(
                  <Line
                    key={`${subKey}-subsub-${v}-${subV}-${subSubV}`}
                    points={
                      isVertical
                        ? [subSubV, fixed1, subSubV, fixed2]
                        : [fixed1, subSubV, fixed2, subSubV]
                    }
                    stroke={SUB_SUB_LINE_COLOR}
                    strokeWidth={strokeWidth / 6}
                  />,
                );
              }
            }
          }
        }
      }
    }
  }
  return elements;
}
