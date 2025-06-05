import React from 'react';
import { colors } from 'styles/global.styles';
import { Container, Spinner } from './styles';

const LoadingSpinner: React.FC<{ color?: string; size?: string }> = ({
  color,
  size,
}) => (
  <Container>
    <Spinner color={color} size={size} />
  </Container>
);

LoadingSpinner.defaultProps = {
  color: colors.white,
  size: '24px',
};

export default LoadingSpinner;
