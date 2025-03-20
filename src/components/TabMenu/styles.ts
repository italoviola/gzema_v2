import Button from 'components/Button';
import styled from 'styled-components';
import { ContentBlock } from 'styles/Components';
import { measures } from 'styles/global.styles';

export const Container = styled.div``;

export const TabMenuContainer = styled.div`
  display: flex;
`;

export const Tab = styled(Button)`
  font-weight: bold;
  // n funciona?
  border-radius: 0 0 ${measures.borderRadius} ${measures.borderRadius};
`;

export const SContentBlock = styled(ContentBlock)`
  max-height: 100%;
`;
