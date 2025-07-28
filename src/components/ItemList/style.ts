import styled from 'styled-components';
import { colors } from 'styles/global.styles';

export const Container = styled.div`
  width: 100%;
  overflow: hidden;
`;

export const ListItem = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: ${(props) =>
    props.isSelected ? colors.blueLighter : colors.grey};
  border-bottom: 1px solid ${colors.greyMedium};
  cursor: pointer;
  height: 50px;
  box-sizing: border-box;

  .item-number {
    margin-right: 12px;
    font-weight: bold;
    min-width: 20px;
    color: ${colors.blue};
    border-right: 1px solid ${colors.greyDark};
  }

  .item-label {
    flex: 1;
    font-weight: ${(props) => (props.isSelected ? 'bold' : colors.greyFont)};
    color: ${(props) => (props.isSelected ? colors.blue : colors.greyFont)};
  }
`;
