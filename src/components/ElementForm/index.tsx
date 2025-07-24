import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import {
  addElement,
  editElement,
  removeElement,
} from 'state/elements/elementsSlice';

import Icon from 'components/Icon';

import { ElementItem } from 'types/element';

import { colors } from 'styles/global.styles';

import { ElementFormProps } from './interface';
import {
  Container,
  Header,
  Title,
  HeaderActions,
  FormBody,
  SInput,
  EditableTitleWrapper,
  EditableTitleInput,
  Edit,
  DeleteBtn,
  SaveBtn,
  Check,
} from './style';

const ElementForm: React.FC<ElementFormProps> = ({
  element,
  onClose,
  isNew = false,
}) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<Omit<ElementItem, 'id'>>({
    label: '',
    xaxis: 0,
    zaxis: 0,
    height: 0,
    width: 0,
    leftDiameter: 0,
    rightDiameter: 0,
  });
  const [editingLabel, setEditingLabel] = useState(isNew);

  useEffect(() => {
    if (element) {
      setFormData(element);
    }
  }, [element]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    });
  };

  const handleSave = () => {
    if (isNew) {
      dispatch(addElement(formData));
    } else if (element) {
      dispatch(
        editElement({
          id: element.id,
          ...formData,
        }),
      );
    }

    if (onClose) onClose();
  };

  const handleDelete = () => {
    if (!isNew && element) {
      dispatch(removeElement(element.id));
      if (onClose) onClose();
    }
  };

  const handleLabelEdit = () => {
    setEditingLabel(true);
  };

  const handleLabelSave = () => {
    setEditingLabel(false);

    // if editing existing element, save changes
    if (!isNew && element) {
      dispatch(
        editElement({
          id: element.id,
          ...formData,
        }),
      );
    }
  };

  return (
    <Container>
      <Header>
        <EditableTitleWrapper>
          {editingLabel ? (
            <>
              <EditableTitleInput
                type="text"
                name="label"
                value={formData.label}
                onChange={handleChange}
                autoFocus
                placeholder="Nome do elemento"
              />
              <Check type="button" onClick={handleLabelSave}>
                <Icon
                  className="icon-check_circle"
                  color={colors.greyDark}
                  fontSize="24px"
                />
              </Check>
            </>
          ) : (
            <Title>
              {isNew ? 'Novo Elemento' : formData.label || element?.id}
            </Title>
          )}
        </EditableTitleWrapper>
        <HeaderActions>
          {!isNew && !editingLabel && (
            <Edit
              type="button"
              onClick={handleLabelEdit}
              className="edit-label-btn"
            >
              <Icon
                className="icon-create"
                color={colors.greyDark}
                fontSize="24px"
              />
            </Edit>
          )}
          <SaveBtn
            type="button"
            className="icon-floppy-disk"
            onClick={handleSave}
          />
          {!isNew && (
            <DeleteBtn
              type="button"
              className="icon-delete"
              onClick={handleDelete}
            />
          )}
        </HeaderActions>
      </Header>
      <FormBody>
        <SInput
          label="Eixo x:"
          type="number"
          name="xaxis"
          value={formData.xaxis}
          onChange={handleChange}
        />
        <SInput
          label="Eixo z:"
          type="number"
          name="zaxis"
          value={formData.zaxis}
          onChange={handleChange}
        />
        <SInput
          label="Altura:"
          type="number"
          name="height"
          value={formData.height}
          onChange={handleChange}
        />
        <SInput
          label="Largura:"
          type="number"
          name="width"
          value={formData.width}
          onChange={handleChange}
        />
        <SInput
          label="D. Esquerdo:"
          type="number"
          name="leftDiameter"
          value={formData.leftDiameter}
          onChange={handleChange}
        />
        <SInput
          label="D. Direito:"
          type="number"
          name="rightDiameter"
          value={formData.rightDiameter}
          onChange={handleChange}
        />
      </FormBody>
    </Container>
  );
};

export default ElementForm;
