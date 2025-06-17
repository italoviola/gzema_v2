import React, { useState, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Circle, Path } from 'react-konva';

import CartesianGrid from 'components/CartesianGrid';
// import CartesianPlane from 'components/CartesianPlane';

import { colors } from 'styles/global.styles';
import { Container } from './styles';

const Chart: React.FC = () => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });
  const [strokeWidth, setStrokeWidth] = useState(1);

  useEffect(() => {
    if (zoomLevel > 1024) setStrokeWidth(0.02);
    else if (zoomLevel >= 512) setStrokeWidth(0.005);
    else if (zoomLevel >= 256) setStrokeWidth(0.02);
    else if (zoomLevel >= 128) setStrokeWidth(0.02);
    else if (zoomLevel >= 16) setStrokeWidth(0.05);
    else if (zoomLevel >= 8) setStrokeWidth(0.1);
    else if (zoomLevel >= 4) setStrokeWidth(0.3);
    else if (zoomLevel >= 2) setStrokeWidth(0.3);
    else setStrokeWidth(0.5);
  }, [zoomLevel]);

  const getFontSize = React.useCallback(() => {
    if (zoomLevel >= 512) return 0.1;
    if (zoomLevel >= 256) return 0.3;
    if (zoomLevel >= 128) return 0.5;
    if (zoomLevel >= 16) return 0.7;
    if (zoomLevel >= 8) return 2;
    if (zoomLevel >= 4) return 8;
    if (zoomLevel >= 2) return 8;
    return 14;
  }, [zoomLevel]);

  const handleDragMove = (e: any) => {
    const stage = e.target;
    const newX = stage.x();
    const newY = stage.y();

    // Defina os limites do plano cartesiano com base nas linhas desenhadas
    const minX = -1500 * zoomLevel + 1100; // Limite mínimo no eixo X
    const maxX = 1500 * zoomLevel - 300; // Limite máximo no eixo X
    const minY = -1500 * zoomLevel + 800; // Limite mínimo no eixo Y
    const maxY = 1500 * zoomLevel - 300; // Limite máximo no eixo Y

    // Verifique se a nova posição está dentro dos limites
    if (newX < minX) {
      stage.x(minX);
    } else if (newX > maxX) {
      stage.x(maxX);
    }

    if (newY < minY) {
      stage.y(minY);
    } else if (newY > maxY) {
      stage.y(maxY);
    }

    setStagePosition({
      x: stage.x(),
      y: stage.y(),
    });
  };

  // Defina as figuras geométricas e pontos
  const shapes = [
    {
      type: 'polygon',
      points: [0, 0, 50, 50, 50, -50],
      fill: colors.silver,
      opacity: 0.9,
      id: 'polygon1',
    },
    {
      type: 'rect',
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      fill: colors.silver,
      opacity: 0.9,
      id: 'rect1',
    },
    // {
    //   type: 'rect',
    //   x: -200,
    //   y: -50,
    //   width: 100,
    //   height: 800,
    //   fill: colors.silver,
    //  opacity: 0.9,
    //   id: 'rect1',
    // },
    {
      type: 'rect',
      x: 150,
      y: 35,
      width: 150,
      height: 70,
      fill: colors.silver,
      opacity: 0.9,
      id: 'rect2',
    },
    {
      type: 'rect',
      x: 300,
      y: 50,
      width: 100,
      height: 100,
      fill: colors.silver,
      opacity: 0.9,
      id: 'rect3',
    },
    {
      type: 'polygon',
      points: [400, 50, 440, 30, 440, -30, 400, -50],
      fill: colors.silver,
      opacity: 0.9,
      id: 'polygon2',
    },
    {
      type: 'concaveRoundedRect',
      x: 440,
      y: -30,
      width: 10,
      height: 60,
      fill: colors.silver,
      opacity: 0.9,
      cornerRadius: [0, 10, 10, 0], // Define o raio dos cantos
      id: 'concaveRoundedRect1',
    },
    {
      type: 'polygon',
      points: [450, 20, 450, -20, 500, 0],
      fill: colors.silver,
      opacity: 0.9,
      id: 'polygon3',
    },
  ];

  const points = [
    { x: 100, y: 100, radius: 4, fill: colors.orangeDark, id: 'point1' },
    { x: 150, y: 150, radius: 4, fill: colors.orangeDark, id: 'point2' },
    { x: 200, y: 200, radius: 4, fill: colors.orangeDark, id: 'point3' },
  ];

  const handleShapeClick = (id: string) => {
    setSelectedShape(id);
  };

  const ZOOM_FACTOR = 2; // Fator de zoom exponencial

  return (
    <Container>
      {/* <CartesianPlane /> */}
      <div>
        <button
          type="button"
          onClick={() => setZoomLevel((prev) => prev * ZOOM_FACTOR)}
        >
          Zoom In
        </button>
        <button
          type="button"
          onClick={() =>
            setZoomLevel((prev) => Math.max(1, prev / ZOOM_FACTOR))
          }
        >
          Zoom Out
        </button>
        <div>Zoom Level: {zoomLevel}</div>
      </div>
      <Stage
        width={870}
        height={450}
        draggable
        scaleX={zoomLevel}
        scaleY={zoomLevel}
        x={stagePosition.x}
        y={stagePosition.y}
        offsetX={0}
        offsetY={0}
        onDragMove={handleDragMove}
        style={{ border: '1px solid black' }}
      >
        <Layer>
          <CartesianGrid
            zoomLevel={zoomLevel}
            stagePosition={stagePosition}
            stageWidth={870}
            stageHeight={450}
            strokeWidth={strokeWidth}
            getFontSize={getFontSize}
          />
        </Layer>
        <Layer>
          {shapes.map((shape) => {
            if (shape.type === 'rect') {
              return (
                <Rect
                  key={shape.id}
                  x={shape.x}
                  y={-(shape.y ?? 0)}
                  width={shape.width}
                  height={shape.height}
                  fill={shape.fill}
                  stroke={selectedShape === shape.id ? 'blue' : colors.greyFont}
                  strokeWidth={
                    selectedShape === shape.id ? strokeWidth * 2 : strokeWidth
                  }
                  opacity={shape.opacity}
                  onClick={() => handleShapeClick(shape.id)}
                />
              );
            }
            if (shape.type === 'polygon') {
              return (
                <Line
                  key={shape.id}
                  points={shape.points?.map((point, i) =>
                    i % 2 === 0 ? point : -point,
                  )}
                  fill={shape.fill}
                  stroke={selectedShape === shape.id ? 'blue' : colors.greyFont}
                  strokeWidth={
                    selectedShape === shape.id ? strokeWidth * 2 : strokeWidth
                  }
                  closed
                  opacity={shape.opacity}
                  onClick={() => handleShapeClick(shape.id)}
                />
              );
            }
            if (shape.type === 'concaveRoundedRect') {
              const {
                x = 0,
                y = 0,
                width = 0,
                height = 0,
                fill,
                cornerRadius = [0, 0, 0, 0],
              } = shape;
              const [tl, tr, br, bl] = cornerRadius ?? [0, 0, 0, 0];

              const pathData = `
                M ${x + tl}, ${y}
                L ${x + width - tr}, ${y}
                Q ${x + width - tr}, ${y + tr} ${x + width}, ${y + tr}
                L ${x + width}, ${y + height - br}
                Q ${x + width - br}, ${y + height - br} ${x + width - br}, ${
                  y + height
                }
                L ${x + bl}, ${y + height}
                Q ${x + bl}, ${y + height - bl} ${x}, ${y + height - bl}
                L ${x}, ${y + tl}
                Q ${x + tl}, ${y + tl} ${x + tl}, ${y}
                Z
              `;

              return (
                <Path
                  key={shape.id}
                  data={pathData}
                  fill={fill}
                  stroke={selectedShape === shape.id ? 'blue' : colors.greyFont}
                  strokeWidth={
                    selectedShape === shape.id ? strokeWidth * 2 : strokeWidth
                  }
                  opacity={shape.opacity}
                  onClick={() => handleShapeClick(shape.id)}
                />
              );
            }
            return null;
          })}
          {points.map((point) => (
            <Circle
              key={point.id}
              x={point.x}
              y={-point.y}
              radius={point.radius}
              fill={point.fill}
              stroke={selectedShape === point.id ? 'blue' : colors.greyFont}
              strokeWidth={
                selectedShape === point.id ? strokeWidth * 2 : strokeWidth
              }
              onClick={() => handleShapeClick(point.id)}
            />
          ))}
        </Layer>
      </Stage>
    </Container>
  );
};

export default Chart;
