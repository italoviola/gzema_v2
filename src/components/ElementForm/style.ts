import Input from 'components/Input';
import styled from 'styled-components';
import { ActionButton, TitleEdit } from 'styles/Components';

import { colors, measures, shadows } from 'styles/global.styles';

export const Container = styled.div`
  border-radius: ${measures.borderRadius};
  overflow: hidden;
  background-color: ${colors.grey};
  box-shadow: ${shadows.std};
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${colors.blue};
  background-color: ${colors.greyPreMedium};
  padding: 10px 15px;
`;

export const EditableTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  height: 25px;
`;

export const STitleEdit = styled(TitleEdit)`
  font-size: 18px;
  width: 100%;
`;

export const Title = styled.h3`
  font-size: 18px;
  display: block;
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 10px;

  button {
    border: none;
    color: white;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: ${measures.borderRadius};

    &.delete-btn {
      color: ${colors.white};
      background-color: ${colors.red};
    }
  }
`;

export const DeleteBtn = styled(ActionButton).attrs(() => ({
  bgColor: colors.red,
  color: colors.white,
}))``;

export const SaveBtn = styled(ActionButton).attrs(() => ({
  bgColor: colors.blue,
  color: colors.white,
}))``;

export const Edit = styled(ActionButton)`
  background-color: inherit;
  width: 56px;
  font-size: 16px;
`;

export const Check = styled(ActionButton)`
  background-color: inherit;
  width: 56px;
  font-size: 16px;
`;

export const FormBody = styled.div`
  display: flex;
  flex-flow: row wrap;
  gap: 15px;
  padding: 15px;
  max-height: 189px;
  overflow-y: auto;
`;

export const SInput = styled(Input)`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 1 1 45%;
  box-sizing: border-box;
  font-size: 14px;

  label {
    font-size: 16px;
  }
  input {
    font-size: 16px;
  }
`;
