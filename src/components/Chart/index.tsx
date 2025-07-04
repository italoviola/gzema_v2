import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Stage, Layer, Line, Rect, Circle, Path } from 'react-konva';

import CartesianGrid from 'components/CartesianGrid';
import CustomSlider from 'components/CustomSlider';

import { colors } from 'styles/global.styles';
import { Container } from './styles';
import { shapes, points } from './shapesAndPoints';

const Chart: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize] = useState({ width: 902, height: 484 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });
  const [strokeWidth, setStrokeWidth] = useState(1);

  // useEffect(() => {
  //   function updateSize() {
  //     if (containerRef.current) {
  //       setStageSize({
  //         width: containerRef.current.offsetWidth,
  //         height: containerRef.current.offsetHeight,
  //       });
  //     }
  //   }
  //   updateSize();
  //   window.addEventListener('resize', updateSize);
  //   return () => window.removeEventListener('resize', updateSize);
  // }, []);

  useEffect(() => {
    if (zoomLevel >= 4096) setStrokeWidth(0.0005);
    else if (zoomLevel >= 2048) setStrokeWidth(0.001);
    else if (zoomLevel >= 1024) setStrokeWidth(0.002);
    else if (zoomLevel >= 512) setStrokeWidth(0.0035);
    else if (zoomLevel >= 256) setStrokeWidth(0.009);
    else if (zoomLevel >= 128) setStrokeWidth(0.015);
    else if (zoomLevel >= 64) setStrokeWidth(0.03);
    else if (zoomLevel >= 16) setStrokeWidth(0.05);
    else if (zoomLevel >= 8) setStrokeWidth(0.1);
    else if (zoomLevel >= 4) setStrokeWidth(0.3);
    else if (zoomLevel >= 2) setStrokeWidth(0.3);
    else setStrokeWidth(0.5);
  }, [zoomLevel]);

  const getFontSize = React.useCallback(() => {
    if (zoomLevel >= 2048) return 0.01;
    if (zoomLevel >= 1024) return 0.05;
    if (zoomLevel >= 512) return 0.07;
    if (zoomLevel >= 256) return 0.15;
    if (zoomLevel >= 128) return 0.5;
    if (zoomLevel >= 32) return 0.7;
    if (zoomLevel >= 16) return 1;
    if (zoomLevel >= 8) return 2;
    if (zoomLevel >= 4) return 8;
    if (zoomLevel >= 2) return 8;
    return 14;
  }, [zoomLevel]);

  const handleDragMove = (e: any) => {
    const stage = e.target;
    const newX = stage.x();
    const newY = stage.y();

    // Defina os limites do plano cartesiano com base nas linhas desenhadas
    const minX = -1500 * zoomLevel + 1100; // Limite mínimo no eixo X
    const maxX = 1500 * zoomLevel - 300; // Limite máximo no eixo X
    const minY = -1500 * zoomLevel + 800; // Limite mínimo no eixo Y
    const maxY = 1500 * zoomLevel - 300; // Limite máximo no eixo Y

    // Verifique se a nova posição está dentro dos limites
    if (newX < minX) {
      stage.x(minX);
    } else if (newX > maxX) {
      stage.x(maxX);
    }

    if (newY < minY) {
      stage.y(minY);
    } else if (newY > maxY) {
      stage.y(maxY);
    }

    setStagePosition({
      x: stage.x(),
      y: stage.y(),
    });
  };

  const handleShapeClick = (id: string) => {
    setSelectedShape(id);
  };

  const ZOOM_STEPS = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096];

  const getZoomIndex = (zoom: number) => ZOOM_STEPS.indexOf(zoom);

  const handleZoomSlider = (idx: number) => {
    const prevZoom = zoomLevel;
    const newZoom = ZOOM_STEPS[idx];

    const centerScreen = {
      x: (stageSize.width / 2 - stagePosition.x) / prevZoom,
      y: (stageSize.height / 2 - stagePosition.y) / prevZoom,
    };

    const newStagePosition = {
      x: stageSize.width / 2 - centerScreen.x * newZoom,
      y: stageSize.height / 2 - centerScreen.y * newZoom,
    };

    setZoomLevel(newZoom);
    setStagePosition(newStagePosition);
  };

  const cartesianGrid = useMemo(
    () => (
      <CartesianGrid
        // due to a problem with konva not removing Text elements when zooming out,
        // it was used conditional to zoomLevel to force useMemo to re-render when needed
        key={`grid-${zoomLevel < 512 ? 'low' : 'high'}`}
        zoomLevel={zoomLevel}
        stagePosition={stagePosition}
        stageWidth={stageSize.width}
        stageHeight={stageSize.height}
        strokeWidth={strokeWidth}
        getFontSize={getFontSize}
      />
    ),
    [zoomLevel, stagePosition, strokeWidth, getFontSize, stageSize],
  );

  return (
    <Container ref={containerRef}>
      <Stage
        width={stageSize.width}
        height={stageSize.height - 40} // consiedering the slider height
        draggable
        scaleX={zoomLevel}
        scaleY={zoomLevel}
        x={stagePosition.x}
        y={stagePosition.y}
        offsetX={0}
        offsetY={0}
        onDragMove={handleDragMove}
        style={{ border: '1px solid black' }}
      >
        <Layer>{cartesianGrid}</Layer>
        <Layer>
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
                  points={shape.points?.map((point, i) =>
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
          {points.map((point) => (
            <Circle
              key={point.id}
              x={point.x}
              y={point.y}
              radius={
                zoomLevel <= 4 ? point.radius / 2 : point.radius / zoomLevel
              }
              fill={point.fill}
              stroke={selectedShape === point.id ? 'blue' : colors.greyFont}
              strokeWidth={
                selectedShape === point.id ? strokeWidth * 2 : strokeWidth
              }
              onClick={() => handleShapeClick(point.id)}
            />
          ))}
        </Layer>
      </Stage>
      <CustomSlider
        value={getZoomIndex(zoomLevel)}
        min={0}
        max={ZOOM_STEPS.length - 1}
        step={1}
        label="Zoom"
        height={40}
        onChange={handleZoomSlider}
        valueFormatter={(idx) => `Zoom Level: ${ZOOM_STEPS[idx]}`}
      />
    </Container>
  );
};

export default Chart;
