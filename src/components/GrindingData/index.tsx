import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import TabMenu from 'components/TabMenu';
import Icon from 'components/Icon';
import TranslatedToolName from 'components/TranslatedToolName';

import useRelatedTools from 'hooks/useRelatedTools';
import useFormattedTools from 'hooks/useFormattedTools';
import { setGrindingWheelData } from 'state/part/partSlice';

import transaltedDressingToolsNames from 'mockdata/pt-br/dressingTools.json';

import {
  GrindingWheels,
  GrindingWheelsItem,
  GWDressingToolsData,
  GWDressingToolsDataItem,
} from 'types/part';

import { EditButton } from 'pages/Config/styles';
import { colors } from 'styles/global.styles';

import { FormState } from './interface';

import {
  Container,
  Dressing,
  DressingContainer,
  DressingField,
  FieldContent,
  GrindingContainer,
  GrindingField,
  SInput,
  SSubTitle,
  ToolName,
} from './styles';

const GrindingData: React.FC = () => {
  const dispatch = useDispatch();
  const dressingToolNames = useRelatedTools();
  const formattedTools = useFormattedTools();
  const [formState, setFormState] = useState<FormState>({});

  const selectorGrindingWheels = useSelector(
    (state: { part: { grindingWheels: GrindingWheels } }) =>
      state.part.grindingWheels,
  );

  useEffect(() => {
    // Inicializa o estado apenas se estiver vazio
    if (Object.keys(formState).length === 0) {
      const initialFormState: FormState = Object.entries(
        dressingToolNames,
      ).reduce((acc, [toolKey, toolNames]) => {
        const toolId = parseInt(toolKey.replace('tool', ''), 10);
        const grindingWheel = selectorGrindingWheels.find(
          (wheel) => wheel.id === toolId,
        );

        acc[`${toolKey}-xSafeDistance`] = {
          value: grindingWheel?.xSafetyDistance || '',
          edit: false,
          error: false,
          message: undefined,
        };
        acc[`${toolKey}-zSafeDistance`] = {
          value: grindingWheel?.zSafetyDistance || '',
          edit: false,
          error: false,
          message: undefined,
        };
        toolNames.forEach((name) => {
          const dressingToolData = grindingWheel?.dressingToolsData.find(
            (tool) => tool.name === name,
          );

          acc[`${toolKey}-${name}-bAxisAngle`] = {
            value: dressingToolData?.bAxisAngle || '',
            edit: false,
            error: false,
            message: undefined,
          };
        });
        return acc;
      }, {} as FormState);

      setFormState(initialFormState);
    }
  }, [dressingToolNames, selectorGrindingWheels, formState]);

  const handleSubmit = () => {
    const grindingWheels: GrindingWheels = Object.entries(
      dressingToolNames,
    ).map(([toolKey, toolNames]): GrindingWheelsItem => {
      const toolId = parseInt(toolKey.replace('tool', ''), 10);

      const xSafetyDistance = formState[`${toolKey}-xSafeDistance`]?.value || 0;
      const zSafetyDistance = formState[`${toolKey}-zSafeDistance`]?.value || 0;

      const dressingToolsData: GWDressingToolsData = toolNames.map(
        (name): GWDressingToolsDataItem => {
          const bAxisAngle =
            formState[`${toolKey}-${name}-bAxisAngle`]?.value || 0;

          return {
            name,
            bAxisAngle: Number(bAxisAngle),
          };
        },
      );

      return {
        id: toolId,
        label: `Tool ${toolId}`,
        xSafetyDistance: Number(xSafetyDistance),
        zSafetyDistance: Number(zSafetyDistance),
        dressingToolsData,
      };
    });

    console.log('form component state', grindingWheels);

    dispatch(setGrindingWheelData(grindingWheels));

    // grindingWheels.forEach((wheel) => {
    //   console.log('wheel', wheel);
    //   dispatch(
    //     editGrindingWheelData({
    //       id: wheel.id,
    //       changes: {
    //         xSafetyDistance: wheel.xSafetyDistance,
    //         zSafetyDistance: wheel.zSafetyDistance,
    //         dressingToolsData: wheel.dressingToolsData,
    //       },
    //     }),
    //   );
    // });
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

  const toggleEdit = (field: string) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: {
        ...prevState[field],
        edit: !prevState[field]?.edit, // Verifica se o campo existe antes de acessar
        error: false,
        message: undefined,
      },
    }));
    handleSubmit();
  };

  // Render functions
  const renderEditIcon = (field: string) => {
    return formState[field]?.edit ? (
      <Icon
        className="icon-check_circle"
        color={colors.greyFont}
        fontSize="28px"
      />
    ) : (
      <Icon className="icon-create" color={colors.greyFont} fontSize="28px" />
    );
  };

  const tabItems = Object.entries(dressingToolNames).map(
    ([toolKey, toolNames]) => {
      const tool = formattedTools.find((t) => `tool${t.id}` === toolKey);
      const label = tool ? tool.label : toolKey;

      return {
        label,
        content: (
          <form onSubmit={(e) => e.preventDefault()}>
            <GrindingContainer>
              <SSubTitle>Retificação</SSubTitle>
              <GrindingField>
                <FieldContent>
                  <SInput
                    label="Distância Segura X: "
                    direction="row"
                    type="number"
                    name={`${toolKey}-xSafeDistance`}
                    value={formState[`${toolKey}-xSafeDistance`]?.value || ''}
                    onChange={handleInputChange}
                    disabled={!formState[`${toolKey}-xSafeDistance`]?.edit}
                  />
                  <EditButton
                    type="button"
                    onClick={() => toggleEdit(`${toolKey}-xSafeDistance`)}
                  >
                    {renderEditIcon(`${toolKey}-xSafeDistance`)}
                  </EditButton>
                </FieldContent>
              </GrindingField>
              <GrindingField>
                <FieldContent>
                  <SInput
                    label="Distância Segura Y: "
                    direction="row"
                    type="number"
                    name={`${toolKey}-zSafeDistance`}
                    value={formState[`${toolKey}-zSafeDistance`]?.value || ''}
                    onChange={handleInputChange}
                    disabled={!formState[`${toolKey}-zSafeDistance`]?.edit}
                  />
                  <EditButton
                    type="button"
                    onClick={() => toggleEdit(`${toolKey}-zSafeDistance`)}
                  >
                    {renderEditIcon(`${toolKey}-zSafeDistance`)}
                  </EditButton>
                </FieldContent>
              </GrindingField>
            </GrindingContainer>
            <DressingContainer>
              <SSubTitle>Dressagem</SSubTitle>
              <Dressing>
                {toolNames.map((name) => {
                  return (
                    <DressingField key={name}>
                      <ToolName>
                        <TranslatedToolName
                          name={name}
                          translatedToolNames={transaltedDressingToolsNames}
                        />
                      </ToolName>
                      <FieldContent>
                        <SInput
                          label="Ângulo Eixo B: "
                          direction="row"
                          type="number"
                          name={`${toolKey}-${name}-bAxisAngle`}
                          value={
                            formState[`${toolKey}-${name}-bAxisAngle`]?.value ||
                            ''
                          }
                          onChange={handleInputChange}
                          disabled={
                            !formState[`${toolKey}-${name}-bAxisAngle`]?.edit
                          }
                        />
                        <EditButton
                          type="button"
                          onClick={() =>
                            toggleEdit(`${toolKey}-${name}-bAxisAngle`)
                          }
                        >
                          {renderEditIcon(`${toolKey}-${name}-bAxisAngle`)}
                        </EditButton>
                      </FieldContent>
                    </DressingField>
                  );
                })}
              </Dressing>
            </DressingContainer>
          </form>
        ),
      };
    },
  );

  return (
    <Container>
      <TabMenu items={tabItems} />
    </Container>
  );
};

export default GrindingData;
