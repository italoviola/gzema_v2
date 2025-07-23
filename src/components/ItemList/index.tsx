import React, { useState } from 'react';

import { Container, ListItem } from './style';

export interface Item {
  id: string | number;
  label: string;
}

interface ItemListProps {
  items: Item[];
  onSelectItem?: (item: Item) => void;
  selectedItemId?: string | number;
}

const ItemList: React.FC<ItemListProps> = ({
  items,
  onSelectItem,
  selectedItemId,
}) => {
  const [selectedId, setSelectedId] = useState<string | number | undefined>(
    selectedItemId,
  );

  const handleSelectItem = (item: Item) => {
    setSelectedId(item.id);
    if (onSelectItem) {
      onSelectItem(item);
    }
  };

  return (
    <Container>
      {items.map((item, index) => (
        <ListItem
          key={item.id}
          isSelected={selectedId === item.id}
          onClick={() => handleSelectItem(item)}
        >
          <span className="item-number">{index + 1}</span>
          <span className="item-label">{item.label}</span>
        </ListItem>
      ))}
    </Container>
  );
};

ItemList.defaultProps = {
  selectedItemId: undefined,
  onSelectItem: undefined,
};

export default ItemList;
