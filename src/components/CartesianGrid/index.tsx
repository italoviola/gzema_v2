import React, { useState, useEffect } from 'react';
import { Line, Text } from 'react-konva';
import { Container } from './styles';

interface CartesianGridProps {
  zoomLevel: number;
}

const CartesianGrid: React.FC<CartesianGridProps> = ({ zoomLevel }) => {
  const [strokeWidth, setStrokeWidth] = useState(1);

  useEffect(() => {
    if (zoomLevel > 10) {
      setStrokeWidth(0.1);
    } else {
      setStrokeWidth(0.5);
    }
  }, [zoomLevel]);

  const lines = [];
  const baseGridSize = 1000; // Tamanho da grade base
  const intermediateSteps = 100;
  const intermediateStepSize = baseGridSize / intermediateSteps;

  const maxX = 1500; // Limite máximo no eixo X
  const maxY = 1500; // Limite máximo no eixo Y

  for (
    let i = -Math.ceil(maxX / baseGridSize);
    i <= Math.ceil(maxX / baseGridSize);
    i += 1
  ) {
    lines.push(
      <Line
        key={`v-${i}`}
        points={[i * baseGridSize, -maxY, i * baseGridSize, maxY]}
        stroke="#ddd"
        strokeWidth={strokeWidth}
      />,
    );
    lines.push(
      <Text
        key={`v-label-${i}`}
        x={i * baseGridSize + 5}
        y={-5}
        text={`${i * baseGridSize}`}
        fontSize={8}
        fill="black"
      />,
    );

    // Adiciona linhas intermediárias
    for (let j = 1; j <= intermediateSteps; j += 1) {
      const intermediateX = i * baseGridSize + j * intermediateStepSize;
      lines.push(
        <Line
          key={`v-intermediate-${i}-${j}`}
          points={[intermediateX, -maxY, intermediateX, maxY]}
          stroke={zoomLevel > 10 ? '#ccc' : '#eee'}
          strokeWidth={strokeWidth}
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

      // Adiciona sublinhas intermediárias se o zoomLevel for maior que 10
      if (zoomLevel > 10) {
        const subIntermediateStepSize = intermediateStepSize / 10;
        for (let k = 1; k < 10; k += 1) {
          const subIntermediateX = intermediateX + k * subIntermediateStepSize;
          lines.push(
            <Line
              key={`v-sub-intermediate-${i}-${j}-${k}`}
              points={[subIntermediateX, -maxY, subIntermediateX, maxY]}
              stroke="#f0f0f0"
              strokeWidth={strokeWidth}
            />,
          );
        }
      }
    }
  }

  for (
    let i = -Math.ceil(maxY / baseGridSize);
    i <= Math.ceil(maxY / baseGridSize);
    i += 1
  ) {
    lines.push(
      <Line
        key={`h-${i}`}
        points={[-maxX, i * baseGridSize, maxX, i * baseGridSize]}
        stroke="#ddd"
        strokeWidth={strokeWidth}
      />,
    );
    lines.push(
      <Text
        key={`h-label-${i}`}
        x={5}
        y={-i * baseGridSize}
        text={`${i * baseGridSize}`}
        fontSize={8}
        fill="black"
      />,
    );

    // Adiciona linhas intermediárias
    for (let j = 1; j <= intermediateSteps; j += 1) {
      const intermediateY = i * baseGridSize + j * intermediateStepSize;
      lines.push(
        <Line
          key={`h-intermediate-${i}-${j}`}
          points={[-maxX, intermediateY, maxX, intermediateY]}
          stroke={zoomLevel > 10 ? '#ccc' : '#eee'}
          strokeWidth={strokeWidth}
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

      // Adiciona sublinhas intermediárias se o zoomLevel for maior que 10
      if (zoomLevel > 10) {
        const subIntermediateStepSize = intermediateStepSize / 10;
        for (let k = 1; k < 10; k += 1) {
          const subIntermediateY = intermediateY + k * subIntermediateStepSize;
          lines.push(
            <Line
              key={`h-sub-intermediate-${i}-${j}-${k}`}
              points={[-maxX, subIntermediateY, maxX, subIntermediateY]}
              stroke="#f0f0f0"
              strokeWidth={strokeWidth}
            />,
          );
        }
      }
    }
  }

  return <Container>{lines}</Container>;
};

export default CartesianGrid;
