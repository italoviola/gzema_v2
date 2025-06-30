import React from 'react';
import { Group, Rect, Text } from 'react-konva';

import { getTextOffset, measureTextWidth } from './utils';

/**
 * Cria um par de componentes Rect e Text para exibir um rótulo no grid.
 * Abstrai a lógica de criação de texto com fundo branco para reutilização.
 */
export function createGridText(
  key: string,
  value: number,
  text: string,
  isHorizontal: boolean,
  fontSize: number, // Tamanho da fonte desejado (pode ser < 0.01)
  fill: string,
  zoomLevel: number,
  isMicroText?: boolean, // Flag para lidar com o caso dos micro-textos
): React.ReactNode {
  const modifiedText = !isHorizontal ? String(Number(text) * -1) : text;

  const MIN_RENDERABLE_FONT_SIZE = 0.01;
  let scaleFactor = 1;
  let renderFontSize = fontSize;

  // Se o tamanho desejado for menor que o mínimo, calcula a escala
  if (fontSize < MIN_RENDERABLE_FONT_SIZE) {
    scaleFactor = fontSize / MIN_RENDERABLE_FONT_SIZE;
    renderFontSize = MIN_RENDERABLE_FONT_SIZE;
  }

  // Divide o scaleFactor por 2 quando o zoom for muito alto
  if (zoomLevel >= 2048) {
    scaleFactor /= 1.5;
  }

  const textWidth = measureTextWidth(
    modifiedText,
    renderFontSize,
    'monospace',
    'bold',
  );

  const textHeight = renderFontSize;
  // Chama getTextOffset com os novos parâmetros
  const { offsetX, offsetY } = getTextOffset(textWidth, textHeight);

  // --- Valores Padrão ---
  const xPos = isHorizontal ? value : 0;
  let yPos = isHorizontal ? 0 : value;
  const rectX = xPos - offsetX;
  let rectY = yPos - offsetY;
  const rectWidth = textWidth;
  const rectHeight = textHeight;

  let rectOffsetX = 0;
  let rectOffsetY = 0;

  const rectBaseY = isHorizontal ? 0 : value;
  rectY = rectBaseY - offsetY;

  // --- Sobrescreve os valores se for um micro-texto ---
  if (isMicroText) {
    const isZero = value === 0;

    // Lógica de posicionamento Y específica para o texto
    if (isZero) {
      yPos = 0 - offsetY * (zoomLevel >= 2048 ? 2 : 4);
      rectOffsetX = offsetX * -0.5;
      rectOffsetY = offsetY * -0.5;
    } else if (isHorizontal) {
      yPos = 0 - offsetY * (zoomLevel >= 2048 ? 2 : 4);
    } else {
      if (zoomLevel >= 2048) {
        rectOffsetX = offsetX * -0.5;
        rectOffsetY = offsetY * -0.5;
      }
      yPos = value - offsetY * (zoomLevel >= 2048 ? 2 : 4);
    }
  }

  return (
    <Group key={`group-${key}`}>
      <Rect
        key={`bg-${key}`}
        x={rectX}
        y={rectY}
        width={rectWidth}
        height={rectHeight}
        fill="white"
        scaleX={scaleFactor}
        scaleY={scaleFactor}
        offsetX={rectOffsetX}
        offsetY={rectOffsetY}
      />
      <Text
        key={key}
        x={xPos}
        y={yPos}
        text={modifiedText}
        fontSize={renderFontSize}
        fill={fill}
        offsetX={offsetX}
        offsetY={offsetY}
        fontFamily="monospace"
        fontStyle="bold"
        scaleX={scaleFactor}
        scaleY={scaleFactor}
      />
    </Group>
  );
}
