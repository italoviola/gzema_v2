import { useDispatch } from 'react-redux';

import {
  replacePart,
  initialState as partInitialState,
  setGrindingWheelData,
} from 'state/part/partSlice';
import { editApp, initialState as appInitialState } from 'state/app/appSlice';

import { initializeGrindingWheels } from 'utils/initializeGrindingWheels';

import useRelatedTools from './useRelatedTools';
import useFormattedTools from './useFormattedTools';

export const useSetNewFile = () => {
  const dispatch = useDispatch();
  const dressingToolNames = useRelatedTools();
  const formattedTools = useFormattedTools();

  const setNewFile = () => {
    dispatch(
      replacePart({
        ...partInitialState,
      }),
    );

    const initialGrindingWheels = initializeGrindingWheels(
      formattedTools,
      dressingToolNames,
    );
    dispatch(setGrindingWheelData(initialGrindingWheels));

    dispatch(
      editApp({
        ...appInitialState,
      }),
    );
  };

  return setNewFile;
};
