import styled from 'styled-components';
import { ButtonProps } from './interface';

export const StyledButton = styled.button<ButtonProps>`
  background-color: ${(props) => props.bgColor};
  border: none;
  color: ${(props) => props.color};
  padding: 12px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
  border-radius: 5px;
  width: 100%;
  border: 1px solid ${(props) => props.borderColor};
`;