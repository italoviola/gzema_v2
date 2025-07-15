import { Line, Rect, Circle, Path } from 'react-konva';

export function renderShapesAndPoints({
  shapes,
  points,
  selectedShape,
  strokeWidth,
  colors,
  handleShapeClick,
  zoomLevel,
}: {
  shapes: any[];
  points: any[];
  selectedShape: string | null;
  strokeWidth: number;
  colors: any;
  handleShapeClick: (id: string) => void;
  zoomLevel: number;
}) {
  return (
    <>
      {shapes.map((shape) => {
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
