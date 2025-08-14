import { Line, Rect, Circle, Path } from 'react-konva';
import { ElementItem, ElementItems } from 'types/element';

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
