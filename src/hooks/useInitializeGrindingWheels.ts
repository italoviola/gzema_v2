import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setGrindingWheelData } from 'state/part/partSlice';

import { initializeGrindingWheels } from 'utils/initializeGrindingWheels';

import { GrindingWheels } from 'types/part';

import useRelatedTools from './useRelatedTools';
import useFormattedTools from './useFormattedTools';

const useInitializeGrindingWheels = () => {
  const dispatch = useDispatch();

  const dressingToolNames = useRelatedTools();
  const formattedTools = useFormattedTools();

  const selectorGrindingWheels = useSelector(
    (state: { part: { grindingWheels: GrindingWheels } }) =>
      state.part.grindingWheels,
  );

  useEffect(() => {
    if (
      selectorGrindingWheels.length === 0 &&
      formattedTools.length > 0 &&
      Object.entries(dressingToolNames).length > 0
    ) {
      const initialGrindingWheels = initializeGrindingWheels(
        formattedTools,
        dressingToolNames,
      );
      dispatch(setGrindingWheelData(initialGrindingWheels));
    }
  }, [selectorGrindingWheels, formattedTools, dressingToolNames, dispatch]);
};

export default useInitializeGrindingWheels;
