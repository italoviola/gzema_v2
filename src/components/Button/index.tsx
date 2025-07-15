/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

import { ButtonProps } from './interface';
import { StyledButton } from './style';

const Button: React.FC<ButtonProps> = ({
  type = 'button',
  onClick,
  children,
  color,
  bgColor,
  borderColor = 'transparent',
  padding = '12px',
  ...rest
}) => (
  <StyledButton
    type={type}
    color={color}
    bgColor={bgColor}
    borderColor={borderColor}
    onClick={onClick}
    padding={padding}
    {...rest}
  >
    {children}
  </StyledButton>
);

export default Button;
