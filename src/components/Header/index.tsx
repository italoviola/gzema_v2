import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import OSMenu from 'components/OSMenu';
import MoreMenu from 'components/MoreMenu';

import { MenuItem } from 'components/MoreMenu/interface';

import { editApp } from 'state/app/appSlice';

import { App } from 'types/app';

import logo from '../../../assets/images/zema-logo.png';

import {
  AppMenu,
  Logo,
  Menu,
  Middle,
  MiddleItemHome,
  MiddleItemHomeLink,
  MiddleItemPart,
  MiddleItemPartSpan,
} from './styles';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSaved = useSelector(
    (state: { app: { isSaved: boolean } }) => state.app.isSaved,
  );
  const fileName = useSelector(
    (state: { app: { fileName: string } }) => state.app.fileName,
  );

  const [loaded, setLoaded] = useState(false);
  const [fileStatus, setFileStatus] = useState<boolean>(true);
  const appState = useSelector((state: { app: App }) => state.app);

  useEffect(() => {
    if (fileStatus === false) {
      dispatch(
        editApp({
          isSaved: false,
          lastFilePathSaved: undefined,
          lastSavedFileState: undefined,
        }),
      );
    }
  }, [fileStatus, dispatch]);

  const showUnsavedHighlight = () => {
    if (!isSaved) return '*';
    return '';
  };

  const startFileExistenceCheck = useCallback(
    (filePath: string | undefined) => {
      if (!filePath) return undefined;

      const checkInterval = 1000;

      const intervalId = setInterval(async () => {
        const result = await window.electron.ipcRenderer.checkFile(filePath);
        setFileStatus(result);
      }, checkInterval);

      return intervalId;
    },
    [],
  );

  const moreMenuItems: MenuItem[] = [
    {
      name: 'Configurações',
      action: () => {
        navigate('/config');
      },
    },
    {
      name: 'Máquina',
      action: () => {
        navigate('/machine');
      },
    },
  ];

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (appState.lastFilePathSaved && appState.lastFilePathSaved !== '') {
      const intervalId = startFileExistenceCheck(appState.lastFilePathSaved);

      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    }
    if (appState.lastFilePathSaved === '') {
      setFileStatus(true);
    }
    return undefined;
  }, [appState.lastFilePathSaved, startFileExistenceCheck]);

  return (
    <div>
      <OSMenu />
      <AppMenu className={loaded ? 'loaded' : ''}>
        <Logo>
          <img src={logo} alt="Logo" />
        </Logo>
        <Menu>
          <Middle>
            <MiddleItemHome>
              <MiddleItemHomeLink to="/">Peças</MiddleItemHomeLink>
            </MiddleItemHome>
            <MiddleItemPart to="/" isSaved={isSaved}>
              {fileStatus ? (
                <>
                  {showUnsavedHighlight()}
                  {fileName}
                  {showUnsavedHighlight()}
                </>
              ) : (
                <MiddleItemPartSpan>{fileName}</MiddleItemPartSpan>
              )}
            </MiddleItemPart>
          </Middle>
        </Menu>
        <MoreMenu menuItems={moreMenuItems} />
      </AppMenu>
    </div>
  );
};

export default Header;
