import styled from 'styled-components';

import Input from 'components/Input';

import { SubTitle } from 'styles/Components';
import { colors } from 'styles/global.styles';

export const Container = styled.div``;

export const GrindingContainer = styled.div``;

export const DressingContainer = styled.div`
  padding-top: 12px;
`;

export const SSubTitle = styled(SubTitle)`
  margin-bottom: 12px;
`;

export const Dressing = styled.div`
  padding-top: 12px;
`;

export const GrindingField = styled.div`
  margin-bottom: 12px;
`;

export const DressingField = styled.div`
  padding-bottom: 12px;
  border-bottom: 1px solid ${colors.greyMedium};
  margin-bottom: 12px;

  &:last-of-type {
    border-bottom: 0;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

export const ToolName = styled.p`
  color: ${colors.blue};
  font-size: 18px;
  margin-bottom: 12px;
`;

export const FieldContent = styled.div`
  display: flex;
  flex-flow: row nowrap;
`;

export const SInput = styled(Input)`
  flex-grow: 1;
`;

export const EditButton = styled.button`
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
`;
