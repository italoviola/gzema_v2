import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import ItemList, { Item } from 'components/ItemList';
import ElementForm from 'components/ElementForm';

import { Elements } from 'types/element';

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

  // Converter elementos para o formato de Item para o ItemList
  const menuItems: Item[] = elements.map((element) => ({
    id: element.id,
    label: element.label,
  }));

  const handleSelectItem = (item: Item) => {
    setSelectedItem(item);
    setIsAddingNew(false);
    console.log(`Item selecionado: ${item.label}`);
  };

  const handleAddClick = () => {
    setSelectedItem(null);
    setIsAddingNew(true);
  };

  const handleCloseForm = () => {
    setIsAddingNew(false);
    setSelectedItem(null);
  };

  // Encontrar o elemento selecionado
  const selectedElement = selectedItem
    ? elements.find((element) => element.id === selectedItem.id) || null
    : null;

  return (
    <Container>
      <ContentLeft>
        <SButton
          color={colors.white}
          bgColor={colors.green}
          onClick={handleAddClick}
        >
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
          <div>
            Selecione um item para editar ou clique em &quot;Adicionar&quot;
            para criar um novo
          </div>
        )}
      </ContentRight>
    </Container>
  );
};

export default ElementRegistration;
