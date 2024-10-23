import React, { useState } from 'react';
import { Stage, Layer, Line, Text, Rect, Circle, Path } from 'react-konva';
import { colors } from 'styles/global.styles';

const Chart2: React.FC = () => {
  // Defina as figuras geométricas e pontos
  const shapes = [
    {
      type: 'polygon',
      points: [0, 0, 50, 50, 50, -50],
      fill: colors.silver,
    },
    {
      type: 'rect',
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      fill: colors.silver,
    },
    {
      type: 'rect',
      x: 150,
      y: 35,
      width: 150,
      height: 70,
      fill: colors.silver,
    },
    {
      type: 'rect',
      x: 300,
      y: 50,
      width: 100,
      height: 100,
      fill: colors.silver,
    },
    {
      type: 'polygon',
      points: [400, 50, 400, -50, 450, 0],
      fill: colors.silver,
    },
    {
      type: 'roundedRect',
      x: 500,
      y: 50,
      width: 100,
      height: 100,
      fill: colors.silver,
      cornerRadius: [0, 20, 20, 0], // Define o raio dos cantos direitos
    },
    {
      type: 'concaveRoundedRect',
      x: 650,
      y: 50,
      width: 100,
      height: 100,
      fill: colors.silver,
      cornerRadius: [10, 20, 30, 40], // Define o raio dos cantos
    },
  ];

  const points = [
    { x: 100, y: 100, radius: 5, fill: colors.orangeDark },
    { x: 150, y: 150, radius: 5, fill: colors.orangeDark },
    { x: 200, y: 200, radius: 5, fill: colors.orangeDark },
  ];

  // Calcule as dimensões máximas necessárias
  let maxX = 0;
  let maxY = 0;
  shapes.forEach((shape) => {
    if (
      shape.type === 'rect' &&
      shape.x !== undefined &&
      shape.width !== undefined
    ) {
      maxX = Math.max(maxX, shape.x + shape.width);
      maxY = Math.max(maxY, shape.y + shape.height);
    } else if (
      shape.type === 'circle' &&
      shape.x !== undefined &&
      shape.radius !== undefined
    ) {
      maxX = Math.max(maxX, shape.x + shape.radius);
      maxY = Math.max(maxY, shape.y + shape.radius);
    } else if (shape.type === 'polygon' && shape.points !== undefined) {
      for (let i = 0; i < shape.points.length; i += 2) {
        maxX = Math.max(maxX, shape.points[i]);
        maxY = Math.max(maxY, shape.points[i + 1]);
      }
    } else if (
      shape.type === 'roundedRect' &&
      shape.x !== undefined &&
      shape.width !== undefined
    ) {
      maxX = Math.max(maxX, shape.x + shape.width);
      maxY = Math.max(maxY, shape.y + shape.height);
    } else if (
      shape.type === 'concaveRoundedRect' &&
      shape.x !== undefined &&
      shape.width !== undefined
    ) {
      maxX = Math.max(maxX, shape.x + shape.width);
      maxY = Math.max(maxY, shape.y + shape.height);
    }
  });

  points.forEach((point) => {
    maxX = Math.max(maxX, point.x);
    maxY = Math.max(maxY, point.y);
  });

  const stageWidth = 800;
  const stageHeight = 600;
  const gridSize = 50;

  const [scale, setScale] = useState(1);

  // Função para desenhar as linhas do grid e os rótulos dos eixos
  const drawGrid = () => {
    const lines = [];
    for (
      let i = -Math.ceil(maxX / gridSize);
      i <= Math.ceil(maxX / gridSize);
      i++
    ) {
      lines.push(
        <Line
          key={`v-${i}`}
          points={[i * gridSize, -maxY, i * gridSize, maxY]}
          stroke="#ddd"
          strokeWidth={1}
        />,
      );
      lines.push(
        <Text
          key={`v-label-${i}`}
          x={i * gridSize}
          y={5}
          text={`${i * gridSize}`}
          fontSize={12}
          fill="black"
        />,
      );
    }
    for (
      let i = -Math.ceil(maxY / gridSize);
      i <= Math.ceil(maxY / gridSize);
      i++
    ) {
      lines.push(
        <Line
          key={`h-${i}`}
          points={[-maxX, i * gridSize, maxX, i * gridSize]}
          stroke="#ddd"
          strokeWidth={1}
        />,
      );
      lines.push(
        <Text
          key={`h-label-${i}`}
          x={5}
          y={-i * gridSize} // Inverte a coordenada Y para os rótulos
          text={`${i * gridSize}`}
          fontSize={12}
          fill="black"
        />,
      );
    }
    return lines;
  };

  const handleZoomIn = () => {
    setScale(scale * 1.2);
  };

  const handleZoomOut = () => {
    setScale(scale / 1.2);
  };

  return (
    <div>
      <div>
        <button onClick={handleZoomIn}>Zoom In</button>
        <button onClick={handleZoomOut}>Zoom Out</button>
      </div>
      <Stage
        width={stageWidth}
        height={stageHeight}
        draggable
        scaleX={scale}
        scaleY={scale}
        x={stageWidth / 2}
        y={stageHeight / 2}
        offsetX={stageWidth / 2}
        offsetY={stageHeight / 2}
        style={{ border: '1px solid black' }}
      >
        <Layer>
          {/* Desenha o grid do plano cartesiano */}
          {drawGrid()}
          {/* Desenha as figuras geométricas */}
          {shapes.map((shape, index) => {
            if (shape.type === 'rect') {
              return (
                <Rect
                  key={index}
                  x={shape.x}
                  y={-shape.y} // Inverte a coordenada Y
                  width={shape.width}
                  height={shape.height}
                  fill={shape.fill}
                  stroke={colors.greyFont}
                  strokeWidth={2}
                />
              );
            }
            if (shape.type === 'circle') {
              return (
                <Circle
                  key={index}
                  x={shape.x}
                  y={-shape.y} // Inverte a coordenada Y
                  radius={shape.radius}
                  fill={shape.fill}
                  stroke={colors.greyFont}
                  strokeWidth={2}
                />
              );
            }
            if (shape.type === 'polygon') {
              const invertedPoints = shape.points.map(
                (point, i) => (i % 2 === 0 ? point : -point), // Inverte a coordenada Y
              );
              return (
                <Line
                  key={index}
                  points={invertedPoints}
                  fill={shape.fill}
                  stroke={colors.greyFont}
                  strokeWidth={2}
                  closed
                />
              );
            }
            if (shape.type === 'roundedRect') {
              return (
                <Rect
                  key={index}
                  x={shape.x}
                  y={-shape.y} // Inverte a coordenada Y
                  width={shape.width}
                  height={shape.height}
                  fill={shape.fill}
                  stroke={colors.greyFont}
                  strokeWidth={2}
                  cornerRadius={shape.cornerRadius}
                />
              );
            }
            if (shape.type === 'concaveRoundedRect') {
              const { x, y, width, height, fill, cornerRadius } = shape;
              const [tl, tr, br, bl] = cornerRadius;

              if (
                x === undefined ||
                y === undefined ||
                width === undefined ||
                height === undefined ||
                cornerRadius === undefined
              ) {
                return null;
              }

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
                  key={index}
                  data={pathData}
                  fill={fill}
                  stroke={colors.greyFont}
                  strokeWidth={2}
                />
              );
            }
          })}
          {/* Desenha os pontos */}
          {points.map((point, index) => (
            <Circle
              key={index}
              x={point.x}
              y={-point.y} // Inverte a coordenada Y
              radius={point.radius}
              fill={point.fill}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default Chart2;
