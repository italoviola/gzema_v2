import { defaultData } from 'utils/loadCncData';
import { defaultTools } from 'utils/loadTools';

import { StoredCncData, Tools } from 'types/api';

import {
  NOTATION_JUNKER,
  NOTATION_ZEMA,
  TYPE_EXTERNAL,
  TYPE_INTERNAL,
} from 'utils/constants';

import { FormState, RenderFieldProps } from './interface';

// Initial state and field properties for the machine data form
export const initialState: FormState = {
  notationPattern: {
    value: defaultData.notationPattern,
    options: [
      { label: 'Zema', value: NOTATION_ZEMA },
      { label: 'Junker', value: NOTATION_JUNKER },
    ],
    error: false,
    message: undefined,
  },
  hasBAxis: {
    value: defaultData.hasBAxis,
    options: [
      { label: 'Não', value: 0 },
      { label: 'Sim', value: 1 },
    ],
    error: false,
    message: undefined,
  },
  maxRectifiableLength: {
    value: `${MAX_RECT_LEN_DEFAULT}`,
    inputType: 'text',
    error: false,
    message: undefined,
  },
  maxRectifiableDiameter: {
    value: `${MAX_RECT_DIAM_DEFAULT}`,
    inputType: 'text',
    error: false,
    message: undefined,
  },
  tool1Var: {
    value: defaultTools.tool1Var,
    options: [
      { label: 'Inexistente', value: 0 },
      { label: 'Externo', value: TYPE_EXTERNAL },
      { label: 'Interno', value: TYPE_INTERNAL },
    ],
    error: false,
    message: undefined,
  },
  tool1fixedDiamondQtd: {
    value: defaultTools.tool1fixedDiamondQtd,
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: 3 },
      { label: '4', value: 4 },
    ],
    error: false,
    message: undefined,
  },
  tool1refractableDiamondQtd: {
    value: defaultTools.tool1refractableDiamondQtd,
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: 3 },
      { label: '4', value: 4 },
    ],
    error: false,
    message: undefined,
  },
  tool1dressingDiscQtd: {
    value: defaultTools.tool1dressingDiscQtd,
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
    ],
    error: false,
    message: undefined,
  },
  tool1fixedDressingRollerQtd: {
    value: defaultTools.tool1fixedDressingRollerQtd,
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
    ],
    error: false,
    message: undefined,
  },
  tool1sCtrlMovableDressingRollerQtd: {
    value: defaultTools.tool1sCtrlMovableDressingRollerQtd,
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
    ],
    error: false,
    message: undefined,
  },
  tool2Var: {
    value: defaultTools.tool2Var,
    options: [
      { label: 'Inexistente', value: 0 },
      { label: 'Externo', value: TYPE_EXTERNAL },
      { label: 'Interno', value: TYPE_INTERNAL },
    ],
    error: false,
    message: undefined,
  },
  tool2fixedDiamondQtd: {
    value: defaultTools.tool2fixedDiamondQtd,
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: 3 },
      { label: '4', value: 4 },
    ],
    error: false,
    message: undefined,
  },
  tool2refractableDiamondQtd: {
    value: defaultTools.tool2refractableDiamondQtd,
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: 3 },
      { label: '4', value: 4 },
    ],
    error: false,
    message: undefined,
  },
  tool2dressingDiscQtd: {
    value: defaultTools.tool2dressingDiscQtd,
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
    ],
    error: false,
    message: undefined,
  },
  tool2fixedDressingRollerQtd: {
    value: defaultTools.tool2fixedDressingRollerQtd,
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
    ],
    error: false,
    message: undefined,
  },
  tool2sCtrlMovableDressingRollerQtd: {
    value: defaultTools.tool2sCtrlMovableDressingRollerQtd,
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
    ],
    error: false,
    message: undefined,
  },
  tool3Var: {
    value: defaultTools.tool3Var,
    options: [
      { label: 'Inexistente', value: 0 },
      { label: 'Externo', value: TYPE_EXTERNAL },
      { label: 'Interno', value: TYPE_INTERNAL },
    ],
    error: false,
    message: undefined,
  },
  tool3fixedDiamondQtd: {
    value: defaultTools.tool3fixedDiamondQtd,
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: 3 },
      { label: '4', value: 4 },
    ],
    error: false,
    message: undefined,
  },
  tool3refractableDiamondQtd: {
    value: defaultTools.tool3refractableDiamondQtd,
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: 3 },
      { label: '4', value: 4 },
    ],
    error: false,
    message: undefined,
  },
  tool3dressingDiscQtd: {
    value: defaultTools.tool3dressingDiscQtd,
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
    ],
    error: false,
    message: undefined,
  },
  tool3fixedDressingRollerQtd: {
    value: defaultTools.tool3fixedDressingRollerQtd,
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
    ],
    error: false,
    message: undefined,
  },
  tool3sCtrlMovableDressingRollerQtd: {
    value: defaultTools.tool3sCtrlMovableDressingRollerQtd,
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
    ],
    error: false,
    message: undefined,
  },
  tool4Var: {
    value: defaultTools.tool4Var,
    options: [
      { label: 'Inexistente', value: 0 },
      { label: 'Externo', value: TYPE_EXTERNAL },
      { label: 'Interno', value: TYPE_INTERNAL },
    ],
    error: false,
    message: undefined,
  },
  tool4fixedDiamondQtd: {
    value: defaultTools.tool4fixedDiamondQtd,
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: 3 },
      { label: '4', value: 4 },
    ],
    error: false,
    message: undefined,
  },
  tool4refractableDiamondQtd: {
    value: defaultTools.tool4refractableDiamondQtd,
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: 3 },
      { label: '4', value: 4 },
    ],
    error: false,
    message: undefined,
  },
  tool4dressingDiscQtd: {
    value: defaultTools.tool4dressingDiscQtd,
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
    ],
    error: false,
    message: undefined,
  },
  tool4fixedDressingRollerQtd: {
    value: defaultTools.tool4fixedDressingRollerQtd,
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
    ],
    error: false,
    message: undefined,
  },
  tool4sCtrlMovableDressingRollerQtd: {
    value: defaultTools.tool4sCtrlMovableDressingRollerQtd,
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
    ],
    error: false,
    message: undefined,
  },
};

export const fieldsProps: RenderFieldProps = [
  {
    label: 'Padrão de Notação (Zema ou Junker)',
    name: 'notationPattern',
    type: 'number',
    inputType: 'select',
    options: [
      { label: 'Zema', value: NOTATION_ZEMA },
      { label: 'Junker', value: NOTATION_JUNKER },
    ],
  },
  {
    label: 'Possui Eixo B',
    name: 'hasBAxis',
    type: 'number',
    inputType: 'select',
    options: [
      { label: 'Não', value: 0 },
      { label: 'Sim', value: 1 },
    ],
  },
  {
    label: 'Comprimento Máximo Retificável',
    name: 'maxRectifiableLength',
    type: 'text',
    inputType: 'text',
    placeholder: 'Ex: 500mm',
  },
  {
    label: 'Diâmetro Máximo Retificável',
    name: 'maxRectifiableDiameter',
    type: 'text',
    inputType: 'text',
    placeholder: 'Ex: 300mm',
  },
  {
    label: 'Tipo do Rebolo 1',
    name: 'tool1Var',
    type: 'number',
    options: [
      { label: 'Inexistente', value: 0 },
      { label: 'Externo', value: TYPE_EXTERNAL },
      { label: 'Interno', value: TYPE_INTERNAL },
    ],
  },
  {
    label: 'Qtd. Diamante Fixo do Rebolo 1',
    name: 'tool1fixedDiamondQtd',
    type: 'number',
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: 3 },
      { label: '4', value: 4 },
    ],
  },
  {
    label: 'Qtd. Diamante Abatível do Rebolo 1',
    name: 'tool1refractableDiamondQtd',
    type: 'number',
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: 3 },
      { label: '4', value: 4 },
    ],
  },
  {
    label: 'Qtd. Disco Dressador do Rebolo 1',
    name: 'tool1dressingDiscQtd',
    type: 'number',
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
    ],
  },
  {
    label: 'Qtd. Rolo Dressador Fixo do Rebolo 1',
    name: 'tool1fixedDressingRollerQtd',
    type: 'number',
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
    ],
  },
  {
    label: 'Qtd. Rolo Dressador Móvel c/ Servo do Rebolo 1',
    name: 'tool1sCtrlMovableDressingRollerQtd',
    type: 'number',
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
    ],
  },
  {
    label: 'Tipo do Rebolo 2',
    name: 'tool2Var',
    type: 'number',
    options: [
      { label: 'Inexistente', value: 0 },
      { label: 'Externo', value: TYPE_EXTERNAL },
      { label: 'Interno', value: TYPE_INTERNAL },
    ],
  },
  {
    label: 'Qtd. Diamante Fixo do Rebolo 2',
    name: 'tool2fixedDiamondQtd',
    type: 'number',
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: 3 },
      { label: '4', value: 4 },
    ],
  },
  {
    label: 'Qtd. Diamante Abatível do Rebolo 2',
    name: 'tool2refractableDiamondQtd',
    type: 'number',
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: 3 },
      { label: '4', value: 4 },
    ],
  },
  {
    label: 'Qtd. Disco Dressador do Rebolo 2',
    name: 'tool2dressingDiscQtd',
    type: 'number',
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
    ],
  },
  {
    label: 'Qtd. Rolo Dressador Fixo do Rebolo 2',
    name: 'tool2fixedDressingRollerQtd',
    type: 'number',
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
    ],
  },
  {
    label: 'Qtd. Rolo Dressador Móvel c/ Servo do Rebolo 2',
    name: 'tool2sCtrlMovableDressingRollerQtd',
    type: 'number',
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
    ],
  },
  {
    label: 'Tipo do Rebolo 3',
    name: 'tool3Var',
    type: 'number',
    options: [
      { label: 'Inexistente', value: 0 },
      { label: 'Externo', value: TYPE_EXTERNAL },
      { label: 'Interno', value: TYPE_INTERNAL },
    ],
  },
  {
    label: 'Qtd. Diamante Fixo do Rebolo 3',
    name: 'tool3fixedDiamondQtd',
    type: 'number',
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: 3 },
      { label: '4', value: 4 },
    ],
  },
  {
    label: 'Qtd. Diamante Abatível do Rebolo 3',
    name: 'tool3refractableDiamondQtd',
    type: 'number',
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: 3 },
      { label: '4', value: 4 },
    ],
  },
  {
    label: 'Qtd. Disco Dressador do Rebolo 3',
    name: 'tool3dressingDiscQtd',
    type: 'number',
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
    ],
  },
  {
    label: 'Qtd. Rolo Dressador Fixo do Rebolo 3',
    name: 'tool3fixedDressingRollerQtd',
    type: 'number',
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
    ],
  },
  {
    label: 'Qtd. Rolo Dressador Móvel c/ Servo do Rebolo 3',
    name: 'tool3sCtrlMovableDressingRollerQtd',
    type: 'number',
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
    ],
  },
  {
    label: 'Tipo do Rebolo 4',
    name: 'tool4Var',
    type: 'number',
    options: [
      { label: 'Inexistente', value: 0 },
      { label: 'Externo', value: TYPE_EXTERNAL },
      { label: 'Interno', value: TYPE_INTERNAL },
    ],
  },
  {
    label: 'Qtd. Diamante Fixo do Rebolo 4',
    name: 'tool4fixedDiamondQtd',
    type: 'number',
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: 3 },
      { label: '4', value: 4 },
    ],
  },
  {
    label: 'Qtd. Diamante Abatível do Rebolo 4',
    name: 'tool4refractableDiamondQtd',
    type: 'number',
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: 3 },
      { label: '4', value: 4 },
    ],
  },
  {
    label: 'Qtd. Disco Dressador do Rebolo 4',
    name: 'tool4dressingDiscQtd',
    type: 'number',
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
    ],
  },
  {
    label: 'Qtd. Rolo Dressador Fixo do Rebolo 4',
    name: 'tool4fixedDressingRollerQtd',
    type: 'number',
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
    ],
  },
  {
    label: 'Qtd. Rolo Dressador Móvel c/ Servo do Rebolo 4',
    name: 'tool4sCtrlMovableDressingRollerQtd',
    type: 'number',
    options: [
      { label: '0', value: 0 },
      { label: '1', value: 1 },
      { label: '2', value: 2 },
    ],
  },
];

export const updateFormState = (
  prevState: FormState,
  cncData: StoredCncData,
  toolsData: Tools,
): FormState => ({
  ...prevState,
  notationPattern: {
    ...prevState.notationPattern,
    value: cncData.notationPattern,
  },
  hasBAxis: {
    ...prevState.hasBAxis,
    value: cncData.hasBAxis,
  },
  maxRectifiableLength: {
    ...prevState.maxRectifiableLength,
    value: cncData.maxRectifiableLength || '',
  },
  maxRectifiableDiameter: {
    ...prevState.maxRectifiableDiameter,
    value: cncData.maxRectifiableDiameter || '',
  },
  tool1Var: {
    ...prevState.tool1Var,
    value: toolsData.tool1Var,
  },
  tool1fixedDiamondQtd: {
    ...prevState.tool1fixedDiamondQtd,
    value: toolsData.tool1fixedDiamondQtd,
  },
  tool1refractableDiamondQtd: {
    ...prevState.tool1refractableDiamondQtd,
    value: toolsData.tool1refractableDiamondQtd,
  },
  tool1dressingDiscQtd: {
    ...prevState.tool1dressingDiscQtd,
    value: toolsData.tool1dressingDiscQtd,
  },
  tool1fixedDressingRollerQtd: {
    ...prevState.tool1fixedDressingRollerQtd,
    value: toolsData.tool1fixedDressingRollerQtd,
  },
  tool1sCtrlMovableDressingRollerQtd: {
    ...prevState.tool1sCtrlMovableDressingRollerQtd,
    value: toolsData.tool1sCtrlMovableDressingRollerQtd,
  },
  tool2Var: {
    ...prevState.tool2Var,
    value: toolsData.tool2Var,
  },
  tool2fixedDiamondQtd: {
    ...prevState.tool2fixedDiamondQtd,
    value: toolsData.tool2fixedDiamondQtd,
  },
  tool2refractableDiamondQtd: {
    ...prevState.tool2refractableDiamondQtd,
    value: toolsData.tool2refractableDiamondQtd,
  },
  tool2dressingDiscQtd: {
    ...prevState.tool2dressingDiscQtd,
    value: toolsData.tool2dressingDiscQtd,
  },
  tool2fixedDressingRollerQtd: {
    ...prevState.tool2fixedDressingRollerQtd,
    value: toolsData.tool2fixedDressingRollerQtd,
  },
  tool2sCtrlMovableDressingRollerQtd: {
    ...prevState.tool2sCtrlMovableDressingRollerQtd,
    value: toolsData.tool2sCtrlMovableDressingRollerQtd,
  },
  tool3Var: {
    ...prevState.tool3Var,
    value: toolsData.tool3Var,
  },
  tool3fixedDiamondQtd: {
    ...prevState.tool3fixedDiamondQtd,
    value: toolsData.tool3fixedDiamondQtd,
  },
  tool3refractableDiamondQtd: {
    ...prevState.tool3refractableDiamondQtd,
    value: toolsData.tool3refractableDiamondQtd,
  },
  tool3dressingDiscQtd: {
    ...prevState.tool3dressingDiscQtd,
    value: toolsData.tool3dressingDiscQtd,
  },
  tool3fixedDressingRollerQtd: {
    ...prevState.tool3fixedDressingRollerQtd,
    value: toolsData.tool3fixedDressingRollerQtd,
  },
  tool3sCtrlMovableDressingRollerQtd: {
    ...prevState.tool3sCtrlMovableDressingRollerQtd,
    value: toolsData.tool3sCtrlMovableDressingRollerQtd,
  },
  tool4Var: {
    ...prevState.tool4Var,
    value: toolsData.tool4Var,
  },
  tool4fixedDiamondQtd: {
    ...prevState.tool4fixedDiamondQtd,
    value: toolsData.tool4fixedDiamondQtd,
  },
  tool4refractableDiamondQtd: {
    ...prevState.tool4refractableDiamondQtd,
    value: toolsData.tool4refractableDiamondQtd,
  },
  tool4dressingDiscQtd: {
    ...prevState.tool4dressingDiscQtd,
    value: toolsData.tool4dressingDiscQtd,
  },
  tool4fixedDressingRollerQtd: {
    ...prevState.tool4fixedDressingRollerQtd,
    value: toolsData.tool4fixedDressingRollerQtd,
  },
  tool4sCtrlMovableDressingRollerQtd: {
    ...prevState.tool4sCtrlMovableDressingRollerQtd,
    value: toolsData.tool4sCtrlMovableDressingRollerQtd,
  },
});
