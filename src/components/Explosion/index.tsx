import React from 'react';
import styled, { keyframes } from 'styled-components';

const scaleUpDown = keyframes`
  from {
    transform: scale(1.5);
    opacity: 1;
  }
  to {
    transform: scale(1);
    opacity: 0.8;
  }
`;

const ExplosionContent = styled.div`
  font-size: 16px;
  animation: ${scaleUpDown} 0.1s;
`;

const Explosion: React.FC = () => {
  return <ExplosionContent>💥</ExplosionContent>;
};

export default Explosion;
