import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addElement,
  editElement,
  removeElement,
  deselectElement,
} from 'state/elements/elementsSlice';

import Icon from 'components/Icon';
import Modal from 'components/Modal';
import ConfirmAction from 'components/ConfirmAction';

import { ElementItem, Elements } from 'types/element';

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
  STitleEdit,
  SActionButton,
} from './style';

const DEFAULT_ELEMENT: Omit<ElementItem, 'id'> = {
  label: 'Novo Elemento',
  xaxis: 0, // Mantemos para referência
  zaxis: 0,
  leftZAxis: 0,
  rightZAxis: 50,
  leftDiameter: 100,
  rightDiameter: 100,
};

const ElementForm: React.FC<ElementFormProps> = ({
  element,
  onClose,
  isNew = false,
}) => {
  const dispatch = useDispatch();
  const elements = useSelector(
    (state: { elements: Elements }) => state.elements.items,
  );

  const [formData, setFormData] = useState<Omit<ElementItem, 'id'>>({
    label: '',
    xaxis: 0,
    zaxis: 0,
    leftZAxis: 0,
    rightZAxis: 0,
    leftDiameter: 0,
    rightDiameter: 0,
  });
  const [editingLabel, setEditingLabel] = useState<boolean>(isNew);
  const [isModalCofirmDeleteOpOpen, setIsModalCofirmDeleteOpOpen] =
    useState(false);

  // manage element new element default data
  useEffect(() => {
    if (element) {
      setFormData(element);
    } else if (isNew) {
      const defaultValues: Omit<ElementItem, 'id'> = {
        ...DEFAULT_ELEMENT,
      };

      if (elements.length > 0) {
        const lastElement = elements[elements.length - 1];

        // new element should start where the last one ends
        defaultValues.leftZAxis = lastElement.rightZAxis;
        defaultValues.rightZAxis =
          lastElement.rightZAxis + DEFAULT_ELEMENT.rightZAxis;
        defaultValues.zaxis = lastElement.zaxis;
        defaultValues.xaxis =
          (defaultValues.leftZAxis + defaultValues.rightZAxis) / 2;
      }

      setFormData(defaultValues);
    }
  }, [element, elements, isNew]);

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
      dispatch(deselectElement());
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
      // A limpeza da seleção já é feita no reducer
      if (onClose) onClose();
    }
  };

  const handleLabelEdit = () => {
    setEditingLabel(true);
  };

  const handleLabelSave = () => {
    setEditingLabel(false);

    // ensure that does not save an empty label
    const safeLabel =
      formData.label?.trim() === '' ? 'Novo Elemento' : formData.label.trim();

    setFormData({
      ...formData,
      label: safeLabel,
    });

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
            <STitleEdit
              type="text"
              name="label"
              value={formData.label}
              onChange={handleChange}
              autoFocus
              placeholder="Nome do elemento"
            />
          ) : (
            <Title>{isNew ? 'Novo Elemento' : formData.label}</Title>
          )}
        </EditableTitleWrapper>
        <HeaderActions>
          {!editingLabel ? (
            <SActionButton
              type="button"
              onClick={handleLabelEdit}
              bgColor={colors.green}
            >
              <Icon
                className="icon-create"
                color={colors.white}
                fontSize="24px"
              />
            </SActionButton>
          ) : (
            <SActionButton
              type="button"
              onClick={handleLabelSave}
              bgColor={colors.blue}
            >
              <Icon
                className="icon-check_circle"
                color={colors.white}
                fontSize="24px"
              />
            </SActionButton>
          )}
          <SActionButton
            type="button"
            onClick={handleSave}
            bgColor={colors.blue}
          >
            <Icon
              className="icon-floppy-disk"
              color={colors.white}
              fontSize="18px"
            />
          </SActionButton>
          {!isNew && (
            <SActionButton
              type="button"
              onClick={() => setIsModalCofirmDeleteOpOpen(true)}
              bgColor={colors.red}
            >
              <Icon
                className="icon-delete"
                color={colors.white}
                fontSize="24px"
              />
            </SActionButton>
          )}
          <SActionButton
            type="button"
            onClick={onClose}
            bgColor={colors.greyDark}
          >
            <Icon className="icon-x" color={colors.white} fontSize="24px" />
          </SActionButton>
        </HeaderActions>
      </Header>
      <FormBody>
        <SInput
          label="Z Esquerdo:"
          type="number"
          name="leftZAxis"
          value={formData.leftZAxis}
          onChange={handleChange}
        />
        <SInput
          label="Z Direito:"
          type="number"
          name="rightZAxis"
          value={formData.rightZAxis}
          onChange={handleChange}
        />
        <SInput
          label="Diâmetro Esq.:"
          type="number"
          name="leftDiameter"
          value={formData.leftDiameter}
          onChange={handleChange}
        />
        <SInput
          label="Diâmetro Dir.:"
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
