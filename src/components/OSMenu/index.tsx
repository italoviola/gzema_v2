/* eslint-disable no-console */
/* eslint-disable no-alert */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Modal from 'components/Modal';
import ConfirmAction from 'components/ConfirmAction';

import { replacePart } from 'state/part/partSlice';
import { editApp } from 'state/app/appSlice';

import { useSetNewFile } from 'hooks/useSetNewFile';

import { Part } from 'types/part';
import { FileObject, SaveObject } from 'types/general';
import { App } from 'types/app';
import { GZemaFile, Machine } from 'types/fileTypes';

import { isElectron } from 'utils/constants';
import { saveFile, saveFileAs } from 'utils/saveFile';
import { loadMachineData } from 'utils/loadMachineData';
import { saveMachineDataAtElectronStore } from 'utils/saveMachineDataAtElectronStore';
import { extractCncData } from 'utils/extractCncData';

import { appFileExtension } from 'main/appConstants';

import {
  ModalText,
  Button,
  SubButton,
  Container,
  Menu,
  SubMenu,
  Hr,
} from './styles';

const OSMenu: React.FC = () => {
  const dispatch = useDispatch();
  const setNewFile = useSetNewFile();

  const lastFilePath = useSelector(
    (state: { app: App }) => state.app.lastFilePathSaved,
  );
  const isSaved = useSelector((state: { app: App }) => state.app.isSaved);
  const partState = useSelector((state: { part: Part }) => state.part);

  const [isOpen, setIsOpen] = useState(false);
  const [isModalConfirmNewOpen, setIsModalConfirmNewOpen] =
    useState<boolean>(false);
  const [isModalConfirmOpenOpen, setIsModalConfirmOpenOpen] =
    useState<boolean>(false);
  const [isModalMachineDataChangedOpen, setIsModalMachineDataChangedOpen] =
    useState<boolean>(false);
  const [importedFile, setImportedFile] = useState<FileObject | null>(null);
  const [importedFileAux, setImportedFileAux] = useState<FileObject | null>(
    null,
  );

  const menuRef = useRef<HTMLElement | null>(null);

  const toggleMenu = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const newFile = useCallback(() => {
    setNewFile();
    toggleMenu();
  }, [setNewFile, toggleMenu]);

  const handleNewFile = useCallback(() => {
    if (!isSaved) {
      setIsModalConfirmNewOpen(true);
    } else {
      newFile();
    }
    toggleMenu();
  }, [isSaved, newFile, toggleMenu]);

  const openedFileStateUpdate = useCallback(() => {
    dispatch(
      replacePart((importedFile as FileObject).data as unknown as GZemaFile),
    );
    dispatch(
      editApp({
        fileName: (importedFile as FileObject).fileName,
        isSaved: true,
        lastFilePathSaved: (importedFile as FileObject).path,
        lastSavedFileState: JSON.stringify((importedFile as FileObject).data),
        hasSaveStatusUpdate: undefined,
      }),
    );
    setImportedFileAux(null);
  }, [dispatch, importedFile]);

  const handleSetMachineData = useCallback(async () => {
    const { machine } = (importedFile as FileObject).data as GZemaFile;
    const { cncData, toolsData } = extractCncData(machine);
    const importedMachineData: Machine = { ...cncData, ...toolsData };

    try {
      saveMachineDataAtElectronStore(importedMachineData as Machine);
    } catch (error: unknown) {
      alert(`Error setting machine data: ${(error as Error).message}`);
    } finally {
      dispatch(
        editApp({
          hasImportedMachineDataChange: true,
        }),
      );
    }
  }, [dispatch, importedFile]);

  useEffect(() => {
    if (importedFile) {
      if (importedFile.data.machine) handleSetMachineData();

      openedFileStateUpdate();
    }
  }, [handleSetMachineData, importedFile, openedFileStateUpdate]);

  const openFile = useCallback(async () => {
    try {
      let file: FileObject | undefined;

      if (isElectron()) {
        file = await window.electron.ipcRenderer.openFile();
      } else {
        const fileRead: Promise<FileObject> = new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = (e) => {
            const f = e.target?.result;
            if (f) {
              resolve({
                data: JSON.parse(f as string),
                path: undefined,
                fileName: 'Untitled',
              });
            }
          };

          reader.onerror = reject;

          const input = document.createElement('input');
          input.type = 'file';
          input.accept = `.${appFileExtension}`;
          input.onchange = (event) => {
            const files = (event.target as HTMLInputElement)?.files;
            if (files && files.length > 0) {
              const f = files[0];
              reader.readAsText(f);
            }
          };
          input.click();
        });

        file = await fileRead;
      }

      if (file) {
        const { machine } = (file as FileObject).data as GZemaFile;
        const { cncData, toolsData } = extractCncData(machine);

        const importedData: Machine = { ...cncData, ...toolsData };
        const storedData: Machine = await loadMachineData();

        if (JSON.stringify(importedData) !== JSON.stringify(storedData)) {
          setImportedFileAux(file as FileObject);
          setIsModalMachineDataChangedOpen(true);
        } else {
          setImportedFile(file as FileObject);
        }
      }
    } catch (error: unknown) {
      // talvez tenha que reverter algum state se houver erros
      alert(`Error opening file`);
      console.error('Error opening file:', error);
    }
    toggleMenu();
  }, [toggleMenu]);

  const handleOpenFile = useCallback(() => {
    if (!isSaved) {
      setIsModalConfirmOpenOpen(true);
    } else {
      openFile();
    }
    toggleMenu();
  }, [isSaved, openFile, toggleMenu]);

  const saveFileChangeAppState = useCallback(
    async (saveObj: SaveObject) => {
      if (saveObj.success) {
        if (saveObj.saveType === 'saveFile')
          dispatch(editApp({ isSaved: true }));
        else if (saveObj.filePath)
          dispatch(
            editApp({
              fileName: saveObj.filePath.substring(
                saveObj.filePath.lastIndexOf('\\') + 1,
              ),
              isSaved: true,
              lastFilePathSaved: saveObj.filePath,
              lastSavedFileState: JSON.stringify(partState),
            }),
          );
      }
    },
    [dispatch, partState],
  );

  const handleSaveFileAs = useCallback(async () => {
    let saveObj: SaveObject | undefined;
    try {
      const machineData = await loadMachineData();
      const data: GZemaFile = { ...partState, machine: machineData };

      saveObj = await saveFileAs(data);
      saveFileChangeAppState(saveObj);
    } catch (error: unknown) {
      alert(error);
    }
  }, [saveFileChangeAppState, partState]);

  const handleSaveFile = useCallback(async () => {
    if (lastFilePath) {
      let saveObj: SaveObject | undefined;
      try {
        const machineData = await loadMachineData();
        const data: GZemaFile = { ...partState, machine: machineData };

        saveObj = await saveFile(data, lastFilePath);
        saveFileChangeAppState(saveObj);
      } catch (error: unknown) {
        alert(error);
      }
    } else {
      handleSaveFileAs();
    }
  }, [lastFilePath, partState, saveFileChangeAppState, handleSaveFileAs]);

  /* incluir em outro lugar aonde ele não fique remapeando os atalhos,
  corrigir também o problema de ele ficar impedindo atalho em outros softwares */
  // eslint-disable-next-line consistent-return
  // useEffect(() => {
  //   const handleShortcutN = () => handleNewFile();
  //   const handleShortcutO = () => handleOpenFile();
  //   const handleShortcutS = () => handleSaveFile();
  //   const handleShortcutShiftS = () => handleSaveFileAs();

  //   if (isElectron()) {
  //     window.electron.ipcRenderer.on('shortcut-pressed-n', handleShortcutN);
  //     window.electron.ipcRenderer.on('shortcut-pressed-o', handleShortcutO);
  //     window.electron.ipcRenderer.on('shortcut-pressed-s', handleShortcutS);
  //     window.electron.ipcRenderer.on(
  //       'shortcut-pressed-shift-s',
  //       handleShortcutShiftS,
  //     );

  //     return () => {
  //       window.electron.ipcRenderer.removeListener(
  //         'shortcut-pressed-n',
  //         handleShortcutN,
  //       );
  //       window.electron.ipcRenderer.removeListener(
  //         'shortcut-pressed-o',
  //         handleShortcutO,
  //       );
  //       window.electron.ipcRenderer.removeListener(
  //         'shortcut-pressed-s',
  //         handleShortcutS,
  //       );
  //       window.electron.ipcRenderer.removeListener(
  //         'shortcut-pressed-shift-s',
  //         handleShortcutShiftS,
  //       );
  //     };
  //   }
  // }, [
  //   handleNewFile,
  //   handleOpenFile,
  //   handleSaveFile,
  //   handleSaveFileAs,
  //   partState,
  // ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (lastFilePath) dispatch(editApp({ lastFilePathSaved: lastFilePath }));
  }, [dispatch, lastFilePath]);

  return (
    <Container>
      <Menu ref={menuRef}>
        <li>
          <Button onClick={toggleMenu}>Arquivo</Button>
          {isOpen && (
            <SubMenu>
              <SubButton onClick={() => handleNewFile()}>
                Novo
                {/* <SubButtonLabel>Ctrl + N</SubButtonLabel> */}
              </SubButton>
              <SubButton onClick={() => handleOpenFile()}>
                Abrir
                {/* <SubButtonLabel>Ctrl + O</SubButtonLabel> */}
              </SubButton>
              <SubButton onClick={() => handleSaveFile()}>
                Salvar
                {/* <SubButtonLabel>Ctrl + S</SubButtonLabel> */}
              </SubButton>
              <SubButton onClick={() => handleSaveFileAs()}>
                Salvar como...
                {/* <SubButtonLabel>Ctrl + Shift + S</SubButtonLabel> */}
              </SubButton>
              <Hr />
              <SubButton onClick={() => window.electron.ipcRenderer.quitApp()}>
                Sair
                {/* <SubButtonLabel>Ctrl + Q</SubButtonLabel> */}
              </SubButton>
            </SubMenu>
          )}
        </li>
      </Menu>
      {/* Modals */}
      <Modal
        isOpen={isModalConfirmNewOpen}
        onClose={() => {
          setIsModalConfirmNewOpen(false);
        }}
        title="Alerta"
        variation="danger"
      >
        <ModalText>
          Mudanças não salvas serão perdidas. Deseja continuar?
        </ModalText>
        <ConfirmAction
          onConfirm={() => {
            newFile();
            setIsModalConfirmNewOpen(false);
          }}
          onCancel={() => {
            setIsModalConfirmNewOpen(false);
          }}
        />
      </Modal>
      <Modal
        isOpen={isModalConfirmOpenOpen}
        onClose={() => {
          setIsModalConfirmOpenOpen(false);
        }}
        title="Alerta"
        variation="danger"
      >
        <ModalText>
          Mudanças não salvas serão perdidas. Deseja continuar?
        </ModalText>
        <ConfirmAction
          onConfirm={() => {
            openFile();
            setIsModalConfirmOpenOpen(false);
          }}
          onCancel={() => {
            setIsModalConfirmOpenOpen(false);
          }}
        />
      </Modal>
      <Modal
        isOpen={isModalMachineDataChangedOpen}
        onClose={() => setIsModalMachineDataChangedOpen(false)}
        title="Alerta: Subtituição de Dados de Máquina"
        variation="danger"
      >
        <ModalText>
          Os dados de máquina desse arquivo são diferentes dos dados de máquina
          configurados atualmente. Importar irá mudar os dados de máquina
          atuais. Deseja continuar?
        </ModalText>
        <ConfirmAction
          onConfirm={() => {
            setImportedFile(importedFileAux);
            setIsModalMachineDataChangedOpen(false);
          }}
          onCancel={() => {
            setImportedFile(null);
            setIsModalMachineDataChangedOpen(false);
          }}
        />
      </Modal>
    </Container>
  );
};

export default OSMenu;
