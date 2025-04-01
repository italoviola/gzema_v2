import React, { useEffect } from 'react';
import { GrindingWheels } from 'types/part';
import { FormState } from './interface';

const useInitializeFormState = (
  dressingToolNames: Record<string, string[]>,
  selectorGrindingWheels: GrindingWheels,
  formState: FormState,
  setFormState: React.Dispatch<React.SetStateAction<FormState>>,
) => {
  useEffect(() => {
    if (Object.keys(formState).length === 0) {
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

          acc[`${toolKey}-bAxisAngle-${name}`] = {
            value: dressingToolData?.bAxisAngle || 0,
            edit: false,
            error: false,
            message: undefined,
          };
        });
        return acc;
      }, {} as FormState);

      setFormState(initialFormState);
    }
  }, [dressingToolNames, formState, selectorGrindingWheels, setFormState]);
};

export default useInitializeFormState;
