import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import useInitializeGrindingWheels from 'hooks/useInitializeGrindingWheels';
import useHandleFixFromMachineDataChange from 'hooks/useHandleFixFromMachineDataChange';
import useAppSaveStatus from 'hooks/useAppSaveStatus';

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
  const [isConfirmCloseModalOpen, setIsConfirmCloseModalOpen] = useState(false);
  const [isAttemptingToClose, setIsAttemptingToClose] = useState(false);

  useInitializeGrindingWheels();
  useAppSaveStatus();
  useHandleFixFromMachineDataChange();

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
