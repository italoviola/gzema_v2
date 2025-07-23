import styled from 'styled-components';
import { colors } from 'styles/global.styles';

interface ListItemProps {
  isSelected: boolean;
}

export const Container = styled.div`
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
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
  transition: background-color 0.2s;

  &:hover {
    background-color: ${(props) =>
      props.isSelected ? colors.blue : colors.blueLight};
  }

  .item-number {
    margin-right: 12px;
    font-weight: bold;
    min-width: 20px;
  }

  .item-label {
    flex: 1;
  }
`;
