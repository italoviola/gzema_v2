import React, { useState } from 'react';

import Breadcrumbs from 'components/Breadcrumbs';
import Button from 'components/Button';
import Icon from 'components/Icon';

import { SelectOptions } from 'components/Select/interface';

import { colors } from 'styles/global.styles';

import { fieldsProps, initialState } from './functions';

import { FormState } from './interface';

import {
  Container,
  Field,
  Label,
  SContentBlock,
  Title,
  Content,
  ButtonsHeader,
  BtnText,
  Wrap,
  SSelect,
} from './styles';

const breadcrumbsItems = [
  {
    label: 'Configurações',
    url: '/config',
    isActive: true,
  },
];

const EditableForm: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<FormState>(initialState);

  const toggleEdit = () => {
    setIsEditing((prevState) => !prevState);
  };

  const renderField = ({
    label,
    name,
    options = [],
  }: {
    label: string;
    name: string;
    options?: SelectOptions;
  }) => (
    <Field key={name}>
      <Label>{label}:</Label>
      {/* <SInput
        type={type}
        name={name}
        value={String(formState[name as keyof FormState])}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={!isEditing}
      /> */}
      <SSelect
        name={name}
        options={options}
        onChange={(selectedOption) =>
          setFormState((prevState) => ({
            ...prevState,
            [name]: selectedOption?.target?.value || '',
          }))
        }
        value={String(formState[name as keyof FormState])}
      />
    </Field>
  );

  return (
    <Container>
      <Breadcrumbs items={breadcrumbsItems} />
      <Content>
        <Title>Dados de Máquina</Title>
        <ButtonsHeader>
          <Button
            onClick={toggleEdit}
            color={colors.blue}
            bgColor={colors.grey}
            borderColor={colors.blue}
          >
            <Wrap>
              <Icon
                className="icon-file_download"
                color={colors.blue}
                fontSize="24px"
              />
              <BtnText>Importar</BtnText>
            </Wrap>
          </Button>
          <Button
            onClick={toggleEdit}
            color={colors.blue}
            bgColor={colors.grey}
            borderColor={colors.blue}
          >
            <Wrap>
              <Icon
                className="icon-file_upload"
                color={colors.blue}
                fontSize="24px"
              />
              <BtnText>Exportar</BtnText>
            </Wrap>
          </Button>
          <Button
            onClick={toggleEdit}
            color={colors.white}
            bgColor={colors.blue}
          >
            <Wrap>
              <Icon
                className="icon-panorama_fisheye"
                color={colors.white}
                fontSize="24px"
              />
              <BtnText>Buscar do CNC</BtnText>
            </Wrap>
          </Button>
          <Button
            onClick={toggleEdit}
            color={colors.white}
            bgColor={colors.green}
          >
            <Wrap>
              <Icon
                className="icon-create"
                color={colors.white}
                fontSize="24px"
              />
              <BtnText>{isEditing ? 'Salvar' : 'Editar'}</BtnText>
            </Wrap>
          </Button>
        </ButtonsHeader>
        <SContentBlock>{fieldsProps.map(renderField)}</SContentBlock>
      </Content>
    </Container>
  );
};

export default EditableForm;
