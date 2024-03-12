import React from 'react';
import { Link } from 'react-router-dom';

import Breadcrumbs from 'components/Breadcrumbs';

import { Container } from './style';

const Diam: React.FC = () => {
  return (
    <Container>
      <Breadcrumbs />
      <Link to="/">asdas</Link>
    </Container>
  );
};

export default Diam;
