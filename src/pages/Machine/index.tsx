import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Breadcrumbs from 'components/Breadcrumbs';
import Button from 'components/Button';
import Icon from 'components/Icon';
import Spinner from 'components/Spinner';
import Modal from 'components/Modal';
import ConfirmAction from 'components/ConfirmAction';

import { editApp } from 'state/app/appSlice';

import { useSetNewFile } from 'hooks/useSetNewFile';

import getToolsHandle from 'api/getTools/handle';

import { loadCncData } from 'utils/loadCncData';
import { loadTools } from 'utils/loadTools';

import { SelectOptions } from 'components/Select/interface';
import { colors } from 'styles/global.styles';

import { App } from 'types/app';
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
  ModalContent,
  ModalText,
} from './styles';

const breadcrumbsItems = [
  {
    label: 'Dados de Máquina',
    url: '/machine',
    isActive: true,
  },
];

const EditableForm: React.FC = () => {
  const dispatch = useDispatch();
  const setNewFile = useSetNewFile();

  const hasMachineDataChange = useSelector(
    (state: { app: App }) => state.app.hasMachineDataChange,
  );

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formState, setFormState] = useState<FormState>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [shouldSaveData, setShouldSaveData] = useState<boolean>(false);
  const [isModalFeedbackOpen, setIsModalFeedbackOpen] =
    useState<boolean>(false);
  const [isModalConfirmSaveOpen, setIsModalConfirmSaveOpen] =
    useState<boolean>(false);
  const [isModalConfirmGetCncOpen, setIsModalConfirmGetCncOpen] =
    useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      const cncData: StoredCncData = await loadCncData();
      const toolsData: Tools = await loadTools();

      setFormState((prevState: FormState) =>
        updateFormState(prevState, cncData, toolsData),
      );
      dispatch(
        editApp({
          hasMachineDataChange: undefined,
        }),
      );
    }

    if (hasMachineDataChange || hasMachineDataChange === undefined) {
      fetchData();
    }
  }, [dispatch, hasMachineDataChange]);

  const saveCncData = (cncData: StoredCncData) => {
    console.log('Saving CNC data:', cncData);
    window.electron.store.set('cnc', cncData);
  };

  const saveToolsData = (toolsData: Tools) => {
    console.log('Saving tools data:', toolsData);
    window.electron.store.set('tools', toolsData);
  };

  const toggleEdit = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    const cncData: StoredCncData = await loadCncData();
    const toolsData: Tools = await loadTools();

    const cncMappedData = mapFormStateToStoredCncData(formState);
    const toolsMappedData = mapFormStateToStoredToolsData(formState);

    const isCncDataDifferent =
      JSON.stringify(cncData) !== JSON.stringify(cncMappedData);
    const isToolsDataDifferent =
      JSON.stringify(toolsData) !== JSON.stringify(toolsMappedData);

    if (isCncDataDifferent || isToolsDataDifferent) {
      setIsModalConfirmSaveOpen(true);
    } else {
      setIsEditing(false);
    }
  };

  const discardFormChanges = async () => {
    try {
      const cncData: StoredCncData = await loadCncData();
      const toolsData: Tools = await loadTools();

      setFormState((prevState: FormState) =>
        updateFormState(prevState, cncData, toolsData),
      );

      console.log('Alterações descartadas e formulário restaurado.');
    } catch (error) {
      console.error('Erro ao descartar alterações:', error);
    }
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
        await setNewFile();
        setShouldSaveData(true);
      } else {
        setIsModalFeedbackOpen(true);
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
          const value = Number(selectedOption.target.value);
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
          {/* <Button
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
          </Button> */}
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
            onClick={() => setIsModalConfirmGetCncOpen(true)}
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
      <Modal
        title="Erro ao buscar dados"
        variation="danger"
        isOpen={isModalFeedbackOpen}
        onClose={() => setIsModalFeedbackOpen(false)}
      >
        <ModalContent>
          <ModalText>
            Houve um erro ao buscar dados, verifique a conexão com o serviço ou
            o CNC e tente novamente.
          </ModalText>
        </ModalContent>
        <Button
          onClick={() => setIsModalFeedbackOpen(false)}
          color={colors.red}
          bgColor={colors.white}
          borderColor={colors.red}
        >
          OK
        </Button>
      </Modal>
      <Modal
        title="Confirmação de Alteração"
        variation="danger"
        isOpen={isModalConfirmSaveOpen}
        onClose={() => {
          setShouldSaveData(false);
          setIsModalConfirmSaveOpen(false);
          discardFormChanges();
          setIsEditing(false);
        }}
      >
        <ModalContent>
          <ModalText>
            Os Dados de Máquina carregados diferem dos Dados de Máquina do
            arquivo, mudar os dados de máquina irá criar um novo arquivo do
            zero. Mudanças não salvas serão perdidas. Deseja continuar?
          </ModalText>
        </ModalContent>
        <ConfirmAction
          onConfirm={() => {
            setShouldSaveData(true);
            setIsModalConfirmSaveOpen(false);
            setNewFile();
            setIsEditing(false);
          }}
          onCancel={() => {
            setShouldSaveData(false);
            setIsModalConfirmSaveOpen(false);
            discardFormChanges();
            setIsEditing(false);
          }}
        />
      </Modal>
      <Modal
        title="Confirmação de Alteração"
        variation="danger"
        isOpen={isModalConfirmGetCncOpen}
        onClose={() => {
          setIsModalConfirmGetCncOpen(false);
        }}
      >
        <ModalContent>
          <ModalText>
            Buscar dados de CNC irá mudar os dados de máquina irá criar um novo
            arquivo do zero. Mudanças não salvas serão perdidas. Deseja
            continuar?
          </ModalText>
        </ModalContent>
        <ConfirmAction
          onConfirm={() => {
            handleGetData();
            setIsModalConfirmGetCncOpen(false);
          }}
          onCancel={() => {
            setIsModalConfirmGetCncOpen(false);
          }}
        />
      </Modal>
    </Container>
  );
};

export default EditableForm;
