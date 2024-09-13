import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Modal from 'components/Modal';
import Button from 'components/Button';
import ApiResponseList from 'components/ApiResponseList';
import ProgramsToSendList from 'components/ProgramsToSendList';
import Spinner from 'components/Spinner';
import ConfirmAction from 'components/ConfirmAction';

import { generateGCodeForPart } from 'integration/mount-gcode';

import { editApp } from 'state/app/appSlice';

import { Part } from 'types/part';
import { Response } from 'types/api';

import { colors } from 'styles/global.styles';
import {
  MenuContainer,
  ModalText,
  Menu,
  List,
  ListItem,
  StyledLink,
  ItemBtn,
  StyledIcon,
  ItemSimple,
  ModalDetail,
  ModalContent,
  ModalContentMax,
} from './styles';

const SideMenu: React.FC = () => {
  const part = useSelector((state: { part: Part }) => state.part);
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalResumeOpen, setIsModalResumeOpen] = useState<boolean>(false);
  const [isModalConfirmOpen, setIsModalConfirmOpen] = useState<boolean>(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [response, setResponse] = useState<Response | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateGCodeForOperations = async () => {
    const hasEmptyContoursIds = part.operations.some(
      (operation) => operation.contoursIds.length === 0,
    );
    if (part.operations.length === 0 || hasEmptyContoursIds) {
      setModalMessage(
        'Não é possível gerar programas sem operações ou com operações sem contornos.',
      );
    } else {
      setIsLoading(true);
      const generatedCodes: string[] = generateGCodeForPart(part);

      dispatch(editApp({ lastGeneratedCodes: generatedCodes }));

      try {
        const res = await window.electron.ipcRenderer.saveGCode(generatedCodes);
        setResponse(res);
      } catch (error) {
        setModalMessage('Problemas de conexão com o serviço.');
      } finally {
        setIsLoading(false);
      }
    }
    setIsModalOpen(true);
  };

  useEffect(() => {
    setResponse(null);
    setModalMessage(null);
  }, [part]);

  useEffect(() => {
    if (response?.statusCode !== 200) {
      setModalMessage(
        'Um ou mais programas retornou um erro. Verifique os detalhes abaixo:',
      );
    } else {
      setModalMessage(null);
    }
  }, [response]);

  useEffect(() => {
    setLoaded(true);
  }, []);
  return (
    <MenuContainer>
      <Modal
        title={
          response?.statusCode === 200
            ? 'Programas enviados!'
            : 'Erro ao enviar programas'
        }
        variation={response?.statusCode === 200 ? 'default' : 'danger'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <ModalContent>
          {modalMessage && <ModalText>{modalMessage}</ModalText>}
          {response?.message &&
            response?.statusCode !== 200 &&
            !response.data && (
              <ModalDetail>
                {response.statusCode}. {response.message}
              </ModalDetail>
            )}
          {response?.data && <ApiResponseList data={response.data} />}
        </ModalContent>
        <Button
          onClick={() => setIsModalOpen(false)}
          color={response?.statusCode === 200 ? colors.blue : colors.red}
          bgColor={colors.white}
          borderColor={response?.statusCode === 200 ? colors.blue : colors.red}
        >
          OK
        </Button>
      </Modal>
      <Modal
        title="Resumo"
        isOpen={isModalResumeOpen}
        onClose={() => setIsModalResumeOpen(false)}
      >
        <ModalContentMax>
          <ProgramsToSendList />
        </ModalContentMax>
        <ConfirmAction
          confirmText="Salvar e enviar"
          cancelText="Cancelar"
          onConfirm={() => {
            setIsModalResumeOpen(false);
            setIsModalConfirmOpen(true);
          }}
          onCancel={() => setIsModalResumeOpen(false)}
          variation="positive"
        />
      </Modal>
      <Modal
        title="Enviar programas"
        isOpen={isModalConfirmOpen}
        onClose={() => setIsModalConfirmOpen(false)}
      >
        <ModalText>Deseja enviar programas para o CNC?</ModalText>
        <ConfirmAction
          onConfirm={() => {
            setIsModalConfirmOpen(false);
            generateGCodeForOperations();
          }}
          onCancel={() => {
            setIsModalConfirmOpen(false);
          }}
          variation="positive"
        />
      </Modal>
      <Menu className={loaded ? 'loaded' : ''}>
        <List>
          <ListItem>
            <StyledLink to="/workgroup">
              <StyledIcon
                className="icon-make-group"
                color={colors.white}
                fontSize="28px"
              />
            </StyledLink>
          </ListItem>
          <ListItem>
            <StyledLink to="/">
              <StyledIcon
                className="icon-remove_red_eye"
                color={colors.white}
                fontSize="28px"
              />
            </StyledLink>
          </ListItem>
        </List>
        <List>
          <ListItem>
            <ItemBtn onClick={() => setIsModalResumeOpen(true)}>
              <StyledIcon
                className="icon-code"
                color={colors.white}
                fontSize="28px"
              />
            </ItemBtn>
          </ListItem>
          <ListItem>
            {!isLoading ? (
              <ItemBtn onClick={() => generateGCodeForOperations()}>
                <StyledIcon
                  className="icon-double_arrow"
                  color={colors.white}
                  fontSize="28px"
                />
              </ItemBtn>
            ) : (
              <ItemSimple>
                <Spinner />
              </ItemSimple>
            )}
          </ListItem>
        </List>
      </Menu>
    </MenuContainer>
  );
};

export default SideMenu;
