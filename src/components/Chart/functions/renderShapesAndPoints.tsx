import { Line, Rect, Circle, Path } from 'react-konva';
import { ElementItem, ElementItems } from 'types/element';

export function convertElementsToPolygons(
  elementItems: ElementItems,
  defaultColor: string,
  defaultOpacity: number = 0.9,
): any[] {
  return elementItems.map((element: ElementItem) => {
    // Calculando as metades das alturas para posicionar acima/abaixo do zaxis
    const leftHalfHeight = element.leftDiameter / 2;
    const rightHalfHeight = element.rightDiameter / 2;

    // Os 4 pontos do polígono usando as novas propriedades
    // [x1, y1, x2, y2, x3, y3, x4, y4] onde:
    // (x1,y1) é o canto superior esquerdo
    // (x2,y2) é o canto superior direito
    // (x3,y3) é o canto inferior direito
    // (x4,y4) é o canto inferior esquerdo
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

          const pathData = `
            M ${x + tl}, ${y}
            L ${x + width - tr}, ${y}
            Q ${x + width - tr}, ${y + tr} ${x + width}, ${y + tr}
            L ${x + width}, ${y + height - br}
            Q ${x + width - br}, ${y + height - br} ${x + width - br}, ${
              y + height
            }
            L ${x + bl}, ${y + height}
            Q ${x + bl}, ${y + height - bl} ${x}, ${y + height - bl}
            L ${x}, ${y + tl}
            Q ${x + tl}, ${y + tl} ${x + tl}, ${y}
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
