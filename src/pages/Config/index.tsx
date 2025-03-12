import React, { useEffect, useState, FormEvent } from 'react';

import Breadcrumbs from 'components/Breadcrumbs';
import Icon from 'components/Icon';
import Spinner from 'components/Spinner';
import { Label } from 'components/Input/style';
import Modal from 'components/Modal';

import {
  Config as ConfigType,
  GetToolsRequest,
  GetToolsResponse,
  GetToolsResponseDataItem,
  StoredCncData,
  Tools,
} from 'types/api';
import Button from 'components/Button';
import { ModalContent, ModalText } from 'components/SideMenu/styles';

import { loadConfig } from 'utils/loadConfig';
import { loadTools } from 'utils/loadTools';
import { loadCncData } from 'utils/loadCncData';

import { colors } from 'styles/global.styles';
import { PageContent, PageTitle } from 'styles/Components';

import { FieldKeys, FormState } from './interface';
import {
  fieldsCNCProps,
  fieldsNetworkProps,
  fieldsToolsProps,
  initialState,
  validateField,
  validateFieldObj,
} from './functions';
import {
  Container,
  SContentBlock,
  SInput,
  SSubTitle,
  Field,
  Message,
  EditButton,
  ContentText,
  SButton,
  SContentBlockBtn,
  SContentBlockSpinner,
} from './styles';

const breadcrumbsItems = [
  {
    label: 'Configurações',
    url: '/config',
    isActive: true,
  },
];

const Config: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const [formState, setFormState] = useState<FormState>(initialState);
  const [toolsData, setToolsData] = useState<Tools>({} as Tools);
  const [cncData, setCncData] = useState<StoredCncData>({} as StoredCncData);
  const [isGetToolsLoading, setIsGetToolsLoading] = useState<boolean>(false);
  const [isModalFeedbackOpen, setIsModalFeedbackOpen] =
    useState<boolean>(false);

  const [displayValues, setDisplayValues] = useState<{ [key: string]: string }>(
    {},
  );
  const [colorsState, setColorsState] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchData = async () => {
      const loadedConfig: ConfigType = await loadConfig();
      const loadedTools: Tools = await loadTools();
      const loadedCncData: StoredCncData = await loadCncData();

      const updateFormState = (key: keyof FormState, value: any) => ({
        ...formState[key],
        value: value || formState[key].value,
      });

      setFormState(() => ({
        ip: updateFormState('ip', loadedConfig.network.ip),
        port: updateFormState('port', loadedConfig.network.port),
        delRangeStart: updateFormState(
          'delRangeStart',
          loadedConfig.cnc.delRangeStart,
        ),
        delRangeEnd: updateFormState(
          'delRangeEnd',
          loadedConfig.cnc.delRangeEnd,
        ),
        pmcAddress: updateFormState('pmcAddress', loadedConfig.cnc.pmcAddress),
        pmcAddressBit: updateFormState(
          'pmcAddressBit',
          loadedConfig.cnc.pmcAddressBit,
        ),
        notationPattern: updateFormState(
          'notationPattern',
          loadedConfig.cnc.notationPattern,
        ),
        hasBAxis: updateFormState('hasBAxis', loadedConfig.cnc.hasBAxis),
        tool1Var: updateFormState('tool1Var', loadedConfig.tools.tool1Var),
        tool1fixedDiamondQtd: updateFormState(
          'tool1fixedDiamondQtd',
          loadedConfig.tools.tool1fixedDiamondQtd,
        ),
        tool1refractableDiamondQtd: updateFormState(
          'tool1refractableDiamondQtd',
          loadedConfig.tools.tool1refractableDiamondQtd,
        ),
        tool1dressingDiscQtd: updateFormState(
          'tool1dressingDiscQtd',
          loadedConfig.tools.tool1dressingDiscQtd,
        ),
        tool1fixedDressingRollerQtd: updateFormState(
          'tool1fixedDressingRollerQtd',
          loadedConfig.tools.tool1fixedDressingRollerQtd,
        ),
        tool1sCtrlMovableDressingRollerQtd: updateFormState(
          'tool1sCtrlMovableDressingRollerQtd',
          loadedConfig.tools.tool1sCtrlMovableDressingRollerQtd,
        ),
        tool2Var: updateFormState('tool2Var', loadedConfig.tools.tool2Var),
        tool2fixedDiamondQtd: updateFormState(
          'tool2fixedDiamondQtd',
          loadedConfig.tools.tool2fixedDiamondQtd,
        ),
        tool2refractableDiamondQtd: updateFormState(
          'tool2refractableDiamondQtd',
          loadedConfig.tools.tool2refractableDiamondQtd,
        ),
        tool2dressingDiscQtd: updateFormState(
          'tool2dressingDiscQtd',
          loadedConfig.tools.tool2dressingDiscQtd,
        ),
        tool2fixedDressingRollerQtd: updateFormState(
          'tool2fixedDressingRollerQtd',
          loadedConfig.tools.tool2fixedDressingRollerQtd,
        ),
        tool2sCtrlMovableDressingRollerQtd: updateFormState(
          'tool2sCtrlMovableDressingRollerQtd',
          loadedConfig.tools.tool2sCtrlMovableDressingRollerQtd,
        ),
        tool3Var: updateFormState('tool3Var', loadedConfig.tools.tool3Var),
        tool3fixedDiamondQtd: updateFormState(
          'tool3fixedDiamondQtd',
          loadedConfig.tools.tool3fixedDiamondQtd,
        ),
        tool3refractableDiamondQtd: updateFormState(
          'tool3refractableDiamondQtd',
          loadedConfig.tools.tool3refractableDiamondQtd,
        ),
        tool3dressingDiscQtd: updateFormState(
          'tool3dressingDiscQtd',
          loadedConfig.tools.tool3dressingDiscQtd,
        ),
        tool3fixedDressingRollerQtd: updateFormState(
          'tool3fixedDressingRollerQtd',
          loadedConfig.tools.tool3fixedDressingRollerQtd,
        ),
        tool3sCtrlMovableDressingRollerQtd: updateFormState(
          'tool3sCtrlMovableDressingRollerQtd',
          loadedConfig.tools.tool3sCtrlMovableDressingRollerQtd,
        ),
        tool4Var: updateFormState('tool4Var', loadedConfig.tools.tool4Var),
        tool4fixedDiamondQtd: updateFormState(
          'tool4fixedDiamondQtd',
          loadedConfig.tools.tool4fixedDiamondQtd,
        ),
        tool4refractableDiamondQtd: updateFormState(
          'tool4refractableDiamondQtd',
          loadedConfig.tools.tool4refractableDiamondQtd,
        ),
        tool4dressingDiscQtd: updateFormState(
          'tool4dressingDiscQtd',
          loadedConfig.tools.tool4dressingDiscQtd,
        ),
        tool4fixedDressingRollerQtd: updateFormState(
          'tool4fixedDressingRollerQtd',
          loadedConfig.tools.tool4fixedDressingRollerQtd,
        ),
        tool4sCtrlMovableDressingRollerQtd: updateFormState(
          'tool4sCtrlMovableDressingRollerQtd',
          loadedConfig.tools.tool4sCtrlMovableDressingRollerQtd,
        ),
      }));

      setToolsData(loadedTools);
      setCncData(loadedCncData);
      setLoaded(true);
    };

    fetchData();
  }, [formState]);

  const handleSubmit = async (event?: FormEvent) => {
    event?.preventDefault();

    const configData: ConfigType = {
      network: {
        ip: formState.ip.value as string,
        port: formState.port.value as number,
      },
      cnc: {
        delRangeStart: formState.delRangeStart.value as number,
        delRangeEnd: formState.delRangeEnd.value as number,
        pmcAddress: formState.pmcAddress.value as number,
        pmcAddressBit: formState.pmcAddressBit.value as number,
        notationPattern: formState.notationPattern.value as number,
        hasBAxis: formState.hasBAxis.value as number,
      },
      tools: {
        tool1Var: formState.tool1Var.value as number,
        tool1fixedDiamondQtd: formState.tool1fixedDiamondQtd.value as number,
        tool1refractableDiamondQtd: formState.tool1refractableDiamondQtd
          .value as number,
        tool1dressingDiscQtd: formState.tool1dressingDiscQtd.value as number,
        tool1fixedDressingRollerQtd: formState.tool1fixedDressingRollerQtd
          .value as number,
        tool1sCtrlMovableDressingRollerQtd: formState
          .tool1sCtrlMovableDressingRollerQtd.value as number,
        tool2Var: formState.tool2Var.value as number,
        tool2fixedDiamondQtd: formState.tool2fixedDiamondQtd.value as number,
        tool2refractableDiamondQtd: formState.tool2refractableDiamondQtd
          .value as number,
        tool2dressingDiscQtd: formState.tool2dressingDiscQtd.value as number,
        tool2fixedDressingRollerQtd: formState.tool2fixedDressingRollerQtd
          .value as number,
        tool2sCtrlMovableDressingRollerQtd: formState
          .tool2sCtrlMovableDressingRollerQtd.value as number,
        tool3Var: formState.tool3Var.value as number,
        tool3fixedDiamondQtd: formState.tool3fixedDiamondQtd.value as number,
        tool3refractableDiamondQtd: formState.tool3refractableDiamondQtd
          .value as number,
        tool3dressingDiscQtd: formState.tool3dressingDiscQtd.value as number,
        tool3fixedDressingRollerQtd: formState.tool3fixedDressingRollerQtd
          .value as number,
        tool3sCtrlMovableDressingRollerQtd: formState
          .tool3sCtrlMovableDressingRollerQtd.value as number,
        tool4Var: formState.tool4Var.value as number,
        tool4fixedDiamondQtd: formState.tool4fixedDiamondQtd.value as number,
        tool4refractableDiamondQtd: formState.tool4refractableDiamondQtd
          .value as number,
        tool4dressingDiscQtd: formState.tool4dressingDiscQtd.value as number,
        tool4fixedDressingRollerQtd: formState.tool4fixedDressingRollerQtd
          .value as number,
        tool4sCtrlMovableDressingRollerQtd: formState
          .tool4sCtrlMovableDressingRollerQtd.value as number,
      },
    };

    await window.electron.store.set('config', configData);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target as {
      name: keyof FormState;
      value: string | number;
    };

    let newValue: string | number;
    if (name === 'ip') {
      newValue = value;
    } else if (Number.isNaN(Number(value))) {
      newValue = value;
    } else {
      newValue = Number(value);
    }

    setFormState((prevState) => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        value: newValue,
      },
    }));
  };

  const toggleEdit = (field: FieldKeys) => {
    const validateObj: validateFieldObj = validateField(
      field,
      formState[field].value,
      formState,
    );

    // Verifica se o valor da ferramenta já está sendo usado por outra ferramenta
    const isDuplicateToolValue = Object.keys(formState).some(
      (key) =>
        key !== field &&
        formState[key as FieldKeys].value === formState[field].value,
    );

    if (formState[field].edit && !validateObj.isValid) {
      setFormState((prevState) => ({
        ...prevState,
        [field]: {
          ...prevState[field],
          error: true,
          message: validateObj.message,
        },
      }));
    } else if (isDuplicateToolValue) {
      setFormState((prevState) => ({
        ...prevState,
        [field]: {
          ...prevState[field],
          error: true,
          message: 'O valor da ferramenta já está em uso por outra ferramenta.',
        },
      }));
    } else {
      setFormState((prevState) => ({
        ...prevState,
        [field]: {
          ...prevState[field],
          edit: !prevState[field].edit,
          error: false,
          message: undefined,
        },
      }));
      handleSubmit();
    }
  };

  // Render functions
  const renderEditIcon = (field: FieldKeys) => {
    return formState[field].edit ? (
      <Icon
        className="icon-check_circle"
        color={colors.greyFont}
        fontSize="28px"
      />
    ) : (
      <Icon className="icon-create" color={colors.greyFont} fontSize="28px" />
    );
  };

  const arrangeToolTypes = React.useCallback(() => {
    const newDisplayValues: { [key: string]: string } = {};
    const newColorsState: { [key: string]: string } = {};

    const updateDisplayValues = (prop: any, value: any) => {
      const setDisplayAndColor = (display: string, color: string) => {
        newDisplayValues[prop.name] = display;
        newColorsState[prop.name] = color;
      };

      if (prop.name === 'notationPattern') {
        setDisplayAndColor(
          value === 1 ? 'Junker' : 'Zema',
          value === 1 ? colors.blue : colors.greyDark,
        );
      } else if (prop.name === 'hasBAxis') {
        setDisplayAndColor(
          value === 0 ? 'Não' : 'Sim',
          value === 0 ? colors.greyDark : colors.blue,
        );
      } else if (
        ['tool1Var', 'tool2Var', 'tool3Var', 'tool4Var'].includes(prop.name)
      ) {
        if (value !== undefined) {
          if (value === 1) {
            setDisplayAndColor('Externo', colors.blue);
          } else if (value === 2) {
            setDisplayAndColor('Interno', colors.blue);
          } else {
            setDisplayAndColor('Inexistente', colors.greyDark);
          }
        } else {
          setDisplayAndColor('Inexistente', colors.greyDark);
        }
      } else if (value) {
        setDisplayAndColor(`Quantidade: ${value.toString()}`, colors.blue);
      } else {
        setDisplayAndColor('Inexistente', colors.greyDark);
      }
    };

    fieldsToolsProps.forEach((prop) => {
      const toolVarName = prop.name as keyof Tools;
      const toolValue = toolsData[toolVarName];
      updateDisplayValues(prop, toolValue);
    });

    fieldsCNCProps.forEach((prop) => {
      const cncVarName = prop.name as keyof StoredCncData;
      const cncValue = cncData[cncVarName];
      updateDisplayValues(prop, cncValue);
    });

    setDisplayValues(newDisplayValues);
    setColorsState(newColorsState);
  }, [toolsData, cncData]);

  useEffect(() => {
    arrangeToolTypes();
  }, [arrangeToolTypes]);

  const renderField = ({
    label,
    name,
    type,
    placeholder,
  }: {
    label: string;
    name: FieldKeys;
    type: string;
    placeholder: string;
  }) => {
    const displayValue = displayValues[name] || 'Inexistente';
    const color = colorsState[name] || colors.greyDark;

    return (
      <React.Fragment key={name}>
        <Label>{label}:</Label>
        {formState[name].error && <Message>{formState[name].message}</Message>}
        <Field>
          <SInput
            type={type}
            name={name}
            value={formState[name].value}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={!formState[name].edit}
            error={formState[name].error}
          />
          {(name === 'hasBAxis' ||
            name === 'notationPattern' ||
            name === 'tool1Var' ||
            name === 'tool2Var' ||
            name === 'tool3Var' ||
            name === 'tool4Var') && (
            <ContentText color={color}>{displayValue}</ContentText>
          )}
          {Object.keys(toolsData).includes(name) &&
            !['tool1Var', 'tool2Var', 'tool3Var', 'tool4Var'].includes(
              name,
            ) && <ContentText color={color}>{displayValue}</ContentText>}
          <EditButton type="button" onClick={() => toggleEdit(name)}>
            {renderEditIcon(name)}
          </EditButton>
        </Field>
      </React.Fragment>
    );
  };

  const getTools = (
    request: GetToolsRequest,
    timeout: number,
  ): Promise<GetToolsResponse> => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Request timed out'));
      }, timeout);

      window.electron.ipcRenderer
        .getTools(request)
        .then((res: GetToolsResponse) => {
          clearTimeout(timer);
          resolve(res);
          return res;
        })
        .catch((error: GetToolsResponse) => {
          clearTimeout(timer);
          reject(error);
        });
    });
  };

  const handleGetTools = async () => {
    const request: GetToolsRequest = {
      network: {
        ip: formState.ip.value as string,
        port: formState.port.value as number,
      },
      pCodeAddresses: [
        formState.notationPattern.value as number,
        formState.hasBAxis.value as number,
        formState.tool1Var.value as number,
        formState.tool1fixedDiamondQtd.value as number,
        formState.tool1refractableDiamondQtd.value as number,
        formState.tool1dressingDiscQtd.value as number,
        formState.tool1fixedDressingRollerQtd.value as number,
        formState.tool1sCtrlMovableDressingRollerQtd.value as number,
        formState.tool2Var.value as number,
        formState.tool2fixedDiamondQtd.value as number,
        formState.tool2refractableDiamondQtd.value as number,
        formState.tool2dressingDiscQtd.value as number,
        formState.tool2fixedDressingRollerQtd.value as number,
        formState.tool2sCtrlMovableDressingRollerQtd.value as number,
        formState.tool3Var.value as number,
        formState.tool3fixedDiamondQtd.value as number,
        formState.tool3refractableDiamondQtd.value as number,
        formState.tool3dressingDiscQtd.value as number,
        formState.tool3fixedDressingRollerQtd.value as number,
        formState.tool3sCtrlMovableDressingRollerQtd.value as number,
        formState.tool4Var.value as number,
        formState.tool4fixedDiamondQtd.value as number,
        formState.tool4refractableDiamondQtd.value as number,
        formState.tool4dressingDiscQtd.value as number,
        formState.tool4fixedDressingRollerQtd.value as number,
        formState.tool4sCtrlMovableDressingRollerQtd.value as number,
      ],
    };

    setIsGetToolsLoading(true);

    try {
      const res: GetToolsResponse = await getTools(request, 100000);

      if (res.statusCode === 200) {
        if (res.data) {
          const newToolsData: Tools = {} as Tools; // might be GetDataFromCNCRequest
          const newCncData: StoredCncData = {} as StoredCncData;

          res.data.forEach((tool: GetToolsResponseDataItem) => {
            Object.keys(formState).forEach((key) => {
              if (formState[key as keyof FormState].value === tool.code) {
                if (key === 'notationPattern' || key === 'hasBAxis') {
                  newCncData[key as keyof StoredCncData] = tool.value;
                } else {
                  newToolsData[key as keyof Tools] = tool.value;
                }
              }
            });
          });

          window.electron.store.set('tools', newToolsData);
          window.electron.store.set('cnc', newCncData);
          setToolsData(newToolsData);
          setCncData(newCncData);
          arrangeToolTypes();
        }
      } else setIsModalFeedbackOpen(true);
    } catch (error) {
      setIsModalFeedbackOpen(true);
    } finally {
      setIsGetToolsLoading(false);
    }
  };

  return (
    <Container className={loaded ? 'loaded' : ''}>
      <Breadcrumbs items={breadcrumbsItems} />
      <PageContent>
        <PageTitle>Configurações</PageTitle>
        <SContentBlock>
          <SSubTitle>Rede</SSubTitle>
          {fieldsNetworkProps.map((field) => renderField(field))}
        </SContentBlock>
        {!isGetToolsLoading ? (
          <SContentBlockBtn>
            <SButton
              onClick={() => handleGetTools()}
              color={colors.white}
              bgColor={colors.blue}
            >
              Buscar dados do CNC
            </SButton>
          </SContentBlockBtn>
        ) : (
          <SContentBlockSpinner>
            <Spinner color={colors.blue} />
          </SContentBlockSpinner>
        )}
        <SContentBlock>
          <SSubTitle>CNC</SSubTitle>
          {fieldsCNCProps.map((field) => renderField(field))}
        </SContentBlock>
        <SContentBlock>
          <SSubTitle>Ferramentas</SSubTitle>
          {fieldsToolsProps.map((field) => renderField(field))}
        </SContentBlock>
      </PageContent>
      <Modal
        title="Erro ao buscar ferramentas"
        variation="danger"
        isOpen={isModalFeedbackOpen}
        onClose={() => setIsModalFeedbackOpen(false)}
      >
        <ModalContent>
          <ModalText>
            Houve um erro ao buscar ferramentas, verifique a conexão com o
            serviço ou o CNC e tente novamente.
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
    </Container>
  );
};

export default Config;
