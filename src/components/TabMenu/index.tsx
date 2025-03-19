import React, { useState } from 'react';
import { TabMenuProps } from './interface';
import { Container, TabMenuContainer, Tab, TabContent } from './styles';

const TabMenu: React.FC<TabMenuProps> = ({ items }) => {
  const [activeTab, setActiveTab] = useState(0);

  const renderTabContent = () => {
    return items[activeTab]?.content || null;
  };

  return (
    <Container>
      <TabMenuContainer>
        {items.map((item, index) => (
          <Tab active={activeTab === index} onClick={() => setActiveTab(index)}>
            {item.label}
          </Tab>
        ))}
      </TabMenuContainer>
      <TabContent>{renderTabContent()}</TabContent>
    </Container>
  );
};

export default TabMenu;
