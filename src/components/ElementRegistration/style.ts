import styled from 'styled-components';
import Button from 'components/Button';
import { shadows } from 'styles/global.styles';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  gap: 15px;
`;

export const ContentLeft = styled.div`
  flex: 1;
`;

export const SButton = styled(Button)`
  margin-bottom: 15px;
  box-shadow: ${shadows.std};
`;

export const ItemListContainer = styled.div`
  max-height: 210px;
  overflow-y: auto;
  box-shadow: ${shadows.std};
`;

export const ContentRight = styled.div`
  flex: 2;
`;
