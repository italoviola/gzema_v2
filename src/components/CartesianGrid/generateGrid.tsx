import React from 'react';
import { Line, Rect, Text } from 'react-konva';

import { getTextOffset } from './utils';

const MAIN_LINE_COLOR = '#000000';
const SECONDARY_LINE_COLOR = '#7a7979';
const INTERMEDIATE_LINE_COLOR = '#7a7979';
const SUB_LINE_COLOR = '#a8a8a8';
const SUB_SUB_LINE_COLOR = '#91df91eb';

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
  // Separamos os elementos principais dos detalhes para garantir prioridade
  const mainElements = [];
  const detailElements = [];
  const MAX_ELEMENTS = 5000; // Aumentamos o limite para acomodar mais linhas
  const MAX_DETAIL_ELEMENTS = 4000; // Limite para elementos de detalhe

  // Calcula os limites visíveis do grid com uma margem de segurança
  const margin = intermediateStepSize * 2; // Margem para evitar aparecimento abrupto de elementos

  let visibleMin = isVertical
    ? -stagePosition.x / zoomLevel - margin
    : -stagePosition.y / zoomLevel - margin;
  let visibleMax = isVertical
    ? (stageWidth - stagePosition.x) / zoomLevel + margin
    : (stageHeight - stagePosition.y) / zoomLevel + margin;

  // Garante que min < max
  if (visibleMin > visibleMax) {
    [visibleMin, visibleMax] = [visibleMax, visibleMin];
  }

  // Restringe o min/max para a área visível
  const effectiveMin = Math.max(min, visibleMin);
  const effectiveMax = Math.min(max, visibleMax);

  // PRIMEIRA ETAPA: Renderizar as linhas principais e seus textos
  for (let v = effectiveMin; v <= effectiveMax; v += intermediateStepSize) {
    if (v >= visibleMin && v <= visibleMax) {
      // Usa as constantes de cor
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

      const fontSize = getFontSize();
      const padding = fontSize * 0.1; // ajuste conforme necessário
      const textValue = `${Math.round(v)}`;
      const textWidth = fontSize * textValue.length * 0.6; // aproximação
      const textHeight = fontSize;
      const { offsetX, offsetY } = getTextOffset(v, isVertical, fontSize);

      // Renderiza o texto principal apenas se zoomLevel < 512
      if (zoomLevel < 512) {
        mainElements.push(
          <Rect
            key={`bg-zoom${zoomLevel < 512 ? 'Low' : 'High'}-${labelKey}-${v}`}
            x={(isVertical ? v : 0) - offsetX - padding / 2}
            y={(isVertical ? 0 : v) - offsetY - padding / 2}
            width={textWidth + padding}
            height={textHeight + padding}
            fill="white"
          />,
        );
        mainElements.push(
          <Text
            key={`zoom${zoomLevel < 512 ? 'Low' : 'High'}-${labelKey}-${v}`}
            x={isVertical ? v : 0}
            y={isVertical ? 0 : v}
            text={textValue}
            fontSize={fontSize}
            fill="black"
            offsetX={offsetX}
            offsetY={offsetY}
            fontFamily="monospace"
            fontStyle="bold"
          />,
        );
      }
    }
  }

  // SEGUNDA ETAPA: Renderizar as sublinhas e detalhes com IFs independentes para melhor performance
  // 1. Sublinhas (zoom > 10)
  if (zoomLevel > 10 && detailElements.length < MAX_DETAIL_ELEMENTS) {
    const subStep = intermediateStepSize / 10;
    const subStart = Math.floor(visibleMin / subStep) * subStep;
    const subEnd = Math.ceil(visibleMax / subStep) * subStep;

    for (let subV = subStart; subV <= subEnd; subV += subStep) {
      if (subV >= visibleMin && subV <= visibleMax) {
        detailElements.push(
          <Line
            key={`${subKey}-${subV}`}
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

  // 2. Sub-textos (zoom >= 512)
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
        const subFontSize = getFontSize();
        const subPadding = subFontSize * 0.1;
        const subTextValue = subV.toFixed(1);
        const subTextWidth = subFontSize * subTextValue.length * 0.6;
        const subTextHeight = subFontSize;
        const { offsetX: subOffsetX, offsetY: subOffsetY } = getTextOffset(
          subV,
          isVertical,
          subFontSize,
        );

        detailElements.push(
          <Rect
            key={`bg-zoom${zoomLevel < 512 ? 'Low' : 'High'}-subText-${
              isVertical ? 'v' : 'h'
            }-${subV}`}
            x={(isVertical ? subV : 0) - subOffsetX - subPadding / 2}
            y={(isVertical ? 0 : subV) - subOffsetY - subPadding / 2}
            width={subTextWidth + subPadding}
            height={subTextHeight + subPadding}
            fill="white"
          />,
        );
        detailElements.push(
          <Text
            key={`zoom${zoomLevel < 512 ? 'Low' : 'High'}-subText-${
              isVertical ? 'v' : 'h'
            }-${subV}`}
            x={isVertical ? subV : 0}
            y={isVertical ? 0 : subV}
            text={subTextValue}
            fontSize={subFontSize}
            fill="black"
            offsetX={subOffsetX}
            offsetY={subOffsetY}
            fontFamily="monospace"
            fontStyle="bold"
          />,
        );
      }
    }
  }

  // 3. Sub-sublinhas (zoom >= 1024)
  if (zoomLevel >= 1024 && detailElements.length < MAX_DETAIL_ELEMENTS) {
    const subStep = intermediateStepSize / 10;
    const subSubStep = subStep / 10;
    const subSubStart = Math.floor(visibleMin / subSubStep) * subSubStep;
    const subSubEnd = Math.ceil(visibleMax / subSubStep) * subSubStep;

    for (
      let subSubV = subSubStart;
      subSubV <= subSubEnd;
      subSubV += subSubStep
    ) {
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

  // 4. Microlinhas (zoom >= 2048)
  if (zoomLevel >= 2048 && detailElements.length < MAX_DETAIL_ELEMENTS) {
    const subStep = intermediateStepSize / 10;
    const subSubStep = subStep / 10;
    const microStep = subSubStep / 10;
    const microStart = Math.floor(visibleMin / microStep) * microStep;
    const microEnd = Math.ceil(visibleMax / microStep) * microStep;

    // Primeiro: Coletar todos os elementos para renderização separada
    const microLines = [];
    const microTexts = [];

    for (let microV = microStart; microV <= microEnd; microV += microStep) {
      if (
        microV >= visibleMin &&
        microV <= visibleMax &&
        detailElements.length < MAX_DETAIL_ELEMENTS
      ) {
        // Adicionar todas as microlinhas primeiro
        microLines.push(
          <Line
            key={`${subKey}-micro-${microV.toFixed(2)}`}
            points={
              isVertical
                ? [microV, fixed1, microV, fixed2]
                : [fixed1, microV, fixed2, microV]
            }
            stroke="#c7f8c7"
            strokeWidth={strokeWidth / 4}
          />,
        );

        // Números de microlinhas - apenas a cada 5 linhas
        const roundedMicroV = Math.round(microV * 100) / 100;
        if (
          Math.round(roundedMicroV * 100) % 10 === 0 &&
          microTexts.length + microLines.length < MAX_DETAIL_ELEMENTS
        ) {
          const microFontSize = getFontSize();
          const microPadding = microFontSize * 0.1;
          const microTextValue = roundedMicroV.toFixed(2);
          const microTextWidth = microFontSize * microTextValue.length * 0.6;
          const microTextHeight = microFontSize;
          const { offsetX: microOffsetX, offsetY: microOffsetY } =
            getTextOffset(roundedMicroV, isVertical, microFontSize);

          // consts for Text component
          const isZero = roundedMicroV === 0;
          let microTextY;

          if (isVertical) {
            microTextY = 0 - microOffsetY + microPadding * 8;
          } else if (isZero) {
            microTextY = 0 - microOffsetY + microPadding * 8;
          } else {
            microTextY = roundedMicroV - microOffsetY + microPadding * 16;
          }

          // Adicionar retângulos de fundo à coleção separada
          microTexts.push(
            <Rect
              key={`bg-zoom${zoomLevel < 4096 ? 'Low' : 'High'}-microText-${
                isVertical ? 'v' : 'h'
              }-${roundedMicroV.toFixed(2)}`}
              x={
                (isVertical ? roundedMicroV : 0) -
                microOffsetX -
                microPadding / 2
              }
              y={
                (isVertical ? 0 : roundedMicroV) -
                microOffsetY -
                microPadding / 4
              }
              width={microTextWidth}
              height={microTextHeight}
              fill="white"
            />,
          );

          // Adicionar textos à coleção separada
          microTexts.push(
            <Text
              key={`zoom${zoomLevel < 4096 ? 'Low' : 'High'}-microText-${
                isVertical ? 'v' : 'h'
              }-${roundedMicroV.toFixed(2)}`}
              x={isVertical ? roundedMicroV : 0}
              y={microTextY}
              text={microTextValue}
              fontSize={microFontSize}
              fill="#006600"
              offsetX={microOffsetX}
              offsetY={microOffsetY}
              fontFamily="monospace"
              fontStyle="bold"
            />,
          );
        }
      }
    }

    // Adicionar ao array de detalhes mantendo a ordem: linhas primeiro, depois textos
    detailElements.push(...microLines, ...microTexts);
  }

  // Agora vamos reorganizar todos os elementos para renderizar primeiro as linhas, depois os textos
  // Isso garante que os textos sempre apareçam por cima das linhas

  // 1. Separar todos os elementos em dois arrays: linhas e texto+backgrounds
  const lines: React.ReactNode[] = [];
  const textsAndRects: React.ReactNode[] = [];

  // 2. Preencher os arrays separados com tratamento especial para a linha horizontal do eixo X (valor 0)
  [...mainElements, ...detailElements].forEach((element: any) => {
    // Verificar se é um elemento de texto/fundo
    if (element && (element.type === Text || element.type === Rect)) {
      textsAndRects.push(element);
      return;
    }

    // Verificar se é uma linha
    if (element && element.type === Line) {
      // Extrair informações da chave para identificar o tipo de linha
      const key = element.key?.toString() || '';

      // Checar se é a linha horizontal do eixo X (uma linha onde y=0)
      // Linhas horizontais têm pontos como [x1, 0, x2, 0]
      const isHorizontalAxisLine = !isVertical && key.includes(`${mainKey}-0`);

      if (isHorizontalAxisLine) {
        // Adiciona a linha horizontal do eixo X no início do array
        // para garantir que seja renderizada primeiro (abaixo de tudo)
        lines.unshift(element);
      } else {
        // Linhas normais vão para o final do array
        lines.push(element);
      }
      return;
    }
  });

  // 3. Combinar todos os elementos na ordem correta
  const allElements = [...lines, ...textsAndRects];

  // Limita o número máximo de elementos para evitar travamentos
  if (allElements.length > MAX_ELEMENTS) {
    const totalTextsAndRects = textsAndRects.length;
    const maxLines = MAX_ELEMENTS - totalTextsAndRects;
    const linesToKeep = lines.slice(0, Math.max(0, maxLines));

    // Prioriza manter os textos visíveis
    return [...linesToKeep, ...textsAndRects];
  }

  return allElements;
}
