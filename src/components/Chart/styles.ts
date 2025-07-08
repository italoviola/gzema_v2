import styled from 'styled-components';
import { colors, rulerColors } from 'styles/global.styles';

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

export const CrosshairContainer = styled.div`
  position: relative;
`;

export const Crosshair = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 12px;
  transform: translate(-50%, -50%);
  pointer-events: none; /* make sure it doesn't interfere with chart interactions */

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

export const SliderContainer = styled.div`
  grid-column: 1 / 3;
  grid-row: 3;
`;
