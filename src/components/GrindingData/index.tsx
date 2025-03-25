import React, { useState } from 'react';

import TabMenu from 'components/TabMenu';
import Icon from 'components/Icon';

import useRelatedTools from 'hooks/useRelatedTools';

import transaltedToolNames from 'mockdata/pt-br/dressingTools.json';

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
  const dressingToolNames = useRelatedTools();

  // Inicializa o estado formState com base em dressingToolNames
  const initialFormState: FormState = Object.entries(dressingToolNames).reduce(
    (acc, [toolKey, toolNames]) => {
      acc[`xSafeDistance-${toolKey}`] = {
        value: '',
        edit: false,
        error: false,
        message: undefined,
      };
      acc[`zSafeDistance-${toolKey}`] = {
        value: '',
        edit: false,
        error: false,
        message: undefined,
      };
      toolNames.forEach((name) => {
        acc[`bAxisAngle-${toolKey}-${name}`] = {
          value: '',
          edit: false,
          error: false,
          message: undefined,
        };
      });
      return acc;
    },
    {} as FormState,
  );

  const [formState, setFormState] = useState<FormState>(initialFormState);

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
    ([toolKey, toolNames]) => ({
      label: toolKey,
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
                  name={`xSafeDistance-${toolKey}`}
                  value={formState[`xSafeDistance-${toolKey}`]?.value || ''}
                  onChange={handleInputChange}
                  disabled={!formState[`xSafeDistance-${toolKey}`]?.edit}
                />
                <EditButton
                  type="button"
                  onClick={() => toggleEdit(`xSafeDistance-${toolKey}`)}
                >
                  {renderEditIcon(`xSafeDistance-${toolKey}`)}
                </EditButton>
              </FieldContent>
            </GrindingField>
            <GrindingField>
              <FieldContent>
                <SInput
                  label="Distância Segura Y: "
                  direction="row"
                  type="number"
                  name={`zSafeDistance-${toolKey}`}
                  value={formState[`zSafeDistance-${toolKey}`]?.value || ''}
                  onChange={handleInputChange}
                  disabled={!formState[`zSafeDistance-${toolKey}`]?.edit}
                />
                <EditButton
                  type="button"
                  onClick={() => toggleEdit(`zSafeDistance-${toolKey}`)}
                >
                  {renderEditIcon(`zSafeDistance-${toolKey}`)}
                </EditButton>
              </FieldContent>
            </GrindingField>
          </GrindingContainer>
          <DressingContainer>
            <SSubTitle>Dressagem</SSubTitle>
            <Dressing>
              {toolNames.map((name) => {
                const toolName = name.replace(/\d+$/, '');
                const translatedToolName =
                  transaltedToolNames[
                    toolName as keyof typeof transaltedToolNames
                  ];
                const toolNumber = name.match(/\d+$/);

                return (
                  <DressingField key={name}>
                    <ToolName>{`${translatedToolName} ${toolNumber}`}</ToolName>
                    <FieldContent>
                      <SInput
                        label="Ângulo Eixo B: "
                        direction="row"
                        type="number"
                        name={`bAxisAngle-${toolKey}-${name}`}
                        value={
                          formState[`bAxisAngle-${toolKey}-${name}`]?.value ||
                          ''
                        }
                        onChange={handleInputChange}
                        disabled={
                          !formState[`bAxisAngle-${toolKey}-${name}`]?.edit
                        }
                      />
                      <EditButton
                        type="button"
                        onClick={() =>
                          toggleEdit(`bAxisAngle-${toolKey}-${name}`)
                        }
                      >
                        {renderEditIcon(`bAxisAngle-${toolKey}-${name}`)}
                      </EditButton>
                    </FieldContent>
                  </DressingField>
                );
              })}
            </Dressing>
          </DressingContainer>
        </form>
      ),
    }),
  );

  return (
    <Container>
      <TabMenu items={tabItems} />
    </Container>
  );
};

export default GrindingData;
