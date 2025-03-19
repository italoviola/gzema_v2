import React, { useEffect } from 'react';

import TabMenu from 'components/TabMenu';

import useFormattedTools from 'hooks/useFormattedTools';
import useFormattedDressingTools from 'hooks/useFormattedDressingTools';

import { TabMenuProps } from 'components/TabMenu/interface';

import { Container } from './styles';

const GrindingData: React.FC = () => {
  const formattedTools = useFormattedTools();
  const fDressingTools = useFormattedDressingTools();

  useEffect(() => {
    console.log(fDressingTools);
  }, [fDressingTools]);

  const tabItems = formattedTools.map((tool) => ({
    label: tool.label,
    content: <div>{tool.label}</div>,
  })) as TabMenuProps['items'];

  return (
    <Container>
      <TabMenu items={tabItems} />
    </Container>
  );
};

export default GrindingData;
