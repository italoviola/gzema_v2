import React from 'react';

import { ButtonProps } from './interface';
import { StyledButton } from './style';

// Use this component on other components Later (after Demo)
const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  color,
  bgColor,
  borderColor = 'transparent',
}) => (
  <StyledButton
    color={color}
    bgColor={bgColor}
    borderColor={borderColor}
    onClick={onClick}
  >
    {children}
  </StyledButton>
);

export default Button;