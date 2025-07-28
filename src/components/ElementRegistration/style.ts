import styled from 'styled-components';
import Button from 'components/Button';
import { measures, shadows } from 'styles/global.styles';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  gap: ${measures.gutter};
`;

export const ContentLeft = styled.div`
  flex: 1;
`;

export const SButton = styled(Button)`
  margin-bottom: ${measures.gutter};
  box-shadow: ${shadows.std};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

export const ItemListContainer = styled.div`
  max-height: 202px;
  overflow-y: auto;
  box-shadow: ${shadows.std};
  border-radius: ${measures.borderRadius};
`;

export const ContentRight = styled.div`
  flex: 2;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  height: 267px;
`;
