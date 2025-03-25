import styled from 'styled-components';

import { ButtonProps } from 'components/Button/interface';

import { ContentBlock } from 'styles/Components';
import { measures } from 'styles/global.styles';

export const Container = styled.div``;

export const TabMenuContainer = styled.div`
  display: flex;
`;

export const Tab = styled.button<
  ButtonProps & { shadow: string; weight: string }
>`
  background-color: ${(props) => props.bgColor};
  color: ${(props) => props.color};
  padding: 12px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
  border-radius: ${measures.borderRadius} ${measures.borderRadius} 0 0;
  width: 100%;
  border: none;
  font-size: 16px;
  box-shadow: ${(props) => props.shadow};
  font-weight: ${(props) => props.weight};
`;

export const SContentBlock = styled(ContentBlock)`
  max-height: 100%;
`;
