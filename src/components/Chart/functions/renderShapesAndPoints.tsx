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
          const {
            x = 0,
            y = 0,
            width = 0,
            height = 0,
            fill,
            cornerRadius = [0, 0, 0, 0],
          } = shape;
          const [tl, tr, br, bl] = cornerRadius ?? [0, 0, 0, 0];

          // Invertemos o y para lidar com o sistema de coordenadas do Konva
          const invertedY = -y;

          // PathData para cantos convexos (estilo border-radius)
          const pathData = `
            M ${x + tl}, ${invertedY}
            L ${x + width - tr}, ${invertedY}
            Q ${x + width}, ${invertedY} ${x + width}, ${invertedY - tr}
            L ${x + width}, ${invertedY - height + br}
            Q ${x + width}, ${invertedY - height} ${x + width - br}, ${
              invertedY - height
            }
            L ${x + bl}, ${invertedY - height}
            Q ${x}, ${invertedY - height} ${x}, ${invertedY - height + bl}
            L ${x}, ${invertedY - tl}
            Q ${x}, ${invertedY} ${x + tl}, ${invertedY}
            Z
          `;

          return (
            <Path
              key={shape.id}
              data={pathData}
              fill={fill}
              stroke={selectedShape === shape.id ? 'blue' : colors.greyFont}
              strokeWidth={
                selectedShape === shape.id ? strokeWidth * 2 : strokeWidth
              }
              opacity={shape.opacity}
              onClick={() => handleShapeClick(shape.id)}
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
