import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import TabMenu from 'components/TabMenu';
import Icon from 'components/Icon';
import TranslatedToolName from 'components/TranslatedToolName';

import useRelatedTools from 'hooks/useRelatedTools';
import useFormattedTools from 'hooks/useFormattedTools';
import useInitializeGrindingWheels from 'hooks/useInitializeGrindingWheels';

import { editGrindingWheelProperty } from 'state/part/partSlice';

import transaltedDressingToolsNames from 'mockdata/pt-br/dressingTools.json';

import { GrindingWheels } from 'types/part';

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
import useInitializeFormState from './useInitializeFormState';

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

  useInitializeGrindingWheels(
    selectorGrindingWheels,
    formattedTools,
    dressingToolNames,
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
