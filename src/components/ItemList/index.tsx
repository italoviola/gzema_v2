import React from 'react';

import { Container, ListItem } from './style';
import { Item, ItemListProps } from './interface';

const ItemList: React.FC<ItemListProps> = ({
  items,
  onSelectItem,
  selectedItemId,
}) => {
  const handleSelectItem = (item: Item) => {
    if (onSelectItem) {
      onSelectItem(item);
    }
  };

  return (
    <Container>
      {items.map((item, index) => (
        <ListItem
          key={item.id}
          isSelected={selectedItemId === item.id}
          onClick={() => handleSelectItem(item)}
        >
          <span className="item-number">{index + 1}</span>
          <span className="item-label">{item.label}</span>
        </ListItem>
      ))}
    </Container>
  );
};

export default ItemList;
