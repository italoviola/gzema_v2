import React, { useState, useEffect, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  removeElement,
  addElement,
  editElement,
  deselectElement,
} from 'state/elements/elementsSlice';

import Icon from 'components/Icon';
import Modal from 'components/Modal';
import ConfirmAction from 'components/ConfirmAction';
import SelectComponent from 'components/Select';

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

const CORNER_TYPE_OPTIONS = [
  { value: 'none', label: 'Nenhum' },
  { value: 'rounded', label: 'Arredondado' },
  { value: 'chamfer', label: 'Chanfrado' },
];

const DEFAULT_ELEMENT: Omit<ElementItem, 'id'> = {
  label: 'Novo Elemento',
  xaxis: 0, // might change based on Machine settings
  leftZAxis: 0,
  rightZAxis: 50,
  leftDiameter: 100,
  rightDiameter: 100,
  corners: {
    left: { type: 'none' },
    right: { type: 'none' },
  },
};

const ElementForm: React.FC<ElementFormProps> = ({
  element,
  onClose,
  isNew = false,
}) => {
  const dispatch = useDispatch();
  const elements = useSelector(
    (state: { part: { elements: Elements } }) => state.part.elements.items,
  );

  const [formData, setFormData] = useState<Omit<ElementItem, 'id'>>(
    element || DEFAULT_ELEMENT,
  );
  const [editingLabel, setEditingLabel] = useState<boolean>(isNew);
  const [isModalCofirmDeleteOpOpen, setIsModalCofirmDeleteOpOpen] =
    useState(false);

  // manage element new element default data
  useEffect(() => {
    if (element) {
      setFormData({
        ...DEFAULT_ELEMENT,
        ...element,
        corners: {
          ...DEFAULT_ELEMENT.corners,
          ...(element.corners || {}),
        },
      });
    } else if (isNew) {
      const defaultValues: Omit<ElementItem, 'id'> = {
        ...DEFAULT_ELEMENT,
      };

      if (elements.length > 0) {
        const lastElement = elements[elements.length - 1];

        // next element starts where the last one ends
        defaultValues.leftZAxis = lastElement.rightZAxis;
        defaultValues.rightZAxis =
          lastElement.rightZAxis +
          (DEFAULT_ELEMENT.rightZAxis - DEFAULT_ELEMENT.leftZAxis);

        defaultValues.xaxis = lastElement.xaxis;
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

  // AJUSTAR TIPAGEM
  const handleCornerChange = (
    side: 'left' | 'right',
    field: string,
    value: string | number,
  ) => {
    setFormData((prev) => {
      const newFormData = {
        ...prev,
        corners: {
          ...prev.corners,
          [side]: { ...prev.corners[side] },
        },
      };

      if (field === 'type') {
        if (value === 'rounded') {
          newFormData.corners[side] = { type: 'rounded', radius: 0 };
        } else if (value === 'chamfer') {
          newFormData.corners[side] = { type: 'chamfer', length: 0, angle: 45 };
        } else {
          newFormData.corners[side] = { type: 'none' };
        }
      } else {
        // @ts-ignore
        newFormData.corners[side][field] =
          typeof value === 'string' ? parseFloat(value) || 0 : value;
      }

      return newFormData;
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

  const renderCornerFields = (side: 'left' | 'right') => {
    const corner = formData.corners[side];
    const sideLabel = side === 'left' ? 'Esq.' : 'Dir.';

    return (
      <>
        <SelectComponent
          label={`Tipo ${sideLabel}`}
          name={`${side}CornerType`}
          options={CORNER_TYPE_OPTIONS}
          value={corner.type}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            handleCornerChange(side, 'type', e.target.value)
          }
        />

        {corner.type === 'rounded' && (
          <SInput
            label={`Raio ${sideLabel}`}
            type="number"
            name={`${side}Radius`}
            value={(corner as { radius: number }).radius}
            onChange={(e) => handleCornerChange(side, 'radius', e.target.value)}
          />
        )}
        {corner.type === 'chamfer' && (
          <>
            <SInput
              label={`Comprimento ${sideLabel}`}
              type="number"
              name={`${side}Length`}
              value={(corner as { length: number }).length}
              onChange={(e) =>
                handleCornerChange(side, 'length', e.target.value)
              }
            />
            <SInput
              label={`Ângulo ${sideLabel}`}
              type="number"
              name={`${side}Angle`}
              value={(corner as { angle: number }).angle}
              onChange={(e) =>
                handleCornerChange(side, 'angle', e.target.value)
              }
            />
          </>
        )}
      </>
    );
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
        {/* <SInput
          label="Eixo X:"
          type="number"
          name="xaxis"
          value={formData.xaxis}
          onChange={handleChange}
        /> */}
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

        {renderCornerFields('left')}
        {renderCornerFields('right')}
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
