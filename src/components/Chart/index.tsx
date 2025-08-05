import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Stage, Layer } from 'react-konva';

import { useExplosionEasterEgg } from 'hooks/useExplosionEasterEgg';

import CartesianGrid from 'components/CartesianGrid';
import CustomSlider from 'components/CustomSlider';
import Ruler from 'components/Ruler';
import Explosion from 'components/Explosion';
import { renderShapesAndPoints } from 'components/Chart/functions/renderShapesAndPoints';

import { Elements } from 'types/element';
import { colors } from 'styles/global.styles';
import {
  ChartContainer,
  CornerBox,
  RulerContainer,
  StageContainer,
  SliderContainer,
  Crosshair,
  ControlsContainer,
  SButton,
} from './styles';
import { points } from './shapesAndPoints';

const ZOOM_STEPS = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096];

const getZoomIndex = (zoom: number) => ZOOM_STEPS.indexOf(zoom);

const Chart: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const elements = useSelector(
    (state: { elements: Elements }) => state.elements,
  );
  const [stageSize] = useState({ width: 872, height: 200 }); // width: 902 - 30 (ruler width), height: 484 - 40 (slider height) - 30 (ruler height)
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });
  const [strokeWidth, setStrokeWidth] = useState(1);

  const { showExplosion, handleContextMenu } = useExplosionEasterEgg({
    isEnabled: true, // toogle easter egg, we can define later the condition to enable it
  });

  const RULER_SIZE = 30;

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

  const handleZoomIn = () => {
    const currentIndex = getZoomIndex(zoomLevel);
    const newIndex = Math.min(currentIndex + 1, ZOOM_STEPS.length - 1);
    if (newIndex !== currentIndex) {
      handleZoomSlider(newIndex);
    }
  };

  const handleZoomOut = () => {
    const currentIndex = getZoomIndex(zoomLevel);
    const newIndex = Math.max(currentIndex - 1, 0);
    if (newIndex !== currentIndex) {
      handleZoomSlider(newIndex);
    }
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
    <ChartContainer ref={containerRef}>
      <CornerBox />
      <RulerContainer style={{ gridColumn: 2, gridRow: 1 }}>
        <Ruler
          orientation="horizontal"
          width={stageSize.width}
          height={RULER_SIZE}
          zoomLevel={zoomLevel}
          stagePosition={stagePosition}
        />
      </RulerContainer>
      <RulerContainer style={{ gridColumn: 1, gridRow: 2 }}>
        <Ruler
          orientation="vertical"
          width={RULER_SIZE}
          height={stageSize.height}
          zoomLevel={zoomLevel}
          stagePosition={stagePosition}
        />
      </RulerContainer>
      <StageContainer>
        <Stage
          width={stageSize.width}
          height={stageSize.height}
          draggable
          scaleX={zoomLevel}
          scaleY={zoomLevel}
          x={stagePosition.x}
          y={stagePosition.y}
          offsetX={0}
          offsetY={0}
          onDragMove={handleDragMove}
          onContextMenu={handleContextMenu}
          style={{
            border: `1px solid ${colors.greyMedium}`,
            background: 'white',
          }}
        >
          <Layer>{cartesianGrid}</Layer>
          <Layer>
            {renderShapesAndPoints({
              points,
              elements,
              selectedShape,
              strokeWidth,
              colors,
              handleShapeClick,
              zoomLevel,
            })}
          </Layer>
        </Stage>
        {showExplosion ? <Explosion /> : <Crosshair />}
        <ControlsContainer>
          <SButton
            onClick={handleZoomOut}
            color={colors.white}
            bgColor={colors.blueLight}
            borderColor={colors.blue}
          >
            -
          </SButton>
          <SButton
            onClick={handleZoomIn}
            color={colors.white}
            bgColor={colors.blueLight}
            borderColor={colors.blue}
          >
            +
          </SButton>
        </ControlsContainer>
      </StageContainer>
      <SliderContainer>
        <CustomSlider
          value={getZoomIndex(zoomLevel)}
          min={0}
          max={ZOOM_STEPS.length - 1}
          step={1}
          label=""
          height={40}
          onChange={handleZoomSlider}
          valueFormatter={(idx) => `${ZOOM_STEPS[idx]}x`}
        />
      </SliderContainer>
    </ChartContainer>
  );
};

export default Chart;
