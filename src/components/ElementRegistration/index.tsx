import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import ItemList from 'components/ItemList';
import ElementForm from 'components/ElementForm';
import Icon from 'components/Icon';
import DescriptionText from 'components/DescriptionText';

import { Item } from 'components/ItemList/interface';
import { ElementItem, Elements } from 'types/element';

import { colors } from 'styles/global.styles';
import {
  Container,
  ContentLeft,
  ContentRight,
  ItemListContainer,
  SButton,
} from './style';

const ElementRegistration: React.FC = () => {
  const elements = useSelector(
    (state: { elements: Elements }) => state.elements,
  );
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // convert Item to ItemList format
  const menuItems: Item[] = elements.map((element: ElementItem) => ({
    id: element.id,
    label: element.label,
  }));

  const handleSelectItem = (item: Item) => {
    if (selectedItem?.id === item.id) {
      setSelectedItem(null);
      setIsAddingNew(false);
    } else {
      setSelectedItem(item);
      setIsAddingNew(false);
    }
  };

  const handleAddClick = () => {
    setSelectedItem(null);
    setIsAddingNew(true);
  };

  const handleCloseForm = () => {
    setIsAddingNew(false);
    setSelectedItem(null);
  };

  const selectedElement = selectedItem
    ? elements.find((element: ElementItem) => element.id === selectedItem.id)
    : null;

  return (
    <Container>
      <ContentLeft>
        <SButton
          color={colors.white}
          bgColor={colors.green}
          onClick={handleAddClick}
        >
          <Icon className="icon-add" color={colors.white} fontSize="24px" />
          Adicionar
        </SButton>
        <ItemListContainer>
          <ItemList
            items={menuItems}
            onSelectItem={handleSelectItem}
            selectedItemId={selectedItem?.id}
          />
        </ItemListContainer>
      </ContentLeft>
      <ContentRight>
        {isAddingNew && <ElementForm isNew onClose={handleCloseForm} />}
        {!isAddingNew && selectedElement && (
          <ElementForm element={selectedElement} onClose={handleCloseForm} />
        )}
        {!isAddingNew && !selectedElement && (
          <DescriptionText>
            Selecione um item para editar ou clique em &quot;Adicionar&quot;
            para criar um novo
          </DescriptionText>
        )}
      </ContentRight>
    </Container>
  );
};

export default ElementRegistration;
