import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';

import { generateGrid } from './generateGrid';
import { Container } from './styles';

// Defina as constantes de cor no topo do arquivo
interface CartesianGridProps {
  zoomLevel: number;
  stagePosition: { x: number; y: number };
  stageWidth?: number;
  stageHeight?: number;
}

const CartesianGrid: React.FC<CartesianGridProps> = React.memo(
  ({ zoomLevel, stagePosition, stageWidth = 870, stageHeight = 450 }) => {
    const baseGridSize = 1000;
    const intermediateSteps = zoomLevel > 10 ? 100 : 10;
    const intermediateStepSize = baseGridSize / intermediateSteps;

    const [strokeWidth, setStrokeWidth] = useState(1);

    useEffect(() => {
      setStrokeWidth(zoomLevel > 10 ? 0.1 : 0.5);
    }, [zoomLevel]);

    const getFontSize = React.useCallback(
      () => Math.max(strokeWidth, 0.5),
      [strokeWidth],
    );

    const lines = useMemo(() => {
      // Calcula os limites visíveis no Stage
      const left = -stagePosition.x / zoomLevel;
      const right = (stageWidth - stagePosition.x) / zoomLevel;
      const top = -stagePosition.y / zoomLevel;
      const bottom = (stageHeight - stagePosition.y) / zoomLevel;

      const minX =
        Math.floor(left / intermediateStepSize) * intermediateStepSize;
      const maxX =
        Math.ceil(right / intermediateStepSize) * intermediateStepSize;
      const minY =
        Math.floor(top / intermediateStepSize) * intermediateStepSize;
      const maxY =
        Math.ceil(bottom / intermediateStepSize) * intermediateStepSize;

      return [
        ...generateGrid({
          isVertical: true,
          min: minX,
          max: maxX,
          fixed1: top,
          fixed2: bottom,
          mainKey: 'v',
          labelKey: 'v-label',
          subKey: 'v-sub',
          intermediateStepSize,
          baseGridSize,
          zoomLevel,
          strokeWidth,
          getFontSize,
        }),
        ...generateGrid({
          isVertical: false,
          min: minY,
          max: maxY,
          fixed1: left,
          fixed2: right,
          mainKey: 'h',
          labelKey: 'h-label',
          subKey: 'h-sub',
          intermediateStepSize,
          baseGridSize,
          zoomLevel,
          strokeWidth,
          getFontSize,
        }),
      ];
    }, [
      stagePosition.x,
      stagePosition.y,
      zoomLevel,
      stageWidth,
      stageHeight,
      intermediateStepSize,
      strokeWidth,
      baseGridSize,
      getFontSize,
    ]);

    return <Container>{lines}</Container>;
  },
);

CartesianGrid.propTypes = {
  zoomLevel: PropTypes.number.isRequired,
  stagePosition: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,
  stageWidth: PropTypes.number,
  stageHeight: PropTypes.number,
};

CartesianGrid.defaultProps = {
  stageWidth: 870,
  stageHeight: 450,
};

export default CartesianGrid;
