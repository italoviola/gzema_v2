import React from 'react';

import { ModalProps } from './interface';
import {
  Overlay,
  ModalContainer,
  CloseButton,
  Title,
  Header,
  Content,
  IconClose,
} from './style';

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Overlay>
      <ModalContainer>
        <Header>
          <Title>{title}</Title>
          <CloseButton onClick={onClose}>
            <IconClose className="icon-x" />
          </CloseButton>
        </Header>
        <Content>{children}</Content>
      </ModalContainer>
    </Overlay>
  );
};

export default Modal;