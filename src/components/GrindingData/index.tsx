import React, { useEffect, useState } from 'react';

import TabMenu from 'components/TabMenu';
import Input from 'components/Input';

import useRelatedTools from 'hooks/useRelatedTools';
import { GrindingWheelsItem } from 'types/part';

import transaltedToolNames from 'mockdata/pt-br/dressingTools.json';

import {
  Container,
  Field,
  MachiningContainer,
  SSubTitle,
  ToolName,
} from './styles';

const GrindingData: React.FC = () => {
  const dressingToolNames = useRelatedTools();
  const [formData, setFormData] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const grindingWheelsData: GrindingWheelsItem[] = Object.entries(
      dressingToolNames,
    ).map(([toolKey, toolNames], index) => ({
      id: index + 1,
      label: toolKey,
      xSafetyDistance: Number(formData[`xSafeDistance-${toolKey}`]) || 0,
      zSafetyDistance: Number(formData[`zSafeDistance-${toolKey}`]) || 0,
      dressingToolsData: toolNames.map((name) => ({
        name,
        bAxisAngle: Number(formData[`bAxisAngle-${name}`]) || 0,
      })),
    }));
    console.log('Grinding Wheels Data:', grindingWheelsData);
  };

  useEffect(() => {
    console.log(dressingToolNames);
  }, [dressingToolNames]);

  const tabItems = Object.entries(dressingToolNames).map(
    ([toolKey, toolNames]) => ({
      label: toolKey,
      content: (
        <form onSubmit={handleSubmit}>
          <MachiningContainer>
            <SSubTitle>Retificação</SSubTitle>
            <Input
              label="Distância Segura X"
              direction="row"
              type="number"
              name={`xSafeDistance-${toolKey}`}
              value={formData[`xSafeDistance-${toolKey}`] || ''}
              onChange={handleChange}
            />
            <Input
              label="Distância Segura Y"
              direction="row"
              type="number"
              name={`zSafeDistance-${toolKey}`}
              value={formData[`zSafeDistance-${toolKey}`] || ''}
              onChange={handleChange}
            />
          </MachiningContainer>
          <MachiningContainer>
            <SSubTitle>Dressagem</SSubTitle>
            {toolNames.map((name) => {
              const toolName = name.replace(/\d+$/, '');
              const translatedToolName =
                transaltedToolNames[
                  toolName as keyof typeof transaltedToolNames
                ];
              const toolNumber = name.match(/\d+$/);

              return (
                <Field>
                  <ToolName>{`${translatedToolName} ${toolNumber}`}</ToolName>
                  <div key={name}>
                    <Input
                      label="Ângulo Eixo B"
                      direction="row"
                      type="number"
                      name={`bAxisAngle-${name}`}
                      value={formData[`bAxisAngle-${name}`] || ''}
                      onChange={handleChange}
                    />
                  </div>
                </Field>
              );
            })}
          </MachiningContainer>
          <button type="submit">Submit</button>
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
