import React from 'react';

interface CustomSliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  label: string;
  height: number | string;
  onChange: (value: number) => void;
  valueFormatter: (value: number) => string;
}

const CustomSlider: React.FC<CustomSliderProps> = ({
  value,
  min,
  max,
  step = 1,
  label = '',
  height = 40,
  onChange,
  valueFormatter,
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', height }}>
      {label && <span style={{ marginRight: 12 }}>{label}</span>}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ flex: 1, height }}
      />
      <span style={{ marginLeft: 18, minWidth: 80 }}>
        {valueFormatter ? valueFormatter(value) : value}
      </span>
    </div>
  );
};

export default CustomSlider;
