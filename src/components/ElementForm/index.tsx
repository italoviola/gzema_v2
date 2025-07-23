import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ElementItem } from 'types/element';
import {
  addElement,
  editElement,
  removeElement,
} from 'state/elements/elementsSlice';
import {
  FormContainer,
  FormHeader,
  FormTitle,
  FormActions,
  FormBody,
  FormGroup,
  FormInput,
  FormLabel,
  EditableTitleWrapper,
  EditableTitleInput,
} from './style';

interface ElementFormProps {
  element?: ElementItem | null;
  onClose?: () => void;
  isNew?: boolean;
}

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

    // Se estiver editando um elemento existente, salvar as alterações
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
    <FormContainer>
      <FormHeader>
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
              <button
                type="button"
                onClick={handleLabelSave}
                className="save-btn"
              >
                ✓
              </button>
            </>
          ) : (
            <FormTitle>
              {isNew ? 'Novo Elemento' : formData.label || element?.id}
            </FormTitle>
          )}
        </EditableTitleWrapper>

        <FormActions>
          {!isNew && !editingLabel && (
            <button
              type="button"
              onClick={handleLabelEdit}
              className="edit-label-btn"
            >
              ✎
            </button>
          )}
          <button type="button" onClick={handleSave}>
            💾
          </button>
          {!isNew && (
            <button type="button" onClick={handleDelete} className="delete-btn">
              🗑️
            </button>
          )}
        </FormActions>
      </FormHeader>

      <FormBody>
        <FormGroup>
          <FormLabel>Eixo x:</FormLabel>
          <FormInput
            type="number"
            name="xaxis"
            value={formData.xaxis}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <FormLabel>Eixo z:</FormLabel>
          <FormInput
            type="number"
            name="zaxis"
            value={formData.zaxis}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <FormLabel>Altura:</FormLabel>
          <FormInput
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <FormLabel>Largura:</FormLabel>
          <FormInput
            type="number"
            name="width"
            value={formData.width}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <FormLabel>D. Esquerdo:</FormLabel>
          <FormInput
            type="number"
            name="leftDiameter"
            value={formData.leftDiameter}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup>
          <FormLabel>D. Direito:</FormLabel>
          <FormInput
            type="number"
            name="rightDiameter"
            value={formData.rightDiameter}
            onChange={handleChange}
          />
        </FormGroup>
      </FormBody>
    </FormContainer>
  );
};

ElementForm.defaultProps = {
  element: null,
  onClose: undefined,
  isNew: false,
};

export default ElementForm;
