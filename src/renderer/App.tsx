import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import useRelatedTools from 'hooks/useRelatedTools';
import useFormattedTools from 'hooks/useFormattedTools';
import useInitializeGrindingWheels from 'hooks/useInitializeGrindingWheels';

import { editApp } from 'state/app/appSlice';
import { initialState } from 'state/part/partSlice';

import { Part } from 'types/part';

import { initializeGrindingWheels } from 'utils/initializeGrindingWheels';

// Pages
import WorkGroup from 'pages/WorkGroup';
import Contour from 'pages/Contour';
import OffPage from 'pages/OffPage';
import Machine from 'pages/Machine';
import Config from 'pages/Config';

import BaseLayout from 'layouts/Base';
import ModalCloseApp from 'components/ModalCloseApp';

import './App.css';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const dressingToolNames = useRelatedTools();
  const formattedTools = useFormattedTools();

  const lastSavedFileState = useSelector(
    (state: { app: { lastSavedFileState: string } }) =>
      state.app.lastSavedFileState,
  );
  const part = useSelector((state: { part: Part }) => state.part);

  const [isConfirmCloseModalOpen, setIsConfirmCloseModalOpen] = useState(false);
  const [isAttemptingToClose, setIsAttemptingToClose] = useState(false);

  useInitializeGrindingWheels();

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isAttemptingToClose) {
        event.preventDefault();
        event.returnValue = '';
        setIsConfirmCloseModalOpen(true);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isAttemptingToClose]);

  useEffect(() => {
    if (isAttemptingToClose) {
      window.removeEventListener('beforeunload', () => {});
      window.close();
    }
  }, [isAttemptingToClose]);

  const handleConfirmClose = () => {
    setIsAttemptingToClose(true);
    setIsConfirmCloseModalOpen(false);
  };

  useEffect(() => {
    const grindingWheelsUpdated = initializeGrindingWheels(
      formattedTools,
      dressingToolNames,
    );

    const initialStateUpdated = {
      ...initialState,
      grindingWheels: grindingWheelsUpdated,
    };

    if (lastSavedFileState && lastSavedFileState !== JSON.stringify(part)) {
      dispatch(editApp({ isSaved: false }));
    } else if (
      !lastSavedFileState &&
      JSON.stringify(part) !== JSON.stringify(initialStateUpdated)
    ) {
      dispatch(editApp({ isSaved: false }));
    } else dispatch(editApp({ isSaved: true }));
  }, [dispatch, dressingToolNames, formattedTools, lastSavedFileState, part]);
  return (
    <Router>
      <BaseLayout>
        <>
          <Routes>
            <Route path="/" element={<OffPage />} />
            <Route path="/workgroup" element={<WorkGroup />} />
            <Route path="/contour/:id" element={<Contour />} />
            <Route path="/config" element={<Config />} />
            <Route path="/machine" element={<Machine />} />
          </Routes>
          <ModalCloseApp
            isOpen={isConfirmCloseModalOpen}
            onClose={() => {
              setIsAttemptingToClose(false);
              setIsConfirmCloseModalOpen(false);
            }}
            onConfirm={() => {
              handleConfirmClose();
            }}
          />
        </>
      </BaseLayout>
    </Router>
  );
};

export default App;
