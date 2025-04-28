import React, { useEffect, useState } from 'react';

import Breadcrumbs from 'components/Breadcrumbs';
import Button from 'components/Button';
import Icon from 'components/Icon';
import Spinner from 'components/Spinner';

import getToolsHandle from 'api/getTools/handle';

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
    label: 'Dados de Máquina',
    url: '/machine',
    isActive: true,
  },
];

const EditableForm: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formState, setFormState] = useState<FormState>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [shouldSaveData, setShouldSaveData] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      const cncData: StoredCncData = await loadCncData();
      const toolsData: Tools = await loadTools();

      console.log('CNC Data:', cncData);
      console.log('Tools Data:', toolsData);

      setFormState((prevState: FormState) =>
        updateFormState(prevState, cncData, toolsData),
      );
    }
    fetchData();
  }, []);

  const saveCncData = (cncData: StoredCncData) => {
    console.log('Saving CNC data:', cncData);
    window.electron.store.set('cnc', cncData);
  };

  const saveToolsData = (toolsData: Tools) => {
    console.log('Saving tools data:', toolsData);
    window.electron.store.set('tools', toolsData);
  };

  const toggleEdit = () => {
    setIsEditing((prevState) => !prevState);
  };

  const saveData = React.useCallback(() => {
    const cncMappedData = mapFormStateToStoredCncData(formState);
    const toolsMappedData = mapFormStateToStoredToolsData(formState);

    saveCncData(cncMappedData);
    saveToolsData(toolsMappedData);
  }, [formState]);

  useEffect(() => {
    if (shouldSaveData) {
      saveData();
      setShouldSaveData(false);
    }
  }, [formState, saveData, shouldSaveData]);

  const handleGetData = async () => {
    setIsLoading(true);
    let res;
    try {
      res = await getToolsHandle();
    } finally {
      if (res && res.status === 'success') {
        const { tools, cnc } = res;
        setFormState((prevState: FormState) =>
          updateFormState(prevState, cnc, tools),
        );
        setShouldSaveData(true);
      } else {
        console.error('Error fetching data:', res);
      }
      setIsLoading(false);
    }
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
            onClick={() => {}}
            color={colors.blue}
            bgColor={colors.white}
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
            onClick={() => {}}
            color={colors.blue}
            bgColor={colors.white}
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
            color={isEditing ? colors.white : colors.green}
            bgColor={isEditing ? colors.green : colors.white}
            borderColor={isEditing ? colors.green : colors.green}
          >
            <Wrap>
              {isEditing ? (
                <Icon
                  className="icon-floppy-disk"
                  color={colors.white}
                  fontSize="16px"
                />
              ) : (
                <Icon
                  className="icon-create"
                  color={colors.green}
                  fontSize="24px"
                />
              )}

              <BtnText>{isEditing ? 'Salvar' : 'Editar'}</BtnText>
            </Wrap>
          </Button>
          <Button
            onClick={() => handleGetData()}
            color={colors.white}
            bgColor={colors.blue}
          >
            <Wrap>
              {!isLoading ? (
                <Icon
                  className="icon-download3"
                  color={colors.white}
                  fontSize="22px"
                />
              ) : (
                <Spinner size="22px" />
              )}
              <BtnText>Buscar do CNC</BtnText>
            </Wrap>
          </Button>
        </ButtonsHeader>
        <SContentBlock>{fieldsProps.map(renderField)}</SContentBlock>
      </Content>
    </Container>
  );
};

export default EditableForm;
