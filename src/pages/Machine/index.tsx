import React, { useEffect, useState } from 'react';

import Breadcrumbs from 'components/Breadcrumbs';
import Button from 'components/Button';
import Icon from 'components/Icon';

import { loadCncData } from 'utils/loadCncData';
import { loadTools } from 'utils/loadTools';

import { SelectOptions } from 'components/Select/interface';
import { colors } from 'styles/global.styles';

import { StoredCncData, Tools } from 'types/api';

import { fieldsProps, initialState, updateFormState } from './functions';
import {
  mapFormStateToStoredCncData,
  mapFormStateToStoredToolsData,
} from './mapFunctions';
import { FormState, FieldState } from './interface';

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

  const [loadedCncData, setLoadedCncData] = useState<StoredCncData>(
    {} as StoredCncData,
  );
  const [loadedTools, setLoadedTools] = useState({} as Tools);

  useEffect(() => {
    console.log('Form State:', formState);
  }, [formState]);

  useEffect(() => {
    async function fetchData() {
      const cncData: StoredCncData = await loadCncData();
      const toolsData: Tools = await loadTools();

      setLoadedCncData(cncData);
      setLoadedTools(toolsData);

      setFormState((prevState: FormState) =>
        updateFormState(prevState, cncData, toolsData),
      );

      console.log('Loaded CNC Data:', cncData);
    }
    fetchData();
  }, []);

  const toggleEdit = () => {
    setIsEditing((prevState) => !prevState);
  };

  const saveCncData = (cncData: StoredCncData) => {
    console.log('Saving CNC data:', cncData);
    window.electron.store.set('cnc', cncData);
  };

  const saveToolsData = (toolsData: Tools) => {
    console.log('Saving tools data:', toolsData);
    window.electron.store.set('tools', toolsData);
  };

  useEffect(() => {
    if (!isEditing) {
      const cncMappedData = mapFormStateToStoredCncData(formState);
      const toolsMappedData = mapFormStateToStoredToolsData(formState);

      saveCncData(cncMappedData);
      saveToolsData(toolsMappedData);
    }
  }, [isEditing, formState]);

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
      <SSelect
        name={name}
        options={options}
        onChange={(selectedOption) => {
          const value = Number(selectedOption.target?.value || selectedOption);
          setFormState((prevState: FormState) => ({
            ...prevState,
            [name]: {
              ...prevState[name as keyof FormState],
              value,
              error: false,
              message: undefined,
            } as FieldState,
          }));
        }}
        value={Number(formState[name as keyof FormState].value)}
        disabled={!isEditing}
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
