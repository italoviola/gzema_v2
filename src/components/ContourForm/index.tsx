import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FormField from 'components/FormField';
import TranslatedToolName from 'components/TranslatedToolName';
import { Message } from 'components/FormField/style';

import {
  MACHINING_DRESSING,
  TYPE_EXTERNAL,
  TYPE_INTERNAL,
} from 'utils/constants';

import useFormattedTools from 'hooks/useFormattedTools';
import { addContour, editContour } from 'state/part/partSlice';

import useRelatedTools, { DressingToolsNames } from 'hooks/useRelatedTools';

import { ContourType, Machining, Contours } from 'types/part';
import { ToolOptionItem } from 'types/formattedTools';

import { addContourPayload, FormProps, IFormData } from './interface';

import {
  Container,
  Field,
  Label,
  RadioButton,
  Button,
  TitleLabel,
} from './style';

const initialFormData: IFormData = {
  name: { value: '', error: false, message: undefined },
  type: { value: undefined, error: false, message: undefined },
  bAxisAngle: { value: 0, error: false, message: undefined },
  xSafetyDistance: { value: 0, error: false, message: undefined },
  zSafetyDistance: { value: 0, error: false, message: undefined },
  dressingTool: { value: undefined, error: false, message: undefined },
};

const ContourForm: React.FC<FormProps> = ({
  onButtonClick,
  machining,
  variation,
  contourId,
}) => {
  const dispatch = useDispatch();
  const formattedTools = useFormattedTools();
  const relatedTools = useRelatedTools();
  const availableTypes = Array.from(
    new Set(formattedTools.map((tool: ToolOptionItem) => tool.type)),
  );

  const contours = useSelector(
    (state: { part: { contours: Contours } }) => state.part.contours,
  );

  let formValues: IFormData = initialFormData;

  if (variation === 'edit') {
    const contour = contours.find((c) => c.id === contourId);
    if (contour) {
      formValues = {
        name: { value: contour.name, error: false, message: undefined },
        type: { value: contour.type, error: false, message: undefined },
        dressingTool: {
          value: contour.dressingTool,
          error: false,
          message: undefined,
        },
      };
    }
  }

  const [formData, setFormData] = useState(formValues);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: {
        ...prevData[name as keyof typeof initialFormData],
        value,
      },
    }));
  };

  const validateFormData = () => {
    let isValid = true;

    const updatedFormData = Object.entries(formData).reduce(
      (acc, [key, field]) => {
        if (
          (field.value === null ||
            field.value === undefined ||
            field.value === '') &&
          (key !== 'dressingTool' || machining === MACHINING_DRESSING)
        ) {
          (acc as any)[key] = {
            ...field,
            error: true,
            message: 'Campo obrigatório',
          };
          isValid = false;
        } else if (
          (key === 'bAxisAngle' ||
            key === 'xSafetyDistance' ||
            key === 'zSafetyDistance') &&
          (field.value === null ||
            field.value === undefined ||
            field.value === '')
        ) {
          (acc as any)[key] = {
            ...field,
            error: true,
            message: 'Campo obrigatório',
          };
          isValid = false;
        } else {
          (acc as any)[key] = {
            ...field,
            error: false,
            message: undefined,
          };
        }
        return acc;
      },
      {} as typeof formData,
    );

    setFormData(updatedFormData);
    return isValid;
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!validateFormData()) {
      return;
    }

    const contour: addContourPayload = {
      name: formData.name.value as string,
      machining: machining as Machining,
      type: Number(formData.type.value) as ContourType,
      dressingTool: formData.dressingTool?.value as string,
    };

    if (variation === 'add') {
      dispatch(
        addContour({
          ...contour,
          machining: machining as Machining,
          type: Number(formData.type.value) as ContourType,
        }),
      );
    } else if (variation === 'edit' && contourId !== undefined) {
      dispatch(
        editContour({
          id: contourId,
          changes: {
            ...contour,
            machining: machining as Machining,
            type: Number(formData.type.value) as ContourType,
          },
        }),
      );
    }

    onButtonClick();
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleSubmit(e);
  };

  return (
    <Container>
      {variation === 'add' && (
        <>
          <Field>
            <FormField
              name="name"
              label="Nome"
              type="text"
              placeholder="Peça PC01..."
              fieldState={formData.name}
              handleInputChange={handleChange}
            />
          </Field>
          <Field>
            <Label>Tipo:</Label>
            {formData.type.error && <Message>{formData.type.message}</Message>}
            {availableTypes.includes(TYPE_EXTERNAL) && (
              <RadioButton>
                <input
                  type="radio"
                  value={TYPE_EXTERNAL}
                  name="type"
                  onChange={(e) => handleChange(e)}
                />
                <span />
                Externo
              </RadioButton>
            )}
            {availableTypes.includes(TYPE_INTERNAL) && (
              <RadioButton>
                <input
                  type="radio"
                  value={TYPE_INTERNAL}
                  name="type"
                  onChange={(e) => handleChange(e)}
                />
                <span />
                Interno
              </RadioButton>
            )}
          </Field>
        </>
      )}
      {variation === 'add' &&
        machining === MACHINING_DRESSING &&
        formData.type.value && (
          <>
            {formData.dressingTool && formData.dressingTool.error && (
              <Message>{formData.dressingTool.message}</Message>
            )}
            <TitleLabel>Ferramenta de Dressagem</TitleLabel>
            {Object.entries(relatedTools).map(
              ([toolKey, dToolNames], index) => {
                const toolId = parseInt(toolKey.replace('tool', ''), 10);
                const toolType = formattedTools.find(
                  (tool: ToolOptionItem) => tool.id === toolId,
                )?.type;
                if (toolType !== Number(formData.type.value)) {
                  return null;
                }
                return (
                  <div key={toolKey}>
                    <Field>
                      <Label>Rebolo {index + 1}</Label>
                    </Field>
                    {(dToolNames as DressingToolsNames[]).map(
                      (name: DressingToolsNames) => (
                        <Field key={`${toolKey}-${name}`}>
                          <RadioButton style={{ fontSize: '16px' }}>
                            <input
                              type="radio"
                              value={name}
                              name="dressingTool"
                              onChange={(e) => handleChange(e)}
                            />
                            <span />
                            <TranslatedToolName
                              name={name as DressingToolsNames}
                            />
                          </RadioButton>
                        </Field>
                      ),
                    )}
                  </div>
                );
              },
            )}
          </>
        )}
      <Button onClick={handleClick}>
        {variation === 'add' ? 'Cadastrar' : 'Editar'}
      </Button>
    </Container>
  );
};

export default ContourForm;
