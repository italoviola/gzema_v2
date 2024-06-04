import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import InputText from 'components/InputText';
import Select from 'components/Select';
import { addOperation } from 'state/part/partSlice';

import { grindingWheels } from 'integration/grindingWheels';

import { OptionType } from 'components/Select/interface';
import { FormProps } from './interface';
import { Container, Field, SButton } from './style';

const formattedGrindingWheels: OptionType[] = grindingWheels.map((wheel) => ({
  value: wheel.id,
  label: wheel.name,
}));

const AddOperationForm: React.FC<FormProps> = ({ onButtonClick }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    grindingWheelId: 1,
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    let v: string | number = event.target.value;
    if (event.target.name === 'grindingWheelId') {
      v = parseInt(v, 10);
    }

    console.log('event.target.name', event.target.name);
    setFormData({
      ...formData,
      [event.target.name]: v,
    });
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log('formData', formData);

    if (!formData.name) {
      alert('Os campos nome e tipo são obrigatórios');
      return;
    }

    dispatch(addOperation({ ...formData }));
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleSubmit(e);
    onButtonClick();
  };

  return (
    <Container>
      <Field>
        <InputText
          name="name"
          label="Nome:"
          value={formData.name}
          onChange={handleChange}
          placeholder="Operação X1..."
        />
      </Field>
      <Select
        label="Rebolo:"
        name="grindingWheelId"
        onChange={handleChange}
        value={formData.grindingWheelId}
        options={formattedGrindingWheels}
      />
      <SButton onClick={handleClick}>Adicionar</SButton>
    </Container>
  );
};

export default AddOperationForm;
