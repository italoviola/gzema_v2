import styled from 'styled-components';

import Button from 'components/Button';
import SelectComponent from 'components/Select';

import { PageTitle, PageContent, ContentBlock } from 'styles/Components';
import { colors, measures } from 'styles/global.styles';

export const Container = styled.div`
  width: 100%;
`;

export const Content = styled(PageContent)``;

export const Title = styled(PageTitle)``;

export const ButtonsHeader = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: 5px;
  margin-bottom: 10px;
`;

export const SContentBlock = styled(ContentBlock)`
  height: calc(100vh - ${measures.contentBellowBtnToHeader});
  overflow: auto;
`;

export const Field = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  border-bottom: 1px solid ${colors.greyPreMedium};
`;

export const Label = styled.label`
  width: 50%;
  font-size: 16px;
  color: ${colors.greyFont};
`;

export const SSelect = styled(SelectComponent)``;

export const SButton = styled(Button)`
  width: auto;
  margin-top: 15px;
`;

export const ContentText = styled.div<{ color: string }>`
  padding: 10px;
  font-size: 14px;
  background-color: ${colors.white};
  border: 1px solid ${(props) => props.color};
  color: ${(props) => props.color};
  text-align: center;
  margin-left: 10px;
  min-width: 100px;
`;

export const EditButton = styled.button`
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    opacity: 0.8;
  }
`;

export const Wrap = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

export const BtnText = styled.p`
  margin-left: 5px;
  line-height: 27px;
  font-size: 18px;
`;
