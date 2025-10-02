import styled, { css } from 'styled-components';
import { PageTitle, ContentBlock, Link, TitleEdit } from 'styles/Components';
import { colors, measures } from 'styles/global.styles';

import LinkAction from 'components/LinkAction';
import Icon from 'components/Icon';

export const Container = styled.div`
  width: 100%;
`;

export const BackBtn = styled(Link)`
  display: inline-block;
  font-size: 14px;
  margin-bottom: 4px;
  padding: 4px 4px 4px 0;
  color: ${colors.blueLight};
`;

export const BackBtnContent = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
`;

export const IconBack = styled(Icon)`
  transform: rotate(-90deg);
  color: inherit;
`;

export const PageHead = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${measures.gutter};
`;

export const ChartContainer = styled.div`
  overflow: hidden;
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
`;

export const DressingLabelsContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
`;

export const DressingLabels = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: left;
  gap: ${measures.gutter};
  color: ${colors.greyFont};
`;

export const DressingItem = styled.div`
  margin-bottom: 24px;
`;

export const SLinkAction = styled(LinkAction)`
  font-weight: bold;
  color: ${colors.blueDark};
`;

export const Title = styled(PageTitle)`
  display: block;
  margin: 0;
`;

export const STitleEdit = styled(TitleEdit)`
  font-size: 30px;
  font-weight: bold;
`;

export const TitleEditBtn = styled.button`
  background-color: inherit;
  outline: 0;
  border: 0;
  cursor: pointer;
`;

export const TitleEditIconEdit = styled.span`
  font-size: 24px;
  color: ${colors.blue};
`;

export const TitleEditIconDone = styled.span`
  font-size: 24px;
  color: ${colors.greyFont};
`;

export const CodePreviewBtn = styled.button`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  align-self: flex-end;
  background-color: ${colors.blue};
  color: ${colors.white};
  border: 0;
  height: 40px;
  font-size: 18px;
  cursor: pointer;
  border-radius: ${measures.borderRadius};
  padding: 0 10px;
`;

export const ShowChartBtn = styled(CodePreviewBtn)`
  background-color: ${colors.white};
  color: ${colors.blue};
  border: 1px solid ${colors.blue};
`;

export const BtnText = styled.span`
  margin-left: 5px;
`;

export const Block = styled(ContentBlock)<{ showChart?: boolean }>`
  background-color: ${colors.grey};
  width: 100%;
  height: 100%;
  padding: ${measures.gutter} 10px;
  box-sizing: border-box;
  max-height: ${({ showChart = true }) =>
    showChart
      ? `calc(100vh - ${measures.contentBelowChartToHeader})`
      : `calc(100vh - ${measures.contentToHeader})`};
`;

export const TableWrapper = styled.div``;

export const Table = styled.table`
  width: 100%;
  table-layout: auto;
`;

export const TableHead = styled.thead`
  text-align: left;
  font-size: 18px;
  font-weight: bold;
`;

export const TableDesc = styled.thead`
  text-align: left;
  font-size: 14px;
`;

export const TableH = styled.th`
  padding: 0 2px 10px 2px;
`;

export const HText = styled.p`
  padding: 5px;
  border-bottom: 1px solid ${colors.greyMedium};
  color: ${colors.greyLogo};
`;

export const HDesc = styled.p`
  padding: 0 5px;
  border-bottom: 0;
  color: ${colors.greyFont};
`;

export const TableBody = styled.tbody`
  width: auto;
`;

export const TableD = styled.td`
  padding: 2px;
`;

export const TableIdText = styled.p`
  color: ${colors.greyFont};
  padding: 5px;
`;

export const TableDivision = styled.p`
  color: ${colors.greyDark};
  padding: 5px;
`;

export const TableInput = styled.input`
  background-color: ${colors.white};
  border: 1px solid ${colors.greyMedium};
  box-sizing: border-box;
  padding: 10px 10px;
  width: 100%;
  font-size: 16px;
`;

export const TableDContent = styled.div`
  position: relative;
  height: 40px;
  width: 100%;
`;

export const TableInputLabeled = styled.input`
  background-color: ${colors.white};
  border: 1px solid ${colors.greyMedium};
  box-sizing: border-box;
  padding: 10px 10px 10px 35px;
  height: 40px;
  width: 100%;
  font-size: 16px;

  &:disabled {
    background-color: ${colors.greyMedium};
    opacity: 0.3;
  }

  &::placeholder {
    color: ${colors.greyMedium};
  }
`;

export const TableInputLabel = styled.label`
  position: absolute;
  top: 0;
  width: 30px;
  line-height: 30px;
  background-color: ${colors.greyMedium};
  border-radius: ${measures.borderRadius} 0 0 ${measures.borderRadius};
  color: ${colors.greyLogo};
  padding: 5px;
  height: 100%;
  box-sizing: border-box;
  font-weight: bold;
  text-align: center;
`;

export const TableScroll = styled.div``;

export const ScrollBtn = styled.button<{ bgColor: string; color: string }>`
  background-color: ${(props) => props.bgColor};
  color: ${(props) => props.color};
  border: 0;
  margin: 0;
  font-size: 22px;
  line-height: 22px;
  width: 30px;
  height: 40px;
  padding: 5px 0;
  vertical-align: middle;
  border-radius: ${measures.borderRadius};
  font-weight: bolder;
  cursor: pointer;
  box-sizing: border-box;
`;

export const RotatedIcon = styled(Icon)`
  transform: rotate(-90deg);
`;

export const AddBtn = styled.button`
  background-color: ${colors.green};
  border: 0;
  color: ${colors.white};
  font-size: 18px;
  line-height: 18px;
  width: 30px;
  height: 30px;
  padding: 5px 0;
  vertical-align: middle;
  border-radius: 100%;
  font-weight: bolder;
  cursor: pointer;
`;

export const DeleteBtn = styled.button`
  background-color: ${colors.red};
  border: 0;
  color: ${colors.white};
  font-size: 24px;
  line-height: 24px;
  width: 40px;
  height: 40px;
  padding: 5px 0;
  vertical-align: middle;
  border-radius: ${measures.borderRadius};
  cursor: pointer;
`;

export const RowActionsStack = styled.div`
  position: relative;
  width: 34px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StackMainBtn = styled(ScrollBtn)`
  width: 34px;
  height: 34px;
  min-height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  padding: 0;
`;

export const StackFloat = styled.div`
  position: absolute;
  top: -4px;
  left: -4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px;
  background: rgba(30, 52, 79, 0.85);
  backdrop-filter: blur(2px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
  transform-origin: top left;
  opacity: 0;
  transform: translateY(-6px) scale(0.9);
  pointer-events: none;
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
  z-index: 10;

  ${RowActionsStack}:hover &,
  ${RowActionsStack}:focus-within & {
    opacity: 1;
    transform: translateY(0) scale(1);
    pointer-events: auto;
  }

  button {
    width: 30px;
    height: 30px;
    min-height: 30px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const RowActionsInline = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 6px;
  position: relative;
`;

export const RepositionWrapper = styled.div.attrs({
  'data-reposition-wrapper': 'true',
} as React.HTMLAttributes<HTMLDivElement>)`
  position: relative;
  display: flex;
  align-items: center;
`;

export const MenuToggleBtn = styled.button<{ $active?: boolean }>`
  background-color: ${colors.blue};
  border: 0;
  color: ${colors.white};
  width: 30px;
  height: 30px;
  padding: 0;
  border-radius: ${measures.borderRadius};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    background-color: ${colors.greyMedium};
    cursor: not-allowed;
    opacity: 0.5;
  }

  ${({ $active }) =>
    $active &&
    css`
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    `}
`;

export const RepositionMenuFloating = styled.div<{
  open: boolean;
  top: number;
  left: number;
}>`
  position: fixed;
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
  display: ${({ open }) => (open ? 'flex' : 'none')};
  transform: translateX(-6px);
  flex-direction: column;
  gap: 4px;
  padding: 6px;
  background: ${colors.blue};
  backdrop-filter: blur(2px);
  border-radius: 8px;
  box-shadow: 10px 4px 14px rgba(0, 0, 0, 0.35);
  z-index: 9999;
  pointer-events: ${({ open }) => (open ? 'auto' : 'none')};

  button {
    width: 34px;
    height: 34px;
    min-height: 34px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
