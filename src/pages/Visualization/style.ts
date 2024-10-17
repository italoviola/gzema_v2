import styled from 'styled-components';
import { PageTitle, PageContent } from 'styles/Components';

export const Container = styled.div`
  width: 100%;
  opacity: 0;
  transition: all 1s;

  &.loaded {
    opacity: 1;
  }
`;

export const Content = styled(PageContent)``;

export const Title = styled(PageTitle)``;
