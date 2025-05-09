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
import { setMachineData } from 'utils/setMachineData';
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
  // SubButtonLabel,
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
  const [importedMachineState, setImportedMachineData] =
    useState<Machine | null>(null);
  const [importedFile, setImportedFile] = useState<FileObject | null>(null);

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

  const handleSetMachineData = useCallback(async () => {
    setMachineData(importedMachineState as Machine);
    dispatch(
      editApp({
        hasMachineDataChange: true,
      }),
    );
  }, [dispatch, importedMachineState]);

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
      }),
    );
  }, [dispatch, importedFile]);

  const openFile = useCallback(async () => {
    try {
      let file: FileObject | undefined;

      if (isElectron()) {
        file = await window.electron.ipcRenderer.openFile();
        setImportedFile(file as FileObject);
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
        setImportedFile(file as FileObject);
      }

      if (file) {
        const { machine } = (file as FileObject).data as GZemaFile;
        const { cncData, toolsData } = extractCncData(machine);

        const importedData: Machine = { ...cncData, ...toolsData };
        const storedData: Machine = await loadMachineData();
        setImportedMachineData(importedData);

        if (JSON.stringify(importedData) !== JSON.stringify(storedData)) {
          setIsModalMachineDataChangedOpen(true);
          console.log('Machine data has changed:', {
            imported: importedData,
            stored: storedData,
          });
        } else {
          openedFileStateUpdate();
        }
      }
    } catch (error: unknown) {
      alert(`Error opening file`);
    }
    toggleMenu();
  }, [toggleMenu, openedFileStateUpdate]);

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
      console.log('data', data);
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
        // adicionar verificação pra avisar se alterou o machine de acordo com o arquivo ou não
        const data: GZemaFile = { ...partState, machine: machineData };
        console.log('data', data);
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
            handleSetMachineData();
            setImportedMachineData(null);
            openedFileStateUpdate();
            setIsModalMachineDataChangedOpen(false);
          }}
          onCancel={() => {
            setImportedMachineData(null);
            setImportedFile(null);
            setIsModalMachineDataChangedOpen(false);
          }}
        />
      </Modal>
    </Container>
  );
};

export default OSMenu;
