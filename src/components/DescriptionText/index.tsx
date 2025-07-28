import React, { ReactNode } from 'react';
import { Container } from './style';

interface DescriptionTextProps {
  children: ReactNode;
}

const DescriptionText: React.FC<DescriptionTextProps> = ({ children }) => {
  return <Container>{children}</Container>;
};

export default DescriptionText;
