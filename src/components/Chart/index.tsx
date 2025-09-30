import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Stage, Layer } from 'react-konva';

import { useExplosionEasterEgg } from 'hooks/useExplosionEasterEgg';
import { selectElement, deselectElement } from 'state/app/appSlice';

import CartesianGrid from 'components/CartesianGrid';
import VerticalSlider from 'components/VerticalSlider';
import Ruler from 'components/Ruler';
import Explosion from 'components/Explosion';
import Icon from 'components/Icon';

import { renderShapesAndPoints } from 'components/Chart/functions/renderShapesAndPoints';
import { CloseButton } from 'components/Modal/style';
import { MAX_RECT_LEN_DEFAULT, MAX_RECT_DIAM_DEFAULT } from 'utils/constants';

import { App } from 'types/app';
import { ElementItem, ElementItems, ContourItem } from 'types/part';

import { colors } from 'styles/global.styles';
import { StyledIcon } from 'components/SideMenu/styles';
import { ChartProps } from './interface';
import {
  ChartContainer,
  CornerBox,
  RulerContainer,
  StageContainer,
  SliderContainer,
  Crosshair,
  ControlsContainer,
  SButton,
  FullScreenModal,
  FullScreenHeader,
  FullScreenContent,
  TopLeftControls,
  TopLeftControlsBtn,
  CenteredElement,
} from './styles';

const ZOOM_STEPS = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096];

const clamp = (v: number, min: number, max: number) => {
  if (v < min) return min;
  if (v > max) return max;
  return v;
};

const getZoomIndex = (zoom: number) => ZOOM_STEPS.indexOf(zoom);

const Chart: React.FC<ChartProps> = ({
  points,
  focusedPointId,
  worldLimitX = MAX_RECT_LEN_DEFAULT,
  worldLimitY = MAX_RECT_DIAM_DEFAULT,
}) => {
  const dispatch = useDispatch();
  const containerRef = useRef<HTMLDivElement>(null);

  const elements = useSelector(
    (state: { part: { elements: ElementItems } }) => state.part.elements,
  );
  const contours = useSelector(
    (state: { part: { contours: ContourItem[] } }) => state.part.contours,
  );
  const selectedElementId = useSelector(
    (state: { app: App }) => state.app.selectedElementId,
  );

  const [stageSize] = useState({ width: 872, height: 200 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [stagePosition, setStagePosition] = useState({ x: 0, y: 0 });
  const [strokeWidth, setStrokeWidth] = useState(1);
  const [showAllContourPoints, setShowAllContourPoints] =
    useState<boolean>(false);
  const [allContourPoints, setAllContourPoints] = useState<any[]>([]);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  const { showExplosion, handleContextMenu } = useExplosionEasterEgg({
    isEnabled: true,
  });

  const RULER_SIZE = 30;
  const HEADER_SIZE = 51; // Altura do header em modo fullscreen

  const getFullScreenStageSize = () => {
    if (typeof window === 'undefined') return { width: 1024, height: 768 };
    return {
      width: window.innerWidth,
      height: window.innerHeight - HEADER_SIZE, // Subtrair a altura do header
    };
  };

  const [fullScreenSize, setFullScreenSize] = useState(
    getFullScreenStageSize(),
  );

  // obtain the current dimensions of the stage
  const getCurrentStageDimensions = useCallback(() => {
    if (isFullScreen) {
      return {
        width: fullScreenSize.width - RULER_SIZE,
        height: fullScreenSize.height - RULER_SIZE,
      };
    }
    return {
      width: stageSize.width,
      height: stageSize.height,
    };
  }, [isFullScreen, fullScreenSize, stageSize, RULER_SIZE]);

  // calcuate navigation limits (corrigido para considerar tamanho do Stage)
  const getNavigationLimits = useCallback(
    (currentZoom: number = zoomLevel) => {
      const { width: currentWidth, height: currentHeight } =
        getCurrentStageDimensions();

      // Fórmulas derivadas:
      // visibleMinX = (-stage.x)/zoom  >= -worldLimitX
      // visibleMaxX = (currentWidth - stage.x)/zoom <=  worldLimitX
      // =>
      // stage.x <=  worldLimitX * zoom
      // stage.x >=  currentWidth - worldLimitX * zoom
      let minX = currentWidth - worldLimitX * currentZoom;
      let maxX = worldLimitX * currentZoom;

      let minY = currentHeight - worldLimitY * currentZoom;
      let maxY = worldLimitY * currentZoom;

      // Se o Stage for grande demais (intervalo invertido), centraliza.
      if (minX > maxX) {
        const cx = (minX + maxX) / 2;
        minX = cx;
        maxX = cx;
      }
      if (minY > maxY) {
        const cy = (minY + maxY) / 2;
        minY = cy;
        maxY = cy;
      }

      return {
        minX,
        maxX,
        minY,
        maxY,
        currentWidth,
        currentHeight,
      };
    },
    [getCurrentStageDimensions, worldLimitX, worldLimitY, zoomLevel],
  );

  useEffect(() => {
    const handleResize = () => {
      if (isFullScreen) {
        setFullScreenSize(getFullScreenStageSize());
      }
    };
    if (isFullScreen) {
      window.addEventListener('resize', handleResize);
    }
    return () => {
      if (isFullScreen) {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, [isFullScreen]);

  const fullChartWidth = fullScreenSize.width - RULER_SIZE;
  const fullChartHeight = fullScreenSize.height - RULER_SIZE;

  // extract all contour points
  useEffect(() => {
    if (showAllContourPoints) {
      const newPoints: any[] = [];

      contours.forEach((contour) => {
        contour.activities.forEach((activity, activityIndex) => {
          // check if the activity has X and Z parameters
          const hasX = activity.actionParams.some((param) => param.id === 'X');
          const hasZ = activity.actionParams.some((param) => param.id === 'Z');

          if (hasX && hasZ) {
            const xValue = (activity as any).adtParamX;
            const zValue = (activity as any).adtParamZ;

            // if we have valid values for X and Z, we create a point
            if (
              xValue &&
              zValue &&
              !Number.isNaN(Number(xValue)) &&
              !Number.isNaN(Number(zValue))
            ) {
              newPoints.push({
                id: `point-${contour.id}-${activityIndex}`,
                x: Number(zValue), // Z is mapped for X (horizontal)
                y: Number(xValue), // X is mapped for Y (vertical)
                radius: 6,
                fill: colors.orangeDark,
              });
            }
          }
        });
      });

      setAllContourPoints(newPoints);
    }
  }, [contours, showAllContourPoints]);

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
    let newX = stage.x();
    let newY = stage.y();

    const { minX, maxX, minY, maxY } = getNavigationLimits();

    newX = clamp(newX, minX, maxX);
    newY = clamp(newY, minY, maxY);

    stage.x(newX);
    stage.y(newY);

    setStagePosition({ x: newX, y: newY });
  };

  const handleShapeClick = (id: string) => {
    const clickedElement: ElementItem | undefined = elements.find(
      (element: ElementItem) => element.id === id,
    );

    if (clickedElement) {
      if (selectedElementId === id) dispatch(deselectElement());
      else dispatch(selectElement(id));
    }
  };

  const handleZoomSlider = (idx: number) => {
    const prevZoom = zoomLevel;
    const newZoom = ZOOM_STEPS[idx];

    const { currentWidth, currentHeight } = getNavigationLimits(newZoom);

    // Mantém o centro visível em coordenadas de mundo
    const centerWorld = {
      x: (currentWidth / 2 - stagePosition.x) / prevZoom,
      y: (currentHeight / 2 - stagePosition.y) / prevZoom,
    };

    let newStagePosition = {
      x: currentWidth / 2 - centerWorld.x * newZoom,
      y: currentHeight / 2 - centerWorld.y * newZoom,
    };

    // Clamp após calcular nova posição
    const { minX, maxX, minY, maxY } = getNavigationLimits(newZoom);
    newStagePosition = {
      x: clamp(newStagePosition.x, minX, maxX),
      y: clamp(newStagePosition.y, minY, maxY),
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
        stageWidth={
          isFullScreen ? getFullScreenStageSize().width : stageSize.width
        }
        stageHeight={
          isFullScreen ? getFullScreenStageSize().height : stageSize.height
        }
        strokeWidth={strokeWidth}
        getFontSize={getFontSize}
      />
    ),
    [
      zoomLevel,
      stagePosition,
      strokeWidth,
      getFontSize,
      stageSize,
      isFullScreen,
    ],
  );

  // decide which points to render based on the toggle state
  const pointsToRender = showAllContourPoints ? allContourPoints : points || [];

  const renderControls = () => (
    <ControlsContainer isFullScreen={isFullScreen}>
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
  );

  const renderTopLeftControls = () => (
    <TopLeftControls>
      {!isFullScreen && (
        <TopLeftControlsBtn
          type="button"
          onClick={() => setIsFullScreen(true)}
          color={colors.blueLight}
          bgColor={colors.blueLighter}
          borderColor={colors.blueLight}
        >
          <StyledIcon
            className="icon-enlarge2"
            color={colors.blueLight}
            fontSize="18px"
          />
        </TopLeftControlsBtn>
      )}
      <TopLeftControlsBtn
        type="button"
        onClick={() => setShowAllContourPoints(!showAllContourPoints)}
        color={colors.blueLight}
        bgColor={colors.blueLighter}
        borderColor={colors.blueLight}
      >
        <StyledIcon
          className={
            showAllContourPoints ? 'icon-remove_red_eye' : 'icon-visibility_off'
          }
          color={colors.blueLight}
          fontSize="18px"
        />
      </TopLeftControlsBtn>
    </TopLeftControls>
  );

  const renderChartWithControls = (width: number, height: number) => (
    <>
      {renderTopLeftControls()}
      <Stage
        width={width}
        height={height}
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
            points: pointsToRender,
            elementItems: elements,
            selectedShape: selectedElementId,
            strokeWidth,
            colors,
            handleShapeClick,
            zoomLevel,
            focusedPointId,
          })}
        </Layer>
      </Stage>
      {showExplosion ? (
        <CenteredElement isFullScreen={isFullScreen}>
          <Explosion />
        </CenteredElement>
      ) : (
        <CenteredElement isFullScreen={isFullScreen}>
          <Crosshair />
        </CenteredElement>
      )}
      {renderControls()}
      <SliderContainer
        style={isFullScreen ? { marginTop: '-25px' } : undefined}
      >
        <VerticalSlider
          value={getZoomIndex(zoomLevel)}
          min={0}
          max={ZOOM_STEPS.length - 1}
          step={1}
          onChange={handleZoomSlider}
          valueFormatter={(idx) => `${ZOOM_STEPS[idx]}x`}
        />
      </SliderContainer>
    </>
  );

  return (
    <ChartContainer ref={containerRef}>
      {!isFullScreen && (
        <>
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
            {renderChartWithControls(stageSize.width, stageSize.height)}
          </StageContainer>
        </>
      )}

      {isFullScreen && (
        <FullScreenModal>
          <FullScreenHeader>
            <CloseButton onClick={() => setIsFullScreen(false)}>
              <Icon
                className="icon-x"
                color={colors.greyFont}
                fontSize="30px"
              />
            </CloseButton>
          </FullScreenHeader>
          <FullScreenContent>
            <CornerBox />
            <RulerContainer style={{ gridColumn: 2, gridRow: 1 }}>
              <Ruler
                orientation="horizontal"
                width={fullChartWidth}
                height={RULER_SIZE}
                zoomLevel={zoomLevel}
                stagePosition={stagePosition}
              />
            </RulerContainer>
            <RulerContainer style={{ gridColumn: 1, gridRow: 2 }}>
              <Ruler
                orientation="vertical"
                width={RULER_SIZE}
                height={fullChartHeight}
                zoomLevel={zoomLevel}
                stagePosition={stagePosition}
              />
            </RulerContainer>
            <StageContainer style={{ gridColumn: 2, gridRow: 2 }}>
              {renderChartWithControls(fullChartWidth, fullChartHeight)}
            </StageContainer>
          </FullScreenContent>
        </FullScreenModal>
      )}
    </ChartContainer>
  );
};

export default Chart;
