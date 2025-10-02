import React from 'react';
import { Line, Rect, Text, Group } from 'react-konva';

import { gridColors } from 'styles/global.styles';

import { createGridText } from './createGridText';
import { gridLimits } from '../constants';
import { GenerateGridParams } from '../interface';

export function generateGrid({
  isHorizontal,
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
  const mainElements: React.ReactNode[] = [];
  const detailElements: React.ReactNode[] = [];

  // Set visible gridlimits based on stage position and zoom level
  const visibleMin = isHorizontal
    ? -stagePosition.x / zoomLevel
    : -stagePosition.y / zoomLevel;
  const visibleMax = isHorizontal
    ? (stageWidth - stagePosition.x) / zoomLevel
    : (stageHeight - stagePosition.y) / zoomLevel;

  const effectiveMin = Math.max(min, visibleMin);
  const effectiveMax = Math.min(max, visibleMax);

  // First, render the main grid lines and texts
  const startValue =
    Math.floor(effectiveMin / intermediateStepSize) * intermediateStepSize;
  for (let v = startValue; v <= effectiveMax; v += intermediateStepSize) {
    let strokeColor = gridColors.intermediateLine;
    if (v % baseGridSize === 0) {
      strokeColor = gridColors.mainLine;
    } else if (zoomLevel > 10) {
      strokeColor = gridColors.secondaryLine;
    }

    mainElements.push(
      <Line
        key={`${mainKey}-${v}`}
        points={isHorizontal ? [v, fixed1, v, fixed2] : [fixed1, v, fixed2, v]}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />,
    );

    if (zoomLevel < 512) {
      mainElements.push(
        createGridText(
          `${labelKey}-main-${v}`,
          v,
          `${Math.round(v)}`,
          isHorizontal,
          getFontSize(),
          'black',
          zoomLevel,
        ),
      );
    }
  }

  // Second, render details (sublines, sub-texts, etc.) based on zoomLevel

  // Sublines
  if (zoomLevel > 8 && detailElements.length < gridLimits.MAX_DETAIL_ELEMENTS) {
    const subStep = intermediateStepSize / 10;
    const subStart = Math.floor(visibleMin / subStep) * subStep;
    const subEnd = Math.ceil(visibleMax / subStep) * subStep;

    for (let subV = subStart; subV <= subEnd; subV += subStep) {
      if (subV !== 0 && subV >= visibleMin && subV <= visibleMax) {
        detailElements.push(
          <Line
            key={`${subKey}-sub-${subV}`}
            points={
              isHorizontal
                ? [subV, fixed1, subV, fixed2]
                : [fixed1, subV, fixed2, subV]
            }
            stroke={gridColors.subLine}
            strokeWidth={strokeWidth / 2}
          />,
        );
      }
    }
  }

  // Sub-texts
  if (
    zoomLevel >= 256 &&
    zoomLevel < 2048 &&
    detailElements.length < gridLimits.MAX_DETAIL_ELEMENTS
  ) {
    const subStep = intermediateStepSize / 10;
    const subStart = Math.floor(visibleMin / subStep) * subStep;
    const subEnd = Math.ceil(visibleMax / subStep) * subStep;

    for (let subV = subStart; subV <= subEnd; subV += subStep) {
      if (
        subV >= visibleMin &&
        subV <= visibleMax &&
        detailElements.length < gridLimits.MAX_DETAIL_ELEMENTS
      ) {
        const subText = subV === 0 ? '0' : subV.toFixed(1);
        detailElements.push(
          createGridText(
            `${labelKey}-sub-${subV}`,
            subV,
            subText,
            isHorizontal,
            getFontSize(),
            'black',
            zoomLevel,
          ),
        );
      }
    }
  }

  // Sub sub-lines
  if (
    zoomLevel >= 512 &&
    detailElements.length < gridLimits.MAX_DETAIL_ELEMENTS
  ) {
    const subStep = intermediateStepSize / 100;
    const subSubStart = Math.floor(visibleMin / subStep) * subStep;
    const subSubEnd = Math.ceil(visibleMax / subStep) * subStep;

    for (let subSubV = subSubStart; subSubV <= subSubEnd; subSubV += subStep) {
      if (
        subSubV !== 0 &&
        subSubV >= visibleMin &&
        subSubV <= visibleMax &&
        detailElements.length < gridLimits.MAX_DETAIL_ELEMENTS
      ) {
        detailElements.push(
          <Line
            key={`${subKey}-subsub-${subSubV.toFixed(2)}`}
            points={
              isHorizontal
                ? [subSubV, fixed1, subSubV, fixed2]
                : [fixed1, subSubV, fixed2, subSubV]
            }
            stroke={gridColors.subSubLine}
            strokeWidth={strokeWidth / 2}
          />,
        );
      }
    }
  }

  // Microlines and microtexts
  if (zoomLevel >= 2048) {
    const microStep = intermediateStepSize / 1000; // Divide the intermediate step size into 1000 parts for microlines
    const microLines: React.ReactNode[] = [];
    const microTexts: React.ReactNode[] = [];

    // Loop start to render microlines e microtexts from center to edges
    for (let i = 0; ; i += 1) {
      const centerOffset = i * microStep; // Apply micro step division to for
      let addedInIteration = false;

      // Process both sides (positive and negative) to expand from the center
      const microStepIntervalsToProcess =
        i === 0 ? [0] : [centerOffset, -centerOffset];

      microStepIntervalsToProcess.forEach((item) => {
        if (item >= visibleMin && item <= visibleMax) {
          let elementAdded = false;

          // Adds microlines until the limit, skipping line 0
          if (item !== 0 && microLines.length < gridLimits.MAX_MICRO_LINES) {
            const isHighlighted = Math.round(item * 100) % 10 === 0;

            microLines.push(
              <Line
                key={`${subKey}-micro-${item.toFixed(3)}`}
                points={
                  isHorizontal
                    ? [item, fixed1, item, fixed2]
                    : [fixed1, item, fixed2, item]
                }
                stroke={
                  isHighlighted
                    ? gridColors.highlightedMicroLine
                    : gridColors.microLine
                }
                strokeWidth={strokeWidth / 2}
              />,
            );
            elementAdded = true;
          }

          // Adds microtexts at specific intervals and until the limit
          const roundedV = Math.round(item * 100) / 100;
          if (
            Math.round(roundedV * 100) % 10 === 0 &&
            microTexts.length < gridLimits.MAX_MICRO_TEXTS * 2 // *2 because we render both Text and Rect elements
          ) {
            const microText = roundedV === 0 ? '0' : roundedV.toFixed(2);
            microTexts.push(
              createGridText(
                `micro-${labelKey}-${roundedV.toFixed(2)}`,
                roundedV,
                microText,
                isHorizontal,
                getFontSize(),
                '#006600',
                zoomLevel,
                true,
              ),
            );
            elementAdded = true;
          }

          if (elementAdded) {
            addedInIteration = true;
          }
        }
      });

      // Check if the center offset is out of bounds or if limits are reached
      const outOfBounds =
        centerOffset > Math.max(Math.abs(visibleMin), Math.abs(visibleMax));
      const limitsReached =
        microLines.length >= gridLimits.MAX_MICRO_LINES &&
        microTexts.length >= gridLimits.MAX_MICRO_TEXTS * 2;

      if ((!addedInIteration && outOfBounds) || limitsReached) {
        break;
      }
    }
    detailElements.push(...microLines, ...microTexts);
  }

  // Order elements, lines first, then texts and rects
  const lines: React.ReactNode[] = [];
  const textsAndRects: React.ReactNode[] = [];

  [...mainElements, ...detailElements].forEach((element: any) => {
    if (
      element &&
      (element.type === Text || element.type === Rect || element.type === Group)
    ) {
      textsAndRects.push(element);
      return;
    }

    if (element && element.type === Line) {
      const key = element.key?.toString() || '';
      // Force x-axis line to be rendered first
      const isHorizontalAxisLine =
        !isHorizontal && key.includes(`${mainKey}-0`);

      if (isHorizontalAxisLine) {
        lines.unshift(element);
      } else {
        lines.push(element);
      }
    }
  });

  // Apply rendering limits to lines and texts before combine them
  const linesToRender = lines.slice(0, gridLimits.MAX_LINES);
  const textsToRender = textsAndRects.slice(0, gridLimits.MAX_TEXTS);

  return [...linesToRender, ...textsToRender];
}
