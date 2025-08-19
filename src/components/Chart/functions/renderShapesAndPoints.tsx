import { Line, Rect, Circle, Path } from 'react-konva';
import { ElementItem, ElementItems } from 'types/element';

export type Point = { x: number; y: number };

export function applyChamferToPolygon(
  polygon: Point[],
  vertexIndex: number,
  angleDeg: number,
  length: number,
): Point[] {
  const eps = 1e-9;

  const cross = (a: Point, b: Point) => a.x * b.y - a.y * b.x;
  const dot2 = (a: Point, b: Point) => a.x * b.x + a.y * b.y;
  const norm = (v: Point) => Math.hypot(v.x, v.y);
  const normalize = (v: Point): Point => {
    const l = norm(v);
    return l < eps ? { x: 0, y: 0 } : { x: v.x / l, y: v.y / l };
  };
  const rotate = (v: Point, rad: number): Point => {
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    return { x: v.x * c - v.y * s, y: v.x * s + v.y * c };
  };

  const n = polygon.length;
  if (n < 3) return polygon.slice();

  const i = ((vertexIndex % n) + n) % n;
  const prev = polygon[(i - 1 + n) % n];
  const curr = polygon[i];
  const next = polygon[(i + 1) % n];

  // Vetores das arestas a partir do vértice atual
  const v1 = { x: prev.x - curr.x, y: prev.y - curr.y }; // para vértice anterior
  const v2 = { x: next.x - curr.x, y: next.y - curr.y }; // para próximo vértice

  const lenV1 = norm(v1);
  const lenV2 = norm(v2);
  if (lenV1 < eps || lenV2 < eps) return polygon.slice();

  const u1 = normalize(v1);
  const u2 = normalize(v2);

  // Determinante para orientação do ângulo interno no vértice
  const det = cross(u1, u2);
  if (Math.abs(det) < eps) return polygon.slice(); // arestas colineares

  // Escolher a aresta "vertical" do lado aplicado como referência
  // Para lados esquerdo/direito do contorno, essa aresta é a mais "vertical"
  const dx1 = Math.abs(prev.x - curr.x);
  const dx2 = Math.abs(next.x - curr.x);

  let uRef = u1;

  // Preferir a aresta com menor variação em X (mais vertical)
  if (dx2 < dx1) {
    uRef = u2;
  }

  // Se por algum motivo ambas não forem verticais, ainda assim mantemos a mais "vertical".
  // Agora definimos a direção do chanfro com ângulo fixo em relação a uRef (aresta vertical)
  const alpha = Math.max(0, Math.abs(angleDeg)) * (Math.PI / 180);

  // Dois candidatos: girar uRef +alpha e -alpha
  const wCandidates: Point[] = [rotate(uRef, +alpha), rotate(uRef, -alpha)].map(
    normalize,
  );

  // Função para calcular deslocamentos s1/s2 para um w
  const solveS = (w: Point) => {
    const s1 = (length * cross(u2, w)) / det;
    const s2 = (length * cross(u1, w)) / det;
    return { s1, s2 };
  };

  // Verificar se w está "entre" u1 e u2 (dentro do ângulo interno)
  const insideWedge = (w: Point) =>
    cross(u1, w) * det >= -1e-9 && cross(w, u2) * det >= -1e-9;

  // Tentar candidatos garantindo segmento válido (s1,s2 > 0) e w dentro do ângulo interno
  let chosenW: Point | null = null;
  let s1 = 0;
  let s2 = 0;

  wCandidates.some((wc) => {
    const { s1: a, s2: b } = solveS(wc);

    // Se necessário, inverter w (mesma reta) para tornar s1,s2 positivos
    if (a <= eps || b <= eps) {
      const wFlip = { x: -wc.x, y: -wc.y };
      const r = solveS(wFlip);
      if (r.s1 > eps && r.s2 > eps && insideWedge(wFlip)) {
        chosenW = wFlip;
        s1 = r.s1;
        s2 = r.s2;
        return true;
      }
      // guarda como fallback se nada ficar "inside"
      if (!chosenW && r.s1 > eps && r.s2 > eps) {
        chosenW = wFlip;
        s1 = r.s1;
        s2 = r.s2;
      }
      return false;
    }
    if (insideWedge(wc)) {
      chosenW = wc;
      s1 = a;
      s2 = b;
      return true;
    }
    // guarda como fallback válido se nada ficar "inside"
    if (!chosenW) {
      chosenW = wc;
      s1 = a;
      s2 = b;
    }
    return false;
  });

  // Se não conseguir um w válido, usa fallback simétrico baseado na bissetriz
  if (!chosenW || s1 <= eps || s2 <= eps) {
    // Fallback simétrico (mesmo do código anterior)
    const dotClamped = Math.max(-1, Math.min(1, dot2(u1, u2)));
    const phi = Math.acos(dotClamped);
    if (phi < 1e-6) return polygon.slice();

    const t = length / (2 * Math.sin(phi / 2)); // usa seno
    const t1 = Math.min(t, lenV1 * 0.999);
    const t2 = Math.min(t, lenV2 * 0.999);

    const pA = { x: curr.x + u1.x * t1, y: curr.y + u1.y * t1 };
    const pB = { x: curr.x + u2.x * t2, y: curr.y + u2.y * t2 };

    const newPoly: Point[] = [];
    for (let k = 0; k < n; k += 1) {
      if (k === i) newPoly.push(pA, pB);
      else newPoly.push(polygon[k]);
    }
    return newPoly;
  }

  // Limitar para não ultrapassar os vértices adjacentes
  const max1 = lenV1 * 0.999;
  const max2 = lenV2 * 0.999;
  const scale = Math.min(1, max1 / s1, max2 / s2);
  s1 *= scale;
  s2 *= scale;

  const pA = { x: curr.x + u1.x * s1, y: curr.y + u1.y * s1 };
  const pB = { x: curr.x + u2.x * s2, y: curr.y + u2.y * s2 };

  const newPoly: Point[] = [];
  for (let k = 0; k < n; k += 1) {
    if (k === i) newPoly.push(pA, pB);
    else newPoly.push(polygon[k]);
  }
  return newPoly;
}

export function convertElementsToPolygons(
  elementItems: ElementItems,
  defaultColor: string,
  defaultOpacity: number = 0.9,
): any[] {
  return elementItems.map((element: ElementItem) => {
    // Calculando as metades das alturas para posicionar acima/abaixo do xaxis
    const leftHalfHeight = element.leftDiameter / 2;
    const rightHalfHeight = element.rightDiameter / 2;

    // Verificar se tem cantos arredondados
    const hasLeftRoundedCorner = element.corners?.left?.type === 'rounded';
    const hasRightRoundedCorner = element.corners?.right?.type === 'rounded';

    // Verificar se tem chanfros
    const hasLeftChamfer = element.corners?.left?.type === 'chamfer';
    const hasRightChamfer = element.corners?.right?.type === 'chamfer';

    // Se tem pelo menos um canto arredondado, usar concaveRoundedRect
    if (hasLeftRoundedCorner || hasRightRoundedCorner) {
      // Determinar os raios dos cantos
      // Para cada canto, se for arredondado, use o raio definido, caso contrário, use 0
      const topLeftRadius = hasLeftRoundedCorner
        ? (element.corners.left as { type: 'rounded'; radius: number }).radius
        : 0;

      const bottomLeftRadius = hasLeftRoundedCorner
        ? (element.corners.left as { type: 'rounded'; radius: number }).radius
        : 0;

      const topRightRadius = hasRightRoundedCorner
        ? (element.corners.right as { type: 'rounded'; radius: number }).radius
        : 0;

      const bottomRightRadius = hasRightRoundedCorner
        ? (element.corners.right as { type: 'rounded'; radius: number }).radius
        : 0;

      // Calcular a largura e altura do elemento
      const width = element.rightZAxis - element.leftZAxis;
      const height = leftHalfHeight + rightHalfHeight; // aproximação para altura total

      return {
        type: 'concaveRoundedRect',
        x: element.leftZAxis,
        y: element.xaxis - leftHalfHeight, // posição y superior
        width,
        height,
        cornerRadius: [
          topLeftRadius, // top-left
          topRightRadius, // top-right
          bottomRightRadius, // bottom-right
          bottomLeftRadius, // bottom-left
        ],
        fill: defaultColor,
        opacity: defaultOpacity,
        id: element.id,
        label: element.label,
      };
    }

    // Para elementos sem cantos arredondados, manter o comportamento original
    // construímos o polígono base como array de pontos {x,y}
    const basePolygon: { x: number; y: number }[] = [
      { x: element.leftZAxis, y: element.xaxis - leftHalfHeight }, // top-left (0)
      { x: element.rightZAxis, y: element.xaxis - rightHalfHeight }, // top-right (1)
      { x: element.rightZAxis, y: element.xaxis + rightHalfHeight }, // bottom-right (2)
      { x: element.leftZAxis, y: element.xaxis + leftHalfHeight }, // bottom-left (3)
    ];

    // Se houver chanfros, aplicá-los ao polígono
    if (hasLeftChamfer || hasRightChamfer) {
      // coletar chanfros a aplicar (cada lado aplica nos dois vértices correspondentes)
      const chamfersToApply: {
        vertexIndex: number;
        length: number;
        angle: number;
        side: 'left' | 'right';
      }[] = [];

      if (hasLeftChamfer) {
        const c = element.corners.left as {
          type: 'chamfer';
          length: number;
          angle: number;
        };
        // top-left = 0, bottom-left = 3
        chamfersToApply.push({
          vertexIndex: 0,
          length: c.length,
          angle: c.angle,
          side: 'left',
        });
        chamfersToApply.push({
          vertexIndex: 3,
          length: c.length,
          angle: c.angle,
          side: 'left',
        });
      }

      if (hasRightChamfer) {
        const c = element.corners.right as {
          type: 'chamfer';
          length: number;
          angle: number;
        };
        // top-right = 1, bottom-right = 2
        chamfersToApply.push({
          vertexIndex: 1,
          length: c.length,
          angle: c.angle,
          side: 'right',
        });
        chamfersToApply.push({
          vertexIndex: 2,
          length: c.length,
          angle: c.angle,
          side: 'right',
        });
      }

      // aplicar em ordem decrescente de índice para não invalidar índices restantes
      chamfersToApply.sort((a, b) => b.vertexIndex - a.vertexIndex);

      const polygonPoints = chamfersToApply.reduce(
        (poly, ch) =>
          applyChamferToPolygon(
            poly as any, // applyChamferToPolygon aceita Point[]; usamos any aqui para não depender da ordem de declarações
            ch.vertexIndex,
            ch.angle,
            ch.length,
          ) as { x: number; y: number }[],
        basePolygon,
      );

      const points = polygonPoints.flatMap((p) => [p.x, p.y]);

      return {
        type: 'polygon',
        points,
        fill: defaultColor,
        opacity: defaultOpacity,
        id: element.id,
        label: element.label,
      };
    }

    // sem chanfros nem cantos arredondados: retorna polígono simples
    const points = [
      element.leftZAxis,
      element.xaxis - leftHalfHeight, // superior esquerdo
      element.rightZAxis,
      element.xaxis - rightHalfHeight, // superior direito
      element.rightZAxis,
      element.xaxis + rightHalfHeight, // inferior direito
      element.leftZAxis,
      element.xaxis + leftHalfHeight, // inferior esquerdo
    ];

    return {
      type: 'polygon',
      points,
      fill: defaultColor,
      opacity: defaultOpacity,
      id: element.id,
      label: element.label,
    };
  });
}

/**
 * Aplica um chanfro em um vértice de um polígono fechado.
 *
 * Interpretação do ângulo:
 * - angleDeg é o ângulo da aresta do chanfro em relação à aresta VERTICAL do lado aplicado.
 *   Isso garante a mesma inclinação no topo e no fundo de um mesmo lado (left/right),
 *   mesmo quando as arestas superior/inferior são inclinadas (trapézio).
 *
 * Comprimento:
 * - length é o comprimento do segmento chanfrado (distância entre os dois novos pontos).
 *
 * Detalhes:
 * - Calcula os deslocamentos ao longo das arestas adjacentes (s1, s2) usando seno/cosseno (via produto vetorial)
 *   para que o segmento resultante tenha direção e comprimento desejados.
 */

export function renderShapesAndPoints({
  points,
  elementItems,
  selectedShape,
  strokeWidth,
  colors,
  handleShapeClick,
  zoomLevel,
}: {
  points: any[];
  elementItems: ElementItem[];
  selectedShape: string | null;
  strokeWidth: number;
  colors: any;
  handleShapeClick: (id: string) => void;
  zoomLevel: number;
}) {
  const elementShapes = elementItems
    ? convertElementsToPolygons(elementItems, colors.silver)
    : [];

  return (
    <>
      {elementShapes.map((shape) => {
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
              points={shape.points?.map((point: number, i: number) =>
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
          const originalElement = elementItems.find(
            (elem) => elem.id === shape.id,
          );

          if (!originalElement) {
            return null;
          }

          const leftHalfHeight = originalElement.leftDiameter / 2;
          const rightHalfHeight = originalElement.rightDiameter / 2;

          const { fill, cornerRadius = [0, 0, 0, 0], id } = shape;
          const [tl, tr, br, bl] = cornerRadius ?? [0, 0, 0, 0];

          // Pontos do trapézio (coordenadas Y já invertidas para o gráfico)
          const leftX = originalElement.leftZAxis;
          const rightX = originalElement.rightZAxis;
          const leftTopY = -(originalElement.xaxis - leftHalfHeight);
          const rightTopY = -(originalElement.xaxis - rightHalfHeight);
          const rightBottomY = -(originalElement.xaxis + rightHalfHeight);
          const leftBottomY = -(originalElement.xaxis + leftHalfHeight);

          // Calcular o ângulo das linhas superior e inferior
          const topAngle = Math.atan2(rightTopY - leftTopY, rightX - leftX);
          const bottomAngle = Math.atan2(
            rightBottomY - leftBottomY,
            rightX - leftX,
          );

          // Calcular os deslocamentos para os pontos de tangência
          const tlOffsetX = tl / Math.tan((Math.PI / 2 + topAngle) / 2);
          const tlOffsetY = tlOffsetX * Math.tan(topAngle);
          const trOffsetX = tr / Math.tan((Math.PI / 2 - topAngle) / 2);
          const trOffsetY = trOffsetX * Math.tan(topAngle);

          const blOffsetX = bl / Math.tan((Math.PI / 2 - bottomAngle) / 2);
          const blOffsetY = blOffsetX * Math.tan(bottomAngle);
          const brOffsetX = br / Math.tan((Math.PI / 2 + bottomAngle) / 2);
          const brOffsetY = brOffsetX * Math.tan(bottomAngle);

          // Pontos de tangência nas linhas inclinadas
          const p1 = { x: leftX + tlOffsetX, y: leftTopY + tlOffsetY }; // Tangente superior esquerda
          const p2 = { x: rightX - trOffsetX, y: rightTopY - trOffsetY }; // Tangente superior direita
          const p5 = { x: rightX - brOffsetX, y: rightBottomY - brOffsetY }; // Tangente inferior direita
          const p6 = { x: leftX + blOffsetX, y: leftBottomY + blOffsetY }; // Tangente inferior esquerda

          // Pontos de tangência nas linhas verticais, calculados a partir do vértice e da distância de tangência 'd' (que é o offsetX)
          const p3 = { x: rightX, y: rightTopY - trOffsetX }; // Tangente na linha vertical superior direita
          const p4 = { x: rightX, y: rightBottomY + brOffsetX }; // Tangente na linha vertical inferior direita
          const p7 = { x: leftX, y: leftBottomY + blOffsetX }; // Tangente na linha vertical inferior esquerda
          const p8 = { x: leftX, y: leftTopY - tlOffsetX }; // Tangente na linha vertical superior esquerda

          // Construir o caminho
          let pathData = `M ${p1.x} ${p1.y} `; // Início na tangente superior esquerda
          pathData += `L ${p2.x} ${p2.y} `; // 1. Linha superior

          if (tr > 0) pathData += `A ${tr} ${tr} 0 0 0 ${p3.x} ${p3.y} `; // 2. Canto superior direito
          pathData += `L ${p4.x} ${p4.y} `; // 3. Linha direita

          if (br > 0) pathData += `A ${br} ${br} 0 0 0 ${p5.x} ${p5.y} `; // 4. Canto inferior direito
          pathData += `L ${p6.x} ${p6.y} `; // 5. Linha inferior

          if (bl > 0) pathData += `A ${bl} ${bl} 0 0 0 ${p7.x} ${p7.y} `; // 6. Canto inferior esquerdo
          pathData += `L ${p8.x} ${p8.y} `; // 7. Linha esquerda

          if (tl > 0) pathData += `A ${tl} ${tl} 0 0 0 ${p1.x} ${p1.y} `; // 8. Canto superior esquerdo

          pathData += 'Z'; // Fechar o caminho

          return (
            <Path
              key={id}
              data={pathData}
              fill={fill}
              stroke={selectedShape === id ? 'blue' : colors.greyFont}
              strokeWidth={selectedShape === id ? strokeWidth * 2 : strokeWidth}
              opacity={shape.opacity}
              onClick={() => handleShapeClick(id)}
            />
          );
        }
        return null;
      })}
      <Line
        points={points.flatMap((p) => [p.x, -p.y])}
        stroke={colors.orangeDark}
        strokeWidth={strokeWidth}
      />
      {points.map((point) => (
        <Circle
          key={point.id}
          x={point.x}
          y={-point.y}
          radius={zoomLevel <= 4 ? point.radius / 2 : point.radius / zoomLevel}
          fill={point.fill}
          stroke={selectedShape === point.id ? 'blue' : colors.greyFont}
          strokeWidth={
            selectedShape === point.id ? strokeWidth * 2 : strokeWidth
          }
          onClick={() => handleShapeClick(point.id)}
        />
      ))}
    </>
  );
}

/**
 * Aplica um chanfro em um vértice de um polígono fechado.
 *
 * Interpretação do ângulo:
 * - angleDeg é o ângulo da aresta do chanfro em relação à aresta VERTICAL do lado aplicado.
 *   Isso garante a mesma inclinação no topo e no fundo de um mesmo lado (left/right),
 *   mesmo quando as arestas superior/inferior são inclinadas (trapézio).
 *
 * Comprimento:
 * - length é o comprimento do segmento chanfrado (distância entre os dois novos pontos).
 *
 * Detalhes:
 * - Calcula os deslocamentos ao longo das arestas adjacentes (s1, s2) usando seno/cosseno (via produto vetorial)
 *   para que o segmento resultante tenha direção e comprimento desejados.
 */
