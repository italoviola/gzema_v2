import styled from 'styled-components';
import { colors } from 'styles/global.styles';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: ${colors.greyDark};
  text-align: center;
  height: 100%;
`;
