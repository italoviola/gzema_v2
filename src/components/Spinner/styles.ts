import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Spinner = styled.div<{ color?: string; size?: string }>`
  border: 4px solid transparent;
  box-sizing: border-box;
  border-left-color: ${({ color }) => color};
  border-right-color: ${({ color }) => color};
  border-radius: 50%;
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
