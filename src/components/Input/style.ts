import styled from 'styled-components';
import { colors } from 'styles/global.styles';

interface Direction {
  direction: 'row' | 'column';
}

export const Container = styled.div<Direction>`
  display: flex;
  flex-direction: ${({ direction }) => direction || 'row'};
  justify-content: stretch;
`;

export const Label = styled.label<Direction>`
  display: block;
  font-size: 18px;
  color: ${colors.greyFont};
  margin-bottom: ${({ direction }) => (direction === 'row' ? 0 : '12px')};
  align-self: ${({ direction }) =>
    direction === 'row' ? 'center' : 'flex-start'};
  flex-grow: 1;
`;

export const SInput = styled.input<{
  error?: boolean;
  direction: 'row' | 'column';
}>`
  background-color: ${colors.white};
  border: 1px solid ${({ error }) => (error ? colors.red : colors.greyMedium)};
  box-sizing: border-box;
  padding: 15px;
  width: ${({ direction }) => (direction === 'row' ? 'auto' : '100%')};
  font-size: 18px;
  flex-grow: 2;

  &:disabled {
    background-color: ${colors.greyMedium};
    border-color: ${colors.greyMedium};
    cursor: not-allowed;
  }

  &::placeholder {
    color: ${colors.greyDark};
    font-style: italic;
  }
`;
