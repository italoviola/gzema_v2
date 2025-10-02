import styled from 'styled-components';
import { PageTitle, PageContent } from 'styles/Components';
import { measures } from 'styles/global.styles';

export const Container = styled.div`
  width: 100%;
  height: 100%;
`;

export const Content = styled(PageContent)`
  max-height: calc(100vh - ${measures.contentBelowSliderToHeader});
`;

export const Title = styled(PageTitle)``;
