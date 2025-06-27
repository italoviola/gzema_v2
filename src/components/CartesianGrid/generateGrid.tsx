import React from 'react';
import { Line, Rect, Text, Group } from 'react-konva';

import { getTextOffset } from './utils';

const MAIN_LINE_COLOR = '#000000';
const SECONDARY_LINE_COLOR = '#7a7979';
const INTERMEDIATE_LINE_COLOR = '#7a7979';
const SUB_LINE_COLOR = '#a8a8a8';
const SUB_SUB_LINE_COLOR = '#91df91eb';
const MICRO_LINE_COLOR = '#c7f8c7';
const HIGHLIGHTED_MICRO_LINE_COLOR = '#a8a8a8'; // Cor cinza para as linhas demarcadas

// Constantes de Limite para Elementos Renderizados
const MAX_LINES = 3000; // Limite total para linhas
const MAX_TEXTS = 2000; // Limite total para textos e seus fundos
const MAX_MICRO_LINES = 100; // Limite específico para microlinhas
const MAX_MICRO_TEXTS = Math.floor(MAX_MICRO_LINES * 0.0833); // Limite para microtextos (aprox. 8.33% das microlinhas)
const MAX_DETAIL_ELEMENTS = MAX_MICRO_LINES + MAX_MICRO_TEXTS * 2; // Limite combinado para todos os elementos de detalhe

export interface GenerateGridParams {
  isHorizontal: boolean;
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
  isHorizontal: boolean,
  fontSize: number, // Tamanho da fonte desejado (pode ser < 0.01)
  fill: string,
  zoomLevel: number,
  isMicroText?: boolean, // Flag para lidar com o caso dos micro-textos
): React.ReactNode {
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

  // Usa o renderFontSize (tamanho renderizável) para todos os cálculos de layout
  const padding = renderFontSize * 0.1;
  const textWidth = renderFontSize * text.length * 0.6; // Aproximação da largura do texto
  const textHeight = renderFontSize;
  const { offsetX, offsetY } = getTextOffset(
    value,
    isHorizontal,
    renderFontSize,
  );

  // --- Valores Padrão ---
  const xPos = isHorizontal ? value : 0;
  let yPos = isHorizontal ? 0 : value;
  const rectX = xPos - offsetX - padding / 2;
  let rectY = yPos - offsetY - padding / 2;
  let rectWidth = isHorizontal ? textWidth + padding : textWidth * 0.75;
  const rectHeight = textHeight + padding;

  let rectOffsetX = 0;
  let rectOffsetY = 0;

  const rectBaseY = isHorizontal ? 0 : value;
  rectY = rectBaseY - offsetY - padding / 4;

  // --- Sobrescreve os valores se for um micro-texto ---
  if (isMicroText) {
    const isZero = value === 0;

    // Lógica de posicionamento Y específica para o texto
    if (isZero) {
      yPos = 0 - offsetY + padding * (zoomLevel >= 2048 ? 4 : 8);
      rectOffsetX = offsetX * -0.5;
      rectOffsetY = offsetY * -1;
    } else if (isHorizontal) {
      yPos = 0 - offsetY + padding * (zoomLevel >= 2048 ? 4 : 8);
    } else {
      if (zoomLevel >= 2048) {
        rectOffsetX = offsetX * -0.5;
        rectOffsetY = offsetY * -0.5;
      }
      yPos = value - offsetY + padding * (zoomLevel >= 2048 ? 12 : 20);
    }
  } else if (!isHorizontal && value > 0) {
    rectWidth *= 2.2;
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
        text={!isHorizontal ? String(Number(text) * -1) : text}
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

  // Função para obter a posição correta no eixo, invertendo o Y para que
  // valores positivos fiquem para baixo e negativos para cima.
  const getPosition = (val: number) => (isHorizontal ? val : val);

  // Calcula os limites visíveis do grid com base na posição e zoom do "stage"
  const margin = 0; // Margem de segurança para renderização
  const visibleMin = isHorizontal
    ? -stagePosition.x / zoomLevel - margin
    : -stagePosition.y / zoomLevel - margin;
  const visibleMax = isHorizontal
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
        points={
          isHorizontal
            ? [v, fixed1, v, fixed2]
            : [fixed1, getPosition(v), fixed2, getPosition(v)]
        }
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />,
    );

    // Renderiza textos principais apenas em níveis de zoom mais baixos
    if (zoomLevel < 512) {
      mainElements.push(
        createGridText(
          `${labelKey}-main-${v}`,
          getPosition(v),
          `${Math.round(v)}`,
          isHorizontal,
          getFontSize(),
          'black',
          zoomLevel,
        ),
      );
    }
  }

  // ETAPA 2: Renderizar detalhes (sublinhas, sub-textos, etc.) com base no zoom
  // A renderização é feita em blocos `if` independentes para clareza e performance.

  // 2.1. Sublinhas (aparecem com um pouco de zoom)
  if (zoomLevel > 8 && detailElements.length < MAX_DETAIL_ELEMENTS) {
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
                : [fixed1, getPosition(subV), fixed2, getPosition(subV)]
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
    zoomLevel >= 256 &&
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
        const subText = subV === 0 ? '0' : subV.toFixed(1);
        detailElements.push(
          createGridText(
            `${labelKey}-sub-${subV}`,
            getPosition(subV),
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

  // 2.3. Sub-sublinhas (ainda mais zoom)
  if (zoomLevel >= 512 && detailElements.length < MAX_DETAIL_ELEMENTS) {
    const subStep = intermediateStepSize / 100; // Mais finas
    const subSubStart = Math.floor(visibleMin / subStep) * subStep;
    const subSubEnd = Math.ceil(visibleMax / subStep) * subStep;

    for (let subSubV = subSubStart; subSubV <= subSubEnd; subSubV += subStep) {
      if (
        subSubV !== 0 &&
        subSubV >= visibleMin &&
        subSubV <= visibleMax &&
        detailElements.length < MAX_DETAIL_ELEMENTS
      ) {
        detailElements.push(
          <Line
            key={`${subKey}-subsub-${subSubV.toFixed(2)}`}
            points={
              isHorizontal
                ? [subSubV, fixed1, subSubV, fixed2]
                : [fixed1, getPosition(subSubV), fixed2, getPosition(subSubV)]
            }
            stroke={SUB_SUB_LINE_COLOR}
            strokeWidth={strokeWidth / 4}
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

          // Adiciona microlinhas até o limite, pulando a linha 0
          if (v !== 0 && microLines.length < MAX_MICRO_LINES) {
            const isHighlighted = Math.round(v * 100) % 10 === 0;

            microLines.push(
              <Line
                key={`${subKey}-micro-${v.toFixed(3)}`}
                points={
                  isHorizontal
                    ? [v, fixed1, v, fixed2]
                    : [fixed1, getPosition(v), fixed2, getPosition(v)]
                }
                stroke={
                  isHighlighted
                    ? HIGHLIGHTED_MICRO_LINE_COLOR
                    : MICRO_LINE_COLOR
                }
                strokeWidth={isHighlighted ? strokeWidth / 2 : strokeWidth / 4}
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
            const microText = roundedV === 0 ? '0' : roundedV.toFixed(2);
            microTexts.push(
              createGridText(
                `micro-${labelKey}-${roundedV.toFixed(2)}`,
                getPosition(roundedV),
                microText,
                isHorizontal,
                getFontSize(),
                '#006600',
                zoomLevel,
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
    if (
      element &&
      (element.type === Text || element.type === Rect || element.type === Group)
    ) {
      textsAndRects.push(element);
      return;
    }

    if (element && element.type === Line) {
      const key = element.key?.toString() || '';
      // Tratamento especial para a linha do eixo X (y=0) para que fique no fundo
      const isHorizontalAxisLine =
        !isHorizontal && key.includes(`${mainKey}-0`);

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
