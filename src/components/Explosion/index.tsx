import React from 'react';
import styled, { keyframes } from 'styled-components';

const scaleUpDown = keyframes`
  from {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 1;
  }
  to {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.8;
  }
`;

const ExplosionContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 16px;
  pointer-events: none;
  animation: ${scaleUpDown} 0.1s;
`;

const Explosion: React.FC = () => {
  return <ExplosionContainer>💥</ExplosionContainer>;
};

export default Explosion;
