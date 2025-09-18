import styled from 'styled-components';
import Button from 'components/Button';
import { colors, measures, rulerColors } from 'styles/global.styles';

export const Container = styled.div`
  width: 100%;
  min-height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-flow: column nowrap;
`;

export const ChartContainer = styled.div`
  display: grid;
  grid-template-columns: 30px 1fr;
  grid-template-rows: 30px 1fr;
  width: 100%;
  height: 100%;
  margin-bottom: ${measures.gutter};
`;

export const CornerBox = styled.div`
  background-color: ${rulerColors.background};
  border-right: 1px dashed ${colors.greyDark};
  border-bottom: 1px dashed ${colors.greyDark};
`;

export const RulerContainer = styled.div`
  position: relative;
  background-color: ${rulerColors.background};
`;

export const StageContainer = styled.div`
  grid-column: 2;
  grid-row: 2;
  position: relative;
`;

export const SliderContainer = styled.div`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 8px;
  padding: 12px 8px;
  transition: opacity 0.2s ease;
  opacity: 0.5;

  &:hover {
    opacity: 1;
  }
`;

export const CrosshairContainer = styled.div`
  position: relative;
`;

export const Crosshair = styled.div`
  width: 12px;
  height: 12px;
  pointer-events: none;

  &::before,
  &::after {
    content: '';
    position: absolute;
    background-color: ${colors.blue};
  }

  /* Vertical line */
  &::before {
    left: 50%;
    top: 0;
    width: 2px;
    height: 100%;
    transform: translateX(-50%);
    opacity: 0.2;
  }

  /* Horizontal line */
  &::after {
    top: 50%;
    left: 0;
    width: 100%;
    height: 2px;
    transform: translateY(-50%);
    opacity: 0.2;
  }
`;

export const ControlsContainer = styled.div<{ isFullScreen?: boolean }>`
  position: absolute;
  bottom: ${({ isFullScreen }) => (isFullScreen ? '66px' : '16px')};
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  display: flex;
  gap: 8px;
`;

export const SButton = styled(Button)`
  width: 50px;
  height: 35px;
  opacity: 0.5;
  padding: 0;
  font-size: 22px;
`;

export const TopLeftControls = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 10;
`;

export const TopLeftControlsBtn = styled(Button)`
  box-sizing: border-box;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
`;

export const FullScreenModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: white;
  z-index: 1000;
  display: flex;
  flex-direction: column;
`;

export const FullScreenHeader = styled.div`
  padding: 10px 20px;
  display: flex;
  justify-content: flex-end;
  border-bottom: 1px solid ${colors.grey};
`;

export const FullScreenContent = styled.div`
  position: relative;
  width: 100vw;
  height: calc(100vh - 50px);
  display: grid;
  grid-template-columns: 30px 1fr;
  grid-template-rows: 30px 1fr;
  background: #fff;
  overflow: hidden;
`;

export const CenteredElement = styled.div<{ isFullScreen?: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  /* Aqui usamos a prop para ajustar o centro */
  transform: ${({ isFullScreen }) =>
    isFullScreen
      ? 'translate(-50%, calc(-50% - 25px))'
      : 'translate(-50%, -50%)'};
  pointer-events: none;
  z-index: 10;
`;
