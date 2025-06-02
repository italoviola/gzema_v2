import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import useRelatedTools from 'hooks/useRelatedTools';
import useFormattedTools from 'hooks/useFormattedTools';

import { editApp } from 'state/app/appSlice';
import { initialState } from 'state/part/partSlice';

import { initializeGrindingWheels } from 'utils/initializeGrindingWheels';

import { App } from 'types/app';
import { Part } from 'types/part';

const useAppSaveStatus = () => {
  const dispatch = useDispatch();
  const formattedTools = useFormattedTools();
  const dressingToolNames = useRelatedTools();

  const app = useSelector((state: { app: App }) => state.app);
  const part = useSelector((state: { part: Part }) => state.part);

  useEffect(() => {
    const grindingWheelsUpdated = initializeGrindingWheels(
      formattedTools,
      dressingToolNames,
    );

    const initialStateUpdated = {
      ...initialState,
      grindingWheels: grindingWheelsUpdated,
    };

    if (!app.hasSaveStatusUpdate) {
      if (
        app.lastSavedFileState &&
        app.lastSavedFileState !== JSON.stringify(part)
      ) {
        dispatch(editApp({ isSaved: false }));
      } else if (
        !app.lastSavedFileState &&
        part.grindingWheels.length > 0 &&
        JSON.stringify(part) !== JSON.stringify(initialStateUpdated)
      ) {
        dispatch(editApp({ isSaved: false }));
      }
    } else {
      dispatch(editApp({ isSaved: false, hasSaveStatusUpdate: undefined }));
    }
  }, [
    dispatch,
    formattedTools,
    dressingToolNames,
    part,
    app.hasSaveStatusUpdate,
    app.lastSavedFileState,
  ]);
};

export default useAppSaveStatus;
