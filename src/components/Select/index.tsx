import React, { ChangeEvent } from 'react';

import { SelectComponentProps } from './interface';
import { Label, Container, SSelect } from './style';

const SelectComponent: React.FC<SelectComponentProps> = ({
  label,
  name,
  options,
  onChange,
  value,
  disabled = false,
  className,
}) => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event);
  };

  return (
    <Container className={className}>
      {label && <Label>{label}:</Label>}
      <SSelect
        name={name}
        value={value}
        onChange={handleChange}
        disabled={disabled}
      >
        {options.map((option) => {
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </SSelect>
    </Container>
  );
};

export default SelectComponent;
