import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Select from 'components/Select';
import FormField from 'components/FormField';

import { addOperation, editOperation } from 'state/part/partSlice';

import { grindingWheels } from 'integration/grindingWheels';

// Types
import { OptionType } from 'components/Select/interface';
import { Operations } from 'types/part';
import { FormProps, IFormData } from './interface';
import { Container, Field, SButton } from './style';

const formattedGrindingWheels: OptionType[] = grindingWheels.map((wheel) => ({
  value: wheel.id,
  label: wheel.name,
}));

const initialFormData: IFormData = {
  name: { value: '', error: false, message: undefined },
  grindingWheelId: { value: 1, error: false, message: undefined },
  dAngle: { value: 0, error: false, message: undefined },
};

const OperationForm: React.FC<FormProps> = ({
  onButtonClick,
  variation = 'add',
  operationId,
}) => {
  const dispatch = useDispatch();
  const operations = useSelector(
    (state: { part: { operations: Operations } }) => state.part.operations,
  );

  if (variation === 'edit') {
    const operation = operations.find((op) => op.id === operationId);
    if (operation) {
      initialFormData.name.value = operation.name;
      initialFormData.grindingWheelId.value = operation.grindingWheelId;
      initialFormData.dAngle.value = operation.dAngle;
    }
  }

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: {
        ...prevData[name as keyof typeof initialFormData],
        value: name === 'grindingWheelId' ? parseInt(value, 10) : value,
      },
    }));
  };

  const validateFormData = () => {
    let isValid = true;

    const updatedFormData = Object.entries(formData).reduce(
      (acc, [key, field]) => {
        if (
          field.value === '' ||
          field.value === null ||
          field.value === undefined ||
          // verificar com pessoal se pode ser menor que 0
          field.value < 0
        ) {
          (acc as any)[key] = {
            ...field,
            error: true,
            message: 'Campo obrigatório',
          };
          isValid = false;
        } else {
          (acc as any)[key] = {
            ...field,
            error: false,
            message: undefined,
          };
        }
        return acc;
      },
      {} as typeof formData,
    );

    setFormData(updatedFormData);
    return isValid;
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!validateFormData()) {
      return;
    }

    const operation = {
      name: String(formData.name.value),
      grindingWheelId: Number(formData.grindingWheelId.value),
      dAngle: Number(formData.dAngle.value),
    };

    if (variation === 'add') dispatch(addOperation(operation));
    else if (operationId !== undefined)
      dispatch(editOperation({ id: operationId, operation }));

    onButtonClick();
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleSubmit(e);
  };

  return (
    <Container>
      <Field>
        <FormField
          name="name"
          label="Nome"
          type="text"
          placeholder="Operação X1..."
          fieldState={formData.name}
          handleInputChange={handleChange}
        />
      </Field>
      <Field>
        <Select
          label="Rebolo:"
          name="grindingWheelId"
          onChange={handleChange}
          value={formData.grindingWheelId.value}
          options={formattedGrindingWheels}
        />
      </Field>
      <Field>
        <FormField
          name="dAngle"
          label="Ângulo D"
          type="number"
          placeholder="Valor do ângulo..."
          fieldState={formData.dAngle}
          handleInputChange={handleChange}
        />
      </Field>
      <SButton onClick={handleClick}>
        {variation === 'add' ? 'Adicionar' : 'Editar'}
      </SButton>
    </Container>
  );
};

export default OperationForm;