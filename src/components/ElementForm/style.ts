import styled from 'styled-components';
import { colors } from 'styles/global.styles';

export const EditableTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1;

  .save-btn {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 16px;
    padding: 0 5px;

    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
`;

export const EditableTitleInput = styled.input`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  color: white;
  font-size: 18px;
  font-weight: 500;
  padding: 4px 8px;
  margin-right: 8px;
  flex: 1;

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.3);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
`;

export const FormContainer = styled.div`
  border-radius: 5px;
  overflow: hidden;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const FormHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${colors.blueLight};
  color: white;
  padding: 10px 15px;
`;

export const FormTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 500;
`;

export const FormActions = styled.div`
  display: flex;
  gap: 10px;

  button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 4px;

    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }

    &.delete-btn {
      color: #fff;
      background-color: ${colors.red};
    }

    &.edit-label-btn {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
`;

export const FormBody = styled.div`
  display: flex;
  flex-flow: row wrap;
  gap: 15px;
  padding: 15px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const FormLabel = styled.label`
  font-size: 14px;
  margin-bottom: 5px;
  color: #333;
  font-weight: 500;
`;

export const FormInput = styled.input`
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 10px;
  font-size: 14px;

  &:focus {
    border-color: ${colors.blue};
    outline: none;
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;
