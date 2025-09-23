import { StoredCncData, Tools } from 'types/api';
import { FormState } from './interface';

export const mapFormStateToStoredCncData = (
  fState: FormState,
): StoredCncData => {
  return {
    notationPattern: Number(fState.notationPattern.value),
    hasBAxis: Number(fState.hasBAxis.value),
    maxRectifiableLength: String(fState.maxRectifiableLength.value),
    maxRectifiableDiameter: String(fState.maxRectifiableDiameter.value),
  };
};

export const mapFormStateToStoredToolsData = (fState: FormState): Tools => {
  return {
    tool1Var: Number(fState.tool1Var.value),
    tool1fixedDiamondQtd: Number(fState.tool1fixedDiamondQtd.value),
    tool1refractableDiamondQtd: Number(fState.tool1refractableDiamondQtd.value),
    tool1dressingDiscQtd: Number(fState.tool1dressingDiscQtd.value),
    tool1fixedDressingRollerQtd: Number(
      fState.tool1fixedDressingRollerQtd.value,
    ),
    tool1sCtrlMovableDressingRollerQtd: Number(
      fState.tool1sCtrlMovableDressingRollerQtd.value,
    ),
    tool2Var: Number(fState.tool2Var.value),
    tool2fixedDiamondQtd: Number(fState.tool2fixedDiamondQtd.value),
    tool2refractableDiamondQtd: Number(fState.tool2refractableDiamondQtd.value),
    tool2dressingDiscQtd: Number(fState.tool2dressingDiscQtd.value),
    tool2fixedDressingRollerQtd: Number(
      fState.tool2fixedDressingRollerQtd.value,
    ),
    tool2sCtrlMovableDressingRollerQtd: Number(
      fState.tool2sCtrlMovableDressingRollerQtd.value,
    ),
    tool3Var: Number(fState.tool3Var.value),
    tool3fixedDiamondQtd: Number(fState.tool3fixedDiamondQtd.value),
    tool3refractableDiamondQtd: Number(fState.tool3refractableDiamondQtd.value),
    tool3dressingDiscQtd: Number(fState.tool3dressingDiscQtd.value),
    tool3fixedDressingRollerQtd: Number(
      fState.tool3fixedDressingRollerQtd.value,
    ),
    tool3sCtrlMovableDressingRollerQtd: Number(
      fState.tool3sCtrlMovableDressingRollerQtd.value,
    ),
    tool4Var: Number(fState.tool4Var.value),
    tool4fixedDiamondQtd: Number(fState.tool4fixedDiamondQtd.value),
    tool4refractableDiamondQtd: Number(fState.tool4refractableDiamondQtd.value),
    tool4dressingDiscQtd: Number(fState.tool4dressingDiscQtd.value),
    tool4fixedDressingRollerQtd: Number(
      fState.tool4fixedDressingRollerQtd.value,
    ),
    tool4sCtrlMovableDressingRollerQtd: Number(
      fState.tool4sCtrlMovableDressingRollerQtd.value,
    ),
  };
};
