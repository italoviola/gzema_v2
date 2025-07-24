import styled from 'styled-components';
import { colors } from 'styles/global.styles';

interface ListItemProps {
  isSelected: boolean;
}

export const Container = styled.div`
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
`;

export const ListItem = styled.div<ListItemProps>`
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: ${(props) =>
    props.isSelected ? colors.blueLight : colors.grey};
  color: ${(props) => (props.isSelected ? colors.white : colors.blue)};
  border-bottom: 1px solid #ddd;
  cursor: pointer;

  .item-number {
    margin-right: 12px;
    font-weight: bold;
    min-width: 20px;
  }

  .item-label {
    flex: 1;
  }
`;
