import React, { useMemo } from 'react';
import { Stage, Layer, Line, Text } from 'react-konva';
import { rulerColors } from 'styles/global.styles';

interface RulerProps {
  orientation: 'horizontal' | 'vertical';
  zoomLevel: number;
  stagePosition: { x: number; y: number };
  width: number;
  height: number;
}

const Ruler: React.FC<RulerProps> = ({
  orientation,
  zoomLevel,
  stagePosition,
  width,
  height,
}) => {
  const isHorizontal = orientation === 'horizontal';

  const elements = useMemo(() => {
    const rulerElements: React.ReactNode[] = [];
    const baseGridSize = 1000;
    const intermediateSteps = zoomLevel > 10 ? 100 : 10;
    const intermediateStepSize = baseGridSize / intermediateSteps;

    const visibleMin = isHorizontal
      ? -stagePosition.x / zoomLevel
      : -stagePosition.y / zoomLevel;
    const visibleMax = isHorizontal
      ? (width - stagePosition.x) / zoomLevel
      : (height - stagePosition.y) / zoomLevel;

    const createTick = (v: number, color: string, label?: string) => {
      const position = isHorizontal
        ? v * zoomLevel + stagePosition.x
        : v * zoomLevel + stagePosition.y;

      const finalPosition = Math.round(position) + 1;

      let isVisible = false;
      if (isHorizontal) {
        if (finalPosition >= 0 && finalPosition <= width) isVisible = true;
      } else if (finalPosition >= 0 && finalPosition <= height)
        isVisible = true;

      if (isVisible) {
        const tickLength = 15;
        rulerElements.push(
          <Line
            key={`tick-${v}-${orientation}`}
            points={
              isHorizontal
                ? [finalPosition, height - tickLength, finalPosition, height]
                : [width - tickLength, finalPosition, width, finalPosition]
            }
            stroke={color}
            strokeWidth={1}
          />,
        );
        if (label) {
          rulerElements.push(
            <Text
              key={`label-${v}-${orientation}`}
              x={isHorizontal ? finalPosition + 4 : 5}
              y={isHorizontal ? height - tickLength - 2 : finalPosition + 4}
              text={label}
              fontSize={10}
              fill={rulerColors.text}
              verticalAlign={isHorizontal ? 'bottom' : 'top'}
            />,
          );
        }
      }
    };

    // Main Ticks
    const startValue =
      Math.floor(visibleMin / intermediateStepSize) * intermediateStepSize;
    const endValue =
      Math.ceil(visibleMax / intermediateStepSize) * intermediateStepSize;

    for (let v = startValue; v <= endValue; v += intermediateStepSize) {
      const isMainTick = v % baseGridSize === 0;
      const tickColor = isMainTick
        ? rulerColors.mainTick
        : rulerColors.secondaryTick;
      let label;
      if (zoomLevel < 512 || v === 0) {
        label = `${Math.round(v)}`;
      }
      createTick(v, tickColor, label);
    }

    // Sub-lines Ticks
    if (zoomLevel === 8) {
      const subStep = intermediateStepSize / 10;
      const subStart = Math.floor(visibleMin / subStep) * subStep;
      const subEnd = Math.ceil(visibleMax / subStep) * subStep;

      for (let subV = subStart; subV <= subEnd; subV += subStep) {
        if (subV % intermediateStepSize !== 0) {
          const label = `${Math.round(subV)}`;
          createTick(subV, rulerColors.subTick, label);
        }
      }
    } else if (zoomLevel > 8) {
      const subStep = intermediateStepSize / 10;
      const subStart = Math.floor(visibleMin / subStep) * subStep;
      const subEnd = Math.ceil(visibleMax / subStep) * subStep;

      for (let subV = subStart; subV <= subEnd; subV += subStep) {
        if (subV % intermediateStepSize !== 0) {
          let label;
          if (zoomLevel >= 256 && zoomLevel < 2048) {
            label = subV.toFixed(1);
          }
          createTick(subV, rulerColors.subTick, label);
        }
      }
    }
    // Sub-sub-lines Ticks
    if (zoomLevel >= 512) {
      const subSubStep = intermediateStepSize / 100;
      const subSubStart = Math.floor(visibleMin / subSubStep) * subSubStep;
      const subSubEnd = Math.ceil(visibleMax / subSubStep) * subSubStep;

      for (
        let subSubV = subSubStart;
        subSubV <= subSubEnd;
        subSubV += subSubStep
      ) {
        if (subSubV % (intermediateStepSize / 10) !== 0) {
          createTick(subSubV, rulerColors.subSubTick);
        }
      }
    }

    // Micro-lines Ticks
    if (zoomLevel >= 2048) {
      const microStep = intermediateStepSize / 1000;
      const microStart = Math.floor(visibleMin / microStep) * microStep;
      const microEnd = Math.ceil(visibleMax / microStep) * microStep;

      for (let microV = microStart; microV <= microEnd; microV += microStep) {
        if (microV % (intermediateStepSize / 100) !== 0) {
          const isHighlighted = Math.round(microV * 100) % 10 === 0;
          let label;
          if (isHighlighted) {
            label = microV.toFixed(2);
          }
          createTick(microV, rulerColors.microTick, label);
        }
      }
    }

    return rulerElements;
  }, [
    zoomLevel,
    isHorizontal,
    stagePosition.x,
    stagePosition.y,
    width,
    height,
    orientation,
  ]);

  return (
    <Stage
      width={width}
      height={height}
      style={{ background: rulerColors.background }}
    >
      <Layer>{elements}</Layer>
    </Stage>
  );
};

export default Ruler;
