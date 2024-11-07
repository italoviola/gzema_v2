import React, { useState } from 'react';
import { Stage, Layer, Line, Text, Rect, Circle, Path } from 'react-konva';
import { colors } from 'styles/global.styles';

const Chart2: React.FC = () => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });

  const handleDragMove = (e: any) => {
    const stage = e.target;
    const newX = stage.x();
    const newY = stage.y();

    // Defina os limites do plano cartesiano com base nas linhas desenhadas
    const minX = -800 * zoomLevel + 1100; // Limite mínimo no eixo X
    const maxX = 800 * zoomLevel - 300; // Limite máximo no eixo X
    const minY = -600 * zoomLevel + 800; // Limite mínimo no eixo Y
    const maxY = 600 * zoomLevel - 300; // Limite máximo no eixo Y

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
      opacity: 0.7,
      id: 'polygon1',
    },
    {
      type: 'rect',
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      fill: colors.silver,
      opacity: 0.7,
      id: 'rect1',
    },
    // {
    //   type: 'rect',
    //   x: -200,
    //   y: -50,
    //   width: 100,
    //   height: 800,
    //   fill: colors.silver,
    // opacity: 0.7,
    //   id: 'rect1',
    // },
    {
      type: 'rect',
      x: 150,
      y: 35,
      width: 150,
      height: 70,
      fill: colors.silver,
      opacity: 0.7,
      id: 'rect2',
    },
    {
      type: 'rect',
      x: 300,
      y: 50,
      width: 100,
      height: 100,
      fill: colors.silver,
      opacity: 0.7,
      id: 'rect3',
    },
    {
      type: 'polygon',
      points: [400, 50, 440, 30, 440, -30, 400, -50],
      fill: colors.silver,
      opacity: 0.7,
      id: 'polygon2',
    },
    {
      type: 'concaveRoundedRect',
      x: 440,
      y: -30,
      width: 10,
      height: 60,
      fill: colors.silver,
      opacity: 0.7,
      cornerRadius: [0, 10, 10, 0], // Define o raio dos cantos
      id: 'concaveRoundedRect1',
    },
    {
      type: 'polygon',
      points: [450, 20, 450, -20, 500, 0],
      fill: colors.silver,
      opacity: 0.7,
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

  // Calcule as dimensões máximas necessárias
  let maxX = 300;
  let maxY = 300;
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
    }
  });

  const drawGrid = () => {
    const lines = [];
    const adjustedGridSize = 100; // Tamanho da grade base
    const intermediateSteps = 10; // Dividimos os valores principais em dez passos
    const intermediateStepSize = adjustedGridSize / intermediateSteps;

    const maxX = 800; // Limite máximo no eixo X
    const maxY = 600; // Limite máximo no eixo Y

    for (
      let i = -Math.ceil(maxX / adjustedGridSize);
      i <= Math.ceil(maxX / adjustedGridSize);
      i++
    ) {
      lines.push(
        <Line
          key={`v-${i}`}
          points={[i * adjustedGridSize, -maxY, i * adjustedGridSize, maxY]}
          stroke="#ddd"
          strokeWidth={1}
        />,
      );
      lines.push(
        <Text
          key={`v-label-${i}`}
          x={i * adjustedGridSize + 5}
          y={-5}
          text={`${i * adjustedGridSize}`}
          fontSize={8}
          fill="black"
        />,
      );

      // Adiciona linhas intermediárias
      for (let j = 1; j < intermediateSteps; j++) {
        const intermediateX = i * adjustedGridSize + j * intermediateStepSize;
        if (intermediateX < maxX) {
          lines.push(
            <Line
              key={`v-intermediate-${i}-${j}`}
              points={[intermediateX, -maxY, intermediateX, maxY]}
              stroke="#eee"
              strokeWidth={0.5}
            />,
          );
          lines.push(
            <Text
              key={`v-intermediate-label-${i}-${j}`}
              x={intermediateX + 2}
              y={2}
              text={`${Math.round(intermediateX)}`}
              fontSize={4}
              fill="gray"
            />,
          );
        }
      }
    }

    for (
      let i = -Math.ceil(maxY / adjustedGridSize);
      i <= Math.ceil(maxY / adjustedGridSize);
      i++
    ) {
      lines.push(
        <Line
          key={`h-${i}`}
          points={[-maxX, i * adjustedGridSize, maxX, i * adjustedGridSize]}
          stroke="#ddd"
          strokeWidth={1}
        />,
      );
      lines.push(
        <Text
          key={`h-label-${i}`}
          x={5}
          y={-i * adjustedGridSize}
          text={`${i * adjustedGridSize}`}
          fontSize={8}
          fill="black"
        />,
      );

      // Adiciona linhas intermediárias
      for (let j = 1; j < intermediateSteps; j++) {
        const intermediateY = i * adjustedGridSize + j * intermediateStepSize;
        if (intermediateY < maxY) {
          lines.push(
            <Line
              key={`h-intermediate-${i}-${j}`}
              points={[-maxX, intermediateY, maxX, intermediateY]}
              stroke="#eee"
              strokeWidth={0.5}
            />,
          );
          lines.push(
            <Text
              key={`h-intermediate-label-${i}-${j}`}
              x={5}
              y={-intermediateY}
              text={`${Math.round(intermediateY)}`}
              fontSize={4}
              fill="gray"
            />,
          );
        }
      }
    }
    return lines;
  };

  return (
    <div>
      <div>
        <button onClick={() => setZoomLevel(zoomLevel + 1)}>Zoom In</button>
        <button onClick={() => setZoomLevel(Math.max(1, zoomLevel - 1))}>
          Zoom Out
        </button>
      </div>
      <Stage
        width={902}
        height={496}
        draggable
        scaleX={zoomLevel}
        scaleY={zoomLevel}
        x={stagePosition.x}
        y={stagePosition.y}
        offsetX={cursorPosition.x}
        offsetY={cursorPosition.y}
        onDragMove={handleDragMove}
        style={{ border: '1px solid black' }}
      >
        <Layer>
          {drawGrid()}
          {shapes.map((shape) => {
            if (shape.type === 'rect') {
              return (
                <Rect
                  key={shape.id}
                  x={shape.x}
                  y={-shape.y}
                  width={shape.width}
                  height={shape.height}
                  fill={shape.fill}
                  stroke={selectedShape === shape.id ? 'blue' : colors.greyFont}
                  strokeWidth={selectedShape === shape.id ? 2 : 1}
                  opacity={shape.opacity} // Define a opacidade
                  onClick={() => handleShapeClick(shape.id)}
                />
              );
            }
            if (shape.type === 'polygon') {
              return (
                <Line
                  key={shape.id}
                  points={shape.points.map((point, i) =>
                    i % 2 === 0 ? point : -point,
                  )}
                  fill={shape.fill}
                  stroke={selectedShape === shape.id ? 'blue' : colors.greyFont}
                  strokeWidth={selectedShape === shape.id ? 2 : 1}
                  closed
                  opacity={shape.opacity} // Define a opacidade
                  onClick={() => handleShapeClick(shape.id)}
                />
              );
            }
            if (shape.type === 'concaveRoundedRect') {
              const { x, y, width, height, fill, cornerRadius } = shape;
              const [tl, tr, br, bl] = cornerRadius;

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
                  strokeWidth={selectedShape === shape.id ? 2 : 1}
                  opacity={shape.opacity} // Define a opacidade
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
              strokeWidth={selectedShape === point.id ? 2 : 1}
              opacity={point.opacity} // Define a opacidade
              onClick={() => handleShapeClick(point.id)}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default Chart2;
