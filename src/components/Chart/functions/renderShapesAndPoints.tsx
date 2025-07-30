import { Line, Rect, Circle, Path } from 'react-konva';
import { ElementItem } from 'types/element';

/**
 * Converte elementos do state para o formato de polígonos renderizáveis
 * Considerando leftDiameter e rightDiameter como redução na altura dos lados
 */
export function convertElementsToPolygons(
  elements: ElementItem[],
  defaultColor: string,
  defaultOpacity: number = 0.9,
): any[] {
  return elements.map((element) => {
    // Calculando os pontos do polígono a partir do centro e dimensões
    const halfWidth = element.width / 2;

    // Calculando as alturas ajustadas para os lados esquerdo e direito
    // Se leftDiameter for 30, a altura do lado esquerdo será height - 30
    const leftSideHeight = element.height - (element.leftDiameter || 0);
    const rightSideHeight = element.height - (element.rightDiameter || 0);

    // Metade das alturas ajustadas para posicionar corretamente os pontos
    const leftHalfHeight = leftSideHeight / 2;
    const rightHalfHeight = rightSideHeight / 2;

    // Os 4 pontos do polígono, ajustados de acordo com os diâmetros
    // [x1, y1, x2, y2, x3, y3, x4, y4] onde:
    // (x1,y1) é o canto superior esquerdo
    // (x2,y2) é o canto superior direito
    // (x3,y3) é o canto inferior direito
    // (x4,y4) é o canto inferior esquerdo
    const points = [
      element.xaxis - halfWidth,
      element.zaxis - leftHalfHeight, // superior esquerdo (com altura ajustada)
      element.xaxis + halfWidth,
      element.zaxis - rightHalfHeight, // superior direito (com altura ajustada)
      element.xaxis + halfWidth,
      element.zaxis + rightHalfHeight, // inferior direito (com altura ajustada)
      element.xaxis - halfWidth,
      element.zaxis + leftHalfHeight, // inferior esquerdo (com altura ajustada)
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
  shapes,
  points,
  elements,
  selectedShape,
  strokeWidth,
  colors,
  handleShapeClick,
  zoomLevel,
}: {
  shapes: any[];
  points: any[];
  elements?: ElementItem[]; // Parâmetro opcional para elementos do state
  selectedShape: string | null;
  strokeWidth: number;
  colors: any;
  handleShapeClick: (id: string) => void;
  zoomLevel: number;
}) {
  // Converte elementos do state para shapes, se fornecidos
  const elementShapes = elements
    ? convertElementsToPolygons(elements, colors.silver)
    : [];

  // Combina os shapes predefinidos com os shapes dos elementos
  const allShapes = [...shapes, ...elementShapes];

  return (
    <>
      {allShapes.map((shape) => {
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
