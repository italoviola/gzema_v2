import styled from 'styled-components';

import Input from 'components/Input';

import { SubTitle } from 'styles/Components';
import { colors } from 'styles/global.styles';

export const Container = styled.div``;

export const MachiningContainer = styled.div`
  margin-bottom: 24px;
`;

export const SSubTitle = styled(SubTitle)`
  margin-bottom: 12px;
`;

export const Field = styled.div`
  margin-bottom: 12px;
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
