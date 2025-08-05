import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectElement, deselectElement } from 'state/elements/elementsSlice';

import ItemList from 'components/ItemList';
import ElementForm from 'components/ElementForm';
import Icon from 'components/Icon';
import DescriptionText from 'components/DescriptionText';

import { Item } from 'components/ItemList/interface';
import { ElementItem } from 'types/element';

import { colors } from 'styles/global.styles';
import {
  Container,
  ContentLeft,
  ContentRight,
  ItemListContainer,
  SButton,
} from './style';

const ElementRegistration: React.FC = () => {
  const dispatch = useDispatch();

  // Atualizamos os selectors para usar a nova estrutura
  const elements = useSelector((state: any) => state.elements.items);
  const selectedElementId = useSelector(
    (state: any) => state.elements.selectedElementId,
  );

  const [isAddingNew, setIsAddingNew] = useState(false);

  // converter elementos para o formato da lista
  const menuItems: Item[] = elements.map((element: ElementItem) => ({
    id: element.id,
    label: element.label,
  }));

  // Elemento selecionado com base no ID
  const selectedElement = selectedElementId
    ? elements.find((element: ElementItem) => element.id === selectedElementId)
    : null;

  const handleSelectItem = (item: Item) => {
    if (selectedElementId === item.id) {
      dispatch(deselectElement());
      setIsAddingNew(false);
    } else {
      dispatch(selectElement(String(item.id)));
      setIsAddingNew(false);
    }
  };

  const handleAddClick = () => {
    setIsAddingNew(true);
  };

  const handleCloseForm = () => {
    setIsAddingNew(false);
    dispatch(deselectElement());
  };

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
            selectedItemId={selectedElementId}
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
