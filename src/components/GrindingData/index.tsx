import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import TabMenu from 'components/TabMenu';
import Icon from 'components/Icon';
import TranslatedToolName from 'components/TranslatedToolName';

import useRelatedTools from 'hooks/useRelatedTools';
import useFormattedTools from 'hooks/useFormattedTools';

import { editGrindingWheelProperty } from 'state/part/partSlice';

import { GrindingWheels } from 'types/part';
import { DressingToolsNames } from 'types/tools';

import { EditButton } from 'pages/Config/styles';
import { colors } from 'styles/global.styles';

import useInitializeFormState from './useInitializeFormState';
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
  Message,
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

  useInitializeFormState(
    dressingToolNames,
    selectorGrindingWheels,
    formState,
    setFormState,
  );

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
      dispatch(editGrindingWheelProperty(editObject));
    } else if (property === 'bAxisAngle' && dressingToolName) {
      const editObject = {
        id: toolId,
        property: property as 'bAxisAngle',
        value: Number(value),
        dressingToolName,
      };
      dispatch(editGrindingWheelProperty(editObject));
    }
  };

  const toggleEdit = (field: string) => {
    setFormState((prevState) => {
      const isEditing = prevState[field]?.edit;
      const currentValue = prevState[field]?.value;

      if (
        typeof currentValue === 'string' &&
        (currentValue.endsWith('.') || prevState[field]?.error)
      ) {
        return prevState;
      }

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
      value: string;
    };

    const isValidDecimal = /^(\d+(\.\d*)?|\.\d+)$/.test(value);

    setFormState((prevState) => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        value,
        error: value === '' || !isValidDecimal,
        message: (() => {
          if (value === '') {
            return 'O campo não pode estar vazio.';
          }
          if (!isValidDecimal) {
            return 'Insira um número decimal válido.';
          }
          return undefined;
        })(),
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

  const tabItems = Object.entries(dressingToolNames)
    .filter(([toolKey]) => {
      const tool = formattedTools.find((t) => `tool${t.id}` === toolKey);
      return tool && tool.type !== 0;
    })
    .map(([toolKey, toolNames]) => {
      const tool = formattedTools.find((t) => `tool${t.id}` === toolKey);
      const label = tool ? tool.label : toolKey;

      return {
        label,
        content: (
          <form onSubmit={(e) => e.preventDefault()}>
            <GrindingContainer>
              <SSubTitle>Retificação</SSubTitle>
              <GrindingField>
                {formState[`${toolKey}-xSafetyDistance`]?.error && (
                  <Message>
                    {formState[`${toolKey}-xSafetyDistance`]?.message}
                  </Message>
                )}
                <FieldContent>
                  <SInput
                    label="Distância Segura X: "
                    direction="row"
                    type="number"
                    name={`${toolKey}-xSafetyDistance`}
                    value={formState[`${toolKey}-xSafetyDistance`]?.value}
                    onChange={handleInputChange}
                    disabled={!formState[`${toolKey}-xSafetyDistance`]?.edit}
                    error={formState[`${toolKey}-xSafetyDistance`]?.error}
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
                {formState[`${toolKey}-zSafetyDistance`]?.error && (
                  <div style={{ color: 'red' }}>
                    {formState[`${toolKey}-zSafetyDistance`]?.message}
                  </div>
                )}
                <FieldContent>
                  <SInput
                    label="Distância Segura Z: "
                    direction="row"
                    type="number"
                    name={`${toolKey}-zSafetyDistance`}
                    value={formState[`${toolKey}-zSafetyDistance`]?.value}
                    onChange={handleInputChange}
                    disabled={!formState[`${toolKey}-zSafetyDistance`]?.edit}
                    error={formState[`${toolKey}-zSafetyDistance`]?.error}
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
                {(toolNames as DressingToolsNames[]).map(
                  (name: DressingToolsNames) => {
                    return (
                      <DressingField key={name}>
                        <ToolName>
                          <TranslatedToolName name={name} />
                        </ToolName>
                        {formState[`${toolKey}-bAxisAngle-${name}`]?.error && (
                          <div style={{ color: 'red' }}>
                            {
                              formState[`${toolKey}-bAxisAngle-${name}`]
                                ?.message
                            }
                          </div>
                        )}
                        <FieldContent>
                          <SInput
                            label="Ângulo Eixo B: "
                            direction="row"
                            type="number"
                            name={`${toolKey}-bAxisAngle-${name}`}
                            value={
                              formState[`${toolKey}-bAxisAngle-${name}`]?.value
                            }
                            onChange={handleInputChange}
                            disabled={
                              !formState[`${toolKey}-bAxisAngle-${name}`]?.edit
                            }
                            error={
                              formState[`${toolKey}-bAxisAngle-${name}`]?.error
                            }
                          />
                          <EditButton
                            type="button"
                            onClick={() =>
                              toggleEdit(`${toolKey}-bAxisAngle-${name}`)
                            }
                          >
                            {renderEditIcon(`${toolKey}-bAxisAngle-${name}`)}
                          </EditButton>
                        </FieldContent>
                      </DressingField>
                    );
                  },
                )}
              </Dressing>
            </DressingContainer>
          </form>
        ),
      };
    });

  return (
    <Container>
      <TabMenu items={tabItems} />
    </Container>
  );
};

export default GrindingData;
