import styled from 'styled-components';

export const Container = styled.div``;

export const TabMenuContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #ccc;
`;

export const Tab = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  cursor: pointer;
  background: ${({ active }) => (active ? '#fff' : '#f1f1f1')};
  border: none;
  border-bottom: ${({ active }) => (active ? '2px solid #000' : 'none')};
  outline: none;

  &:hover {
    background: #e1e1e1;
  }
`;

export const TabContent = styled.div`
  padding: 20px;
  background: #fff;
  border: 1px solid #ccc;
  border-top: none;
`;
