import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import {
  addElement,
  editElement,
  removeElement,
} from 'state/elements/elementsSlice';

import Icon from 'components/Icon';
import Modal from 'components/Modal';
import ConfirmAction from 'components/ConfirmAction';

import { ElementItem } from 'types/element';

import { colors } from 'styles/global.styles';
import { ActionButton } from 'styles/Components';

import { ElementFormProps } from './interface';
import {
  Container,
  Header,
  Title,
  HeaderActions,
  FormBody,
  SInput,
  EditableTitleWrapper,
  STitleEdit,
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
  const [isModalCofirmDeleteOpOpen, setIsModalCofirmDeleteOpOpen] =
    useState(false);

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

    // Garante que o label nunca seja vazio
    const safeLabel =
      formData.label?.trim() === '' ? 'Novo Elemento' : formData.label.trim();

    setFormData({
      ...formData,
      label: safeLabel,
    });

    // Se estiver editando um elemento existente, salva a alteração
    if (!isNew && element) {
      dispatch(
        editElement({
          id: element.id,
          ...formData,
          label: safeLabel,
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
              <STitleEdit
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
                  color={colors.blue}
                  fontSize="24px"
                />
              </Check>
            </>
          ) : (
            <Title>{isNew ? 'Novo Elemento' : formData.label}</Title>
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
          <SaveBtn type="button" onClick={handleSave}>
            <Icon
              className="icon-floppy-disk"
              color={colors.white}
              fontSize="16px"
            />
          </SaveBtn>
          {!isNew && (
            <DeleteBtn
              type="button"
              onClick={() => setIsModalCofirmDeleteOpOpen(true)}
            >
              <Icon
                className="icon-delete"
                color={colors.white}
                fontSize="21px"
              />
            </DeleteBtn>
          )}
          <ActionButton type="button" onClick={onClose}>
            <Icon className="icon-x" color={colors.greyFont} fontSize="24px" />
          </ActionButton>
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
      <Modal
        title="Deseja excluir Elemento?"
        isOpen={isModalCofirmDeleteOpOpen}
        onClose={() => setIsModalCofirmDeleteOpOpen(false)}
        variation="danger"
      >
        <ConfirmAction
          onConfirm={() => {
            handleDelete();
            setIsModalCofirmDeleteOpOpen(false);
          }}
          onCancel={() => setIsModalCofirmDeleteOpOpen(false)}
        />
      </Modal>
    </Container>
  );
};

export default ElementForm;
