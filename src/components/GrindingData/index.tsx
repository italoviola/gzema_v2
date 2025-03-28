import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import TabMenu from 'components/TabMenu';
import Icon from 'components/Icon';
import TranslatedToolName from 'components/TranslatedToolName';

import useRelatedTools from 'hooks/useRelatedTools';
import useFormattedTools from 'hooks/useFormattedTools';
import {
  editGrindingWheelProperty,
  setGrindingWheelData,
} from 'state/part/partSlice';

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
    console.log('selectorGrindingWheels', selectorGrindingWheels);
  }, [selectorGrindingWheels]);

  useEffect(() => {
    // TEM UM BUG AQUI que esta setando os edits pro estado inicial quando alterados pra true no botao edit

    // Inicializa o estado local apenas se estiver vazio
    const initialFormState: FormState = Object.entries(
      dressingToolNames,
    ).reduce((acc, [toolKey, toolNames]) => {
      const toolId = parseInt(toolKey.replace('tool', ''), 10);
      const grindingWheel = selectorGrindingWheels.find(
        (wheel) => wheel.id === toolId,
      );

      acc[`${toolKey}-xSafetyDistance`] = {
        value: grindingWheel?.xSafetyDistance || 0,
        edit: false,
        error: false,
        message: undefined,
      };
      acc[`${toolKey}-zSafetyDistance`] = {
        value: grindingWheel?.zSafetyDistance || 0,
        edit: false,
        error: false,
        message: undefined,
      };
      toolNames.forEach((name) => {
        const dressingToolData = grindingWheel?.dressingToolsData.find(
          (tool) => tool.name === name,
        );

        acc[`${toolKey}-${name}-bAxisAngle`] = {
          value: dressingToolData?.bAxisAngle || 0,
          edit: false,
          error: false,
          message: undefined,
        };
      });
      return acc;
    }, {} as FormState);

    console.log('initialFormState', initialFormState);

    setFormState(initialFormState);
  }, [dressingToolNames, selectorGrindingWheels]);

  useEffect(() => {
    // TRANSFORMAR EM HOOK
    // Inicializa o estado global se o grindingWheels estiver vazio
    if (selectorGrindingWheels.length === 0 && formattedTools.length > 0) {
      const initialGrindingWheels: GrindingWheels = formattedTools.map(
        (tool) => {
          const dressingTools = dressingToolNames[`tool${tool.id}`] || [];
          const dressingToolsData: GWDressingToolsData = dressingTools.map(
            (name) => ({
              name,
              bAxisAngle: 0,
            }),
          );

          return {
            id: tool.id,
            label: tool.label,
            xSafetyDistance: 0,
            zSafetyDistance: 0,
            dressingToolsData,
          };
        },
      );

      dispatch(setGrindingWheelData(initialGrindingWheels));
    }
  }, [
    dressingToolNames,
    selectorGrindingWheels,
    formattedTools,
    formState,
    dispatch,
  ]);

  const handleSubmit = (field: string) => {
    const [toolKey, property, dressingToolName] = field.split('-');
    const toolId = parseInt(toolKey.replace('tool', ''), 10);

    const value = formState[field]?.value || 0;

    if (property === 'xSafetyDistance' || property === 'zSafetyDistance') {
      const editObject = {
        id: toolId,
        property: property as 'xSafetyDistance' | 'zSafetyDistance',
        value: Number(value),
      };
      console.log('editObject', editObject);
      dispatch(editGrindingWheelProperty(editObject));
    } else if (property === 'bAxisAngle' && dressingToolName) {
      const editObject = {
        id: toolId,
        property: property as 'bAxisAngle',
        value: Number(value),
        dressingToolName,
      };
      console.log('editObject', editObject);
      dispatch(editGrindingWheelProperty(editObject));
    }
  };

  const toggleEdit = (field: string) => {
    setFormState((prevState) => {
      const isEditing = prevState[field]?.edit;

      const updatedState = {
        ...prevState,
        [field]: {
          ...prevState[field],
          edit: !isEditing,
          error: false,
          message: undefined,
        },
      };

      if (isEditing) {
        handleSubmit(field);
      }

      return updatedState;
    });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target as {
      name: keyof FormState;
      value: string | number;
    };

    let newValue: string | number;
    if (Number.isNaN(Number(value))) {
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
                    name={`${toolKey}-xSafetyDistance`}
                    value={formState[`${toolKey}-xSafetyDistance`]?.value || ''}
                    onChange={handleInputChange}
                    disabled={!formState[`${toolKey}-xSafetyDistance`]?.edit}
                  />
                  <EditButton
                    type="button"
                    onClick={() => toggleEdit(`${toolKey}-xSafetyDistance`)}
                  >
                    {renderEditIcon(`${toolKey}-xSafetyDistance`)}
                  </EditButton>
                </FieldContent>
              </GrindingField>
              <GrindingField>
                <FieldContent>
                  <SInput
                    label="Distância Segura Y: "
                    direction="row"
                    type="number"
                    name={`${toolKey}-zSafetyDistance`}
                    value={formState[`${toolKey}-zSafetyDistance`]?.value || ''}
                    onChange={handleInputChange}
                    disabled={!formState[`${toolKey}-zSafetyDistance`]?.edit}
                  />
                  <EditButton
                    type="button"
                    onClick={() => toggleEdit(`${toolKey}-zSafetyDistance`)}
                  >
                    {renderEditIcon(`${toolKey}-zSafetyDistance`)}
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
