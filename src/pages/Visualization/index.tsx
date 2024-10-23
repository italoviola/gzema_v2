import React, { useEffect, useState } from 'react';

import Breadcrumbs from 'components/Breadcrumbs';
import Chart from 'components/Chart';
import Chart2 from 'components/Chart2';

import { Container, Content, Title } from './style';

const breadcrumbsItems = [
  {
    label: 'Visualização',
    url: '/visualization',
    isActive: true,
  },
];

const Visualization: React.FC = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <Container className={loaded ? 'loaded' : ''}>
      <Breadcrumbs items={breadcrumbsItems} />
      <Title>Visualização</Title>
      <Content>
        {/* <Chart /> */}
        <Chart2 />
      </Content>
    </Container>
  );
};

export default Visualization;
