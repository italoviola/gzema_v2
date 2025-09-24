import React from 'react';
import styled from 'styled-components';
import { colors } from 'styles/global.styles';

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const VerticalInput = styled.input`
  writing-mode: bt-lr; /* IE */
  -webkit-appearance: slider-vertical; /* WebKit */
  appearance: slider-vertical;
  width: 20px;
  height: 150px;
  background: transparent;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${colors.blue};
    cursor: pointer;
    border: 2px solid ${colors.white};
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: ${colors.blue};
    cursor: pointer;
    border: 2px solid ${colors.white};
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
`;

const ValueDisplay = styled.div`
  font-size: 14px;
  color: ${colors.greyDark};
  text-align: center;
  font-weight: 500;
  min-width: 40px;
  white-space: nowrap;
`;

interface VerticalSliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  valueFormatter: (value: number) => string;
}

const VerticalSlider: React.FC<VerticalSliderProps> = ({
  value,
  min,
  max,
  step = 1,
  onChange,
  valueFormatter,
}) => {
  return (
    <SliderContainer>
      <ValueDisplay>
        {valueFormatter ? valueFormatter(value) : value}
      </ValueDisplay>
      <VerticalInput
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </SliderContainer>
  );
};

export default VerticalSlider;
