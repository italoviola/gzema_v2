import React from 'react';
import { Line, Rect, Text } from 'react-konva';

import { getTextOffset } from './utils';

const MAIN_LINE_COLOR = '#000000';
const SECONDARY_LINE_COLOR = '#7a7979';
const INTERMEDIATE_LINE_COLOR = '#7a7979';
const SUB_LINE_COLOR = '#a8a8a8';
const SUB_SUB_LINE_COLOR = '#91df91eb';

// Atualizar as constantes no início do arquivo
const MAX_LINES = 3000; // Limite para linhas normais
const MAX_TEXTS = 2000; // Limite para textos normais e retângulos
const MAX_MICRO_LINES = 100; // Limite específico para micro linhas
const MAX_MICRO_TEXTS = Math.floor(MAX_MICRO_LINES * 0.0833); // 8,33% de MAX_MICRO_LINES (~249)
const MAX_DETAIL_ELEMENTS = MAX_MICRO_LINES + MAX_MICRO_TEXTS; // Limite auxiliar geral para detalhes

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

  // Calcula os limites visíveis do grid com uma margem de segurança
  const margin = 0; // Margem para evitar aparecimento abrupto de elementos

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
  // CORREÇÃO: Alinhar o início do loop à grade para que as linhas se movam com o stage
  const startValue =
    Math.floor(effectiveMin / intermediateStepSize) * intermediateStepSize;

  for (let v = startValue; v <= effectiveMax; v += intermediateStepSize) {
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
  if (zoomLevel >= 2048) {
    const subStep = intermediateStepSize / 10;
    const subSubStep = subStep / 10;
    const microStep = subSubStep / 10;

    const microLines = [];
    const microTexts = [];

    // Margem específica para microlinhas
    for (let i = 0; ; i += 1) {
      let added = false;

      // Valor positivo
      const positiveV = i * microStep;
      if (
        positiveV >= visibleMin &&
        positiveV <= visibleMax &&
        microLines.length < MAX_MICRO_LINES
      ) {
        microLines.push(
          <Line
            key={`${subKey}-micro-${positiveV.toFixed(2)}`}
            points={
              isVertical
                ? [positiveV, fixed1, positiveV, fixed2]
                : [fixed1, positiveV, fixed2, positiveV]
            }
            stroke="#c7f8c7"
            strokeWidth={strokeWidth / 4}
          />,
        );

        // Texto para valores positivos
        const roundedPositiveV = Math.round(positiveV * 100) / 100;
        if (Math.round(roundedPositiveV * 100) % 10 === 0) {
          const microFontSize = getFontSize();
          const microPadding = microFontSize * 0.1;
          const microTextValue = roundedPositiveV.toFixed(2);
          const microTextWidth = microFontSize * microTextValue.length * 0.6;
          const microTextHeight = microFontSize;
          const { offsetX: microOffsetX, offsetY: microOffsetY } =
            getTextOffset(roundedPositiveV, isVertical, microFontSize);

          const isZero = roundedPositiveV === 0;
          let microTextY;

          if (isVertical) {
            microTextY = 0 - microOffsetY + microPadding * 8;
          } else if (isZero) {
            microTextY = 0 - microOffsetY + microPadding * 8;
          } else {
            microTextY = roundedPositiveV - microOffsetY + microPadding * 16;
          }

          microTexts.push(
            <Rect
              key={`bg-zoom${zoomLevel < 4096 ? 'Low' : 'High'}-microText-${
                isVertical ? 'v' : 'h'
              }-${roundedPositiveV.toFixed(2)}`}
              x={
                (isVertical ? roundedPositiveV : 0) -
                microOffsetX -
                microPadding / 2
              }
              y={
                (isVertical ? 0 : roundedPositiveV) -
                microOffsetY -
                microPadding / 4
              }
              width={microTextWidth}
              height={microTextHeight}
              fill="white"
            />,
          );
          microTexts.push(
            <Text
              key={`zoom${zoomLevel < 4096 ? 'Low' : 'High'}-microText-${
                isVertical ? 'v' : 'h'
              }-${roundedPositiveV.toFixed(2)}`}
              x={isVertical ? roundedPositiveV : 0}
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
        added = true;
      }

      // Valor negativo (não repete zero)
      if (i > 0) {
        const negativeV = -i * microStep;
        if (negativeV >= visibleMin && negativeV <= visibleMax) {
          microLines.push(
            <Line
              key={`${subKey}-micro-${negativeV.toFixed(2)}`}
              points={
                isVertical
                  ? [negativeV, fixed1, negativeV, fixed2]
                  : [fixed1, negativeV, fixed2, negativeV]
              }
              stroke="#c7f8c7"
              strokeWidth={strokeWidth / 4}
            />,
          );

          // Texto para valores negativos
          const roundedNegativeV = Math.round(negativeV * 100) / 100;
          if (
            Math.round(roundedNegativeV * 100) % 10 === 0 &&
            microTexts.length < MAX_MICRO_TEXTS * 2
          ) {
            const microFontSize = getFontSize();
            const microPadding = microFontSize * 0.1;
            const microTextValue = roundedNegativeV.toFixed(2);
            const microTextWidth = microFontSize * microTextValue.length * 0.6;
            const microTextHeight = microFontSize;
            const { offsetX: microOffsetX, offsetY: microOffsetY } =
              getTextOffset(roundedNegativeV, isVertical, microFontSize);

            let microTextY;
            if (isVertical) {
              microTextY = 0 - microOffsetY + microPadding * 8;
            } else {
              microTextY = roundedNegativeV - microOffsetY + microPadding * 16;
            }

            microTexts.push(
              <Rect
                key={`bg-zoom${zoomLevel < 4096 ? 'Low' : 'High'}-microText-${
                  isVertical ? 'v' : 'h'
                }-${roundedNegativeV.toFixed(2)}`}
                x={
                  (isVertical ? roundedNegativeV : 0) -
                  microOffsetX -
                  microPadding / 2
                }
                y={
                  (isVertical ? 0 : roundedNegativeV) -
                  microOffsetY -
                  microPadding / 4
                }
                width={microTextWidth}
                height={microTextHeight}
                fill="white"
              />,
            );
            microTexts.push(
              <Text
                key={`zoom${zoomLevel < 4096 ? 'Low' : 'High'}-microText-${
                  isVertical ? 'v' : 'h'
                }-${roundedNegativeV.toFixed(2)}`}
                x={isVertical ? roundedNegativeV : 0}
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
          added = true;
        }
      }

      // Para quando não há mais nada visível para adicionar
      if (
        (!added &&
          i * microStep >
            Math.max(Math.abs(visibleMin), Math.abs(visibleMax))) ||
        (microLines.length >= MAX_MICRO_LINES &&
          microTexts.length >= MAX_MICRO_TEXTS * 2)
      ) {
        break;
      }
    }

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
    }
  });

  // 3. Limitar individualmente e depois combinar
  const linesToRender = lines.slice(0, MAX_LINES);
  const textsToRender = textsAndRects.slice(0, MAX_TEXTS);

  // Combinar respeitando os limites individuais
  const allElements = [...linesToRender, ...textsToRender];

  return allElements;
}
