import React from 'react';
import { Line, Rect, Text } from 'react-konva';

import { getTextOffset } from './utils';

const MAIN_LINE_COLOR = '#000000';
const SECONDARY_LINE_COLOR = '#7a7979';
const INTERMEDIATE_LINE_COLOR = '#7a7979';
const SUB_LINE_COLOR = '#a8a8a8';
const SUB_SUB_LINE_COLOR = '#91df91eb';

// Constantes de Limite para Elementos Renderizados
const MAX_LINES = 3000; // Limite total para linhas
const MAX_TEXTS = 2000; // Limite total para textos e seus fundos
const MAX_MICRO_LINES = 100; // Limite específico para microlinhas
const MAX_MICRO_TEXTS = Math.floor(MAX_MICRO_LINES * 0.0833); // Limite para microtextos (aprox. 8.33% das microlinhas)
const MAX_DETAIL_ELEMENTS = MAX_MICRO_LINES + MAX_MICRO_TEXTS * 2; // Limite combinado para todos os elementos de detalhe

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

/**
 * Cria um par de componentes Rect e Text para exibir um rótulo no grid.
 * Abstrai a lógica de criação de texto com fundo branco para reutilização.
 */
function createGridText(
  key: string,
  value: number,
  text: string,
  isVertical: boolean,
  fontSize: number,
  fill: string,
  isMicroText?: boolean, // Flag para lidar com o caso dos micro-textos
): React.ReactNode[] {
  const padding = fontSize * 0.1;
  const textWidth = fontSize * text.length * 0.6; // Aproximação da largura do texto
  const textHeight = fontSize;
  const { offsetX, offsetY } = getTextOffset(value, isVertical, fontSize);

  // --- Valores Padrão ---
  const xPos = isVertical ? value : 0;
  let yPos = isVertical ? 0 : value;
  const rectX = xPos - offsetX - padding / 2;
  let rectY = yPos - offsetY - padding / 2;
  let rectWidth = textWidth + padding;
  let rectHeight = textHeight + padding;

  // --- Sobrescreve os valores se for um micro-texto ---
  if (isMicroText) {
    const isZero = value === 0;

    // Lógica de posicionamento Y específica para o texto
    if (isVertical || isZero) {
      yPos = 0 - offsetY + padding * 8;
    } else {
      yPos = value - offsetY + padding * 16;
    }

    // Lógica de posicionamento e dimensão específica para o Rect
    const rectBaseY = isVertical ? 0 : value;
    rectY = rectBaseY - offsetY - padding / 4;
    rectWidth = textWidth; // Sem padding
    rectHeight = textHeight; // Sem padding
  }

  return [
    <Rect
      key={`bg-${key}`}
      x={rectX}
      y={rectY}
      width={rectWidth}
      height={rectHeight}
      fill="white"
    />,
    <Text
      key={key}
      x={xPos}
      y={yPos}
      text={text}
      fontSize={fontSize}
      fill={fill}
      offsetX={offsetX}
      offsetY={offsetY}
      fontFamily="monospace"
      fontStyle="bold"
    />,
  ];
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
  const mainElements: React.ReactNode[] = [];
  const detailElements: React.ReactNode[] = [];

  // Calcula os limites visíveis do grid com base na posição e zoom do "stage"
  const margin = 0; // Margem de segurança para renderização
  const visibleMin = isVertical
    ? -stagePosition.x / zoomLevel - margin
    : -stagePosition.y / zoomLevel - margin;
  const visibleMax = isVertical
    ? (stageWidth - stagePosition.x) / zoomLevel + margin
    : (stageHeight - stagePosition.y) / zoomLevel + margin;

  const effectiveMin = Math.max(min, visibleMin);
  const effectiveMax = Math.min(max, visibleMax);

  // ETAPA 1: Renderizar as linhas principais e seus textos
  const startValue =
    Math.floor(effectiveMin / intermediateStepSize) * intermediateStepSize;
  for (let v = startValue; v <= effectiveMax; v += intermediateStepSize) {
    let strokeColor = INTERMEDIATE_LINE_COLOR;
    if (v % baseGridSize === 0) {
      strokeColor = MAIN_LINE_COLOR;
    } else if (zoomLevel > 10) {
      strokeColor = SECONDARY_LINE_COLOR;
    }

    mainElements.push(
      <Line
        key={`${mainKey}-${v}`}
        points={isVertical ? [v, fixed1, v, fixed2] : [fixed1, v, fixed2, v]}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />,
    );

    // Renderiza textos principais apenas em níveis de zoom mais baixos
    if (zoomLevel < 512) {
      mainElements.push(
        ...createGridText(
          `${labelKey}-main-${v}`,
          v,
          `${Math.round(v)}`,
          isVertical,
          getFontSize(),
          'black',
        ),
      );
    }
  }

  // ETAPA 2: Renderizar detalhes (sublinhas, sub-textos, etc.) com base no zoom
  // A renderização é feita em blocos `if` independentes para clareza e performance.

  // 2.1. Sublinhas (aparecem com um pouco de zoom)
  if (zoomLevel > 10 && detailElements.length < MAX_DETAIL_ELEMENTS) {
    const subStep = intermediateStepSize / 10;
    const subStart = Math.floor(visibleMin / subStep) * subStep;
    const subEnd = Math.ceil(visibleMax / subStep) * subStep;

    for (let subV = subStart; subV <= subEnd; subV += subStep) {
      if (subV >= visibleMin && subV <= visibleMax) {
        detailElements.push(
          <Line
            key={`${subKey}-sub-${subV}`}
            points={
              isVertical
                ? [subV, fixed1, subV, fixed2]
                : [fixed1, subV, fixed2, subV]
            }
            stroke={SUB_LINE_COLOR}
            strokeWidth={strokeWidth / 8}
          />,
        );
      }
    }
  }

  // 2.2. Sub-textos (aparecem com mais zoom)
  if (
    zoomLevel >= 512 &&
    zoomLevel < 2048 &&
    detailElements.length < MAX_DETAIL_ELEMENTS
  ) {
    const subStep = intermediateStepSize / 10;
    const subStart = Math.floor(visibleMin / subStep) * subStep;
    const subEnd = Math.ceil(visibleMax / subStep) * subStep;

    for (let subV = subStart; subV <= subEnd; subV += subStep) {
      if (
        subV >= visibleMin &&
        subV <= visibleMax &&
        detailElements.length < MAX_DETAIL_ELEMENTS
      ) {
        detailElements.push(
          ...createGridText(
            `${labelKey}-sub-${subV}`,
            subV,
            subV.toFixed(1),
            isVertical,
            getFontSize(),
            'black',
          ),
        );
      }
    }
  }

  // 2.3. Sub-sublinhas (ainda mais zoom)
  if (zoomLevel >= 1024 && detailElements.length < MAX_DETAIL_ELEMENTS) {
    const subStep = intermediateStepSize / 100; // Mais finas
    const subSubStart = Math.floor(visibleMin / subStep) * subStep;
    const subSubEnd = Math.ceil(visibleMax / subStep) * subStep;

    for (let subSubV = subSubStart; subSubV <= subSubEnd; subSubV += subStep) {
      if (
        subSubV >= visibleMin &&
        subSubV <= visibleMax &&
        detailElements.length < MAX_DETAIL_ELEMENTS
      ) {
        detailElements.push(
          <Line
            key={`${subKey}-subsub-${subSubV.toFixed(2)}`}
            points={
              isVertical
                ? [subSubV, fixed1, subSubV, fixed2]
                : [fixed1, subSubV, fixed2, subSubV]
            }
            stroke={SUB_SUB_LINE_COLOR}
            strokeWidth={strokeWidth / 16}
          />,
        );
      }
    }
  }

  // 2.4. Microlinhas e Microtextos (zoom máximo)
  if (zoomLevel >= 2048) {
    const microStep = intermediateStepSize / 1000;
    const microLines: React.ReactNode[] = [];
    const microTexts: React.ReactNode[] = [];

    // Otimização: Renderiza do centro (0) para fora, priorizando elementos na área de foco do usuário.
    for (let i = 0; ; i += 1) {
      const centerOffset = i * microStep;
      let addedInIteration = false;

      // Processa ambos os lados (positivo e negativo) para expandir a partir do centro.
      const valuesToProcess = i === 0 ? [0] : [centerOffset, -centerOffset];

      valuesToProcess.forEach((v) => {
        if (v >= visibleMin && v <= visibleMax) {
          let elementAdded = false;
          // Adiciona microlinhas até o limite
          if (microLines.length < MAX_MICRO_LINES) {
            microLines.push(
              <Line
                key={`${subKey}-micro-${v.toFixed(3)}`}
                points={
                  isVertical ? [v, fixed1, v, fixed2] : [fixed1, v, fixed2, v]
                }
                stroke="#c7f8c7"
                strokeWidth={strokeWidth / 4}
              />,
            );
            elementAdded = true;
          }

          // Adiciona microtextos em intervalos específicos e até o limite
          const roundedV = Math.round(v * 100) / 100;
          if (
            Math.round(roundedV * 100) % 10 === 0 &&
            microTexts.length < MAX_MICRO_TEXTS * 2 // *2 pois cada texto tem um Rect
          ) {
            const microFontSize = getFontSize();

            microTexts.push(
              ...createGridText(
                `micro-${labelKey}-${roundedV.toFixed(2)}`,
                roundedV,
                roundedV.toFixed(2),
                isVertical,
                microFontSize,
                '#006600',
                true, // Passa a flag para indicar que é um micro-texto
              ),
            );
            elementAdded = true;
          }

          if (elementAdded) {
            addedInIteration = true;
          }
        }
      });

      // Condição de parada: sai do loop se não há mais elementos visíveis para adicionar
      // ou se os limites de renderização foram atingidos.
      const outOfBounds =
        centerOffset > Math.max(Math.abs(visibleMin), Math.abs(visibleMax));
      const limitsReached =
        microLines.length >= MAX_MICRO_LINES &&
        microTexts.length >= MAX_MICRO_TEXTS * 2;

      if ((!addedInIteration && outOfBounds) || limitsReached) {
        break;
      }
    }
    detailElements.push(...microLines, ...microTexts);
  }

  // ETAPA 3: Reorganizar todos os elementos para garantir a ordem de renderização correta.
  // Textos e seus fundos devem sempre aparecer por cima das linhas.

  const lines: React.ReactNode[] = [];
  const textsAndRects: React.ReactNode[] = [];

  // Separa os elementos em 'linhas' e 'textos/fundos'
  [...mainElements, ...detailElements].forEach((element: any) => {
    if (element && (element.type === Text || element.type === Rect)) {
      textsAndRects.push(element);
      return;
    }

    if (element && element.type === Line) {
      const key = element.key?.toString() || '';
      // Tratamento especial para a linha do eixo X (y=0) para que fique no fundo
      const isHorizontalAxisLine = !isVertical && key.includes(`${mainKey}-0`);

      if (isHorizontalAxisLine) {
        lines.unshift(element); // Renderiza primeiro (no fundo)
      } else {
        lines.push(element); // Ordem normal
      }
    }
  });

  // Aplica os limites de renderização individuais antes de combinar
  const linesToRender = lines.slice(0, MAX_LINES);
  const textsToRender = textsAndRects.slice(0, MAX_TEXTS);

  return [...linesToRender, ...textsToRender];
}
