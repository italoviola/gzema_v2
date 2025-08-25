import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectElement, deselectElement } from 'state/app/appSlice';

import ItemList from 'components/ItemList';
import ElementForm from 'components/ElementForm';
import Icon from 'components/Icon';
import DescriptionText from 'components/DescriptionText';

import { Item } from 'components/ItemList/interface';

import { ElementItem, ElementItems } from 'types/part';
import { App } from 'types/app';

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

  const elements = useSelector(
    (state: { part: { elements: ElementItems } }) => state.part.elements,
  );

  const selectedElementId = useSelector(
    (state: { app: App }) => state.app.selectedElementId,
  );

  const [isAddingNew, setIsAddingNew] = useState(false);

  const menuItems: Item[] = elements.map((element: ElementItem) => ({
    id: element.id,
    label: element.label,
  }));

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
