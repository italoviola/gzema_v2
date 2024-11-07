import React from 'react';

import { Line, Text } from 'react-konva';
import { Container } from './styles';

const CartesianGtrid: React.FC = () => {
  const lines = [];
  const baseGridSize = 1000;
  const intermediateSteps = 100;
  const intermediateStepSize = baseGridSize / intermediateSteps;

  const maxX = 800; // Limite máximo no eixo X
  const maxY = 600; // Limite máximo no eixo Y

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
        strokeWidth={1}
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
    for (let j = 1; j < intermediateSteps; j += 1) {
      const intermediateX = i * baseGridSize + j * intermediateStepSize;
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
    let i = -Math.ceil(maxY / baseGridSize);
    i <= Math.ceil(maxY / baseGridSize);
    i += 1
  ) {
    lines.push(
      <Line
        key={`h-${i}`}
        points={[-maxX, i * baseGridSize, maxX, i * baseGridSize]}
        stroke="#ddd"
        strokeWidth={1}
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
    for (let j = 1; j < intermediateSteps; j += 1) {
      const intermediateY = i * baseGridSize + j * intermediateStepSize;
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
  return <Container>{lines}</Container>;
};

export default CartesianGtrid;
