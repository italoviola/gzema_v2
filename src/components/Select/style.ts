import styled from 'styled-components';
import { colors, measures } from 'styles/global.styles';

export const Container = styled.div`
  width: 100%;
`;

export const Label = styled.label`
  display: block;
  font-size: 18px;
  color: ${colors.greyFont};
  margin-bottom: 12px;
`;

export const SSelect = styled.select`
  background-color: ${colors.white};
  border: 1px solid ${colors.greyMedium};
  box-sizing: border-box;
  padding: ${measures.gutter};
  width: 100%;
  font-size: 18px;

  &:disabled {
    background-color: ${colors.greyMedium};
    border-color: ${colors.greyMedium};
    cursor: not-allowed;
  }
`;
