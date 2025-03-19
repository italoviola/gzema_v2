import React from 'react';

import TabMenu from 'components/TabMenu';
import useRelatedTools from 'hooks/useRelatedTools';

import { Container } from './styles';

const GrindingData: React.FC = () => {
  const dressingToolNames = useRelatedTools();

  const tabItems = Object.entries(dressingToolNames).map(
    ([toolKey, toolNames]) => ({
      label: toolKey,
      content: (
        <ul>
          {toolNames.map((name) => (
            <li>{name}</li>
          ))}
        </ul>
      ),
    }),
  );

  return (
    <Container>
      <TabMenu items={tabItems} />
    </Container>
  );
};

export default GrindingData;
