import React, { useEffect, useState } from 'react';

import bg from '../../../assets/images/machine.jpg';
import { Container, Content, Text } from './styles';

const OffPage: React.FC = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <Container className={loaded ? 'loaded' : ''}>
      <Content>
        <img src={bg} alt="Background" />
      </Content>
      <Text>© 2025 Zema. All rights reserved. Version: 1.4.1 Build: 0007</Text>
    </Container>
  );
};

export default OffPage;
