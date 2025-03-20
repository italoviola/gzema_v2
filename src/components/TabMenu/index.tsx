import React, { useState } from 'react';

import { colors } from 'styles/global.styles';

import { TabMenuProps } from './interface';

import { Container, TabMenuContainer, Tab, SContentBlock } from './styles';

const TabMenu: React.FC<TabMenuProps> = ({ items }) => {
  const [activeTab, setActiveTab] = useState(0);

  const renderTabContent = () => {
    return items[activeTab]?.content || null;
  };

  return (
    <Container>
      <TabMenuContainer>
        {items.map((item, index) => (
          <Tab
            onClick={() => setActiveTab(index)}
            color={activeTab === index ? colors.blue : colors.white}
            bgColor={activeTab === index ? colors.grey : colors.blue}
          >
            {item.label}
          </Tab>
        ))}
      </TabMenuContainer>
      <SContentBlock>{renderTabContent()}</SContentBlock>
    </Container>
  );
};

export default TabMenu;
