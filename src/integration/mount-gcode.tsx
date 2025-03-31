import { ContourItem, ActivitiyItem, Part, OperationItem } from 'types/part';
import {
  B_AXIS_NO_SPIN,
  MACHINING_DRESSING,
  MACHINING_GRINDING,
  NOTATION_JUNKER,
  TYPE_EXTERNAL,
  TYPE_INTERNAL,
} from 'utils/constants';

import { ToolOptions } from 'components/Select/interface';
import { StoredCncData } from 'types/api';

const macroRef = 'G65 P7001';

function removeAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function mountGCodeLine(
  activity: ActivitiyItem,
  isLastLine: boolean,
  incrementLineNumber: () => string,
  loadedCncData: StoredCncData,
): string {
  const a = activity.actionCode ? `${activity.actionCode} ` : 'G01 G90 ';

  const adtParams = activity.actionParams
    .map((param) => `adtParam${param.id}`)
    .filter(
      (key) =>
        key in activity &&
        activity[key as keyof ActivitiyItem] !== '' &&
        activity[key as keyof ActivitiyItem] !== undefined,
    )
    .map((key) => {
      const paramValue = activity[key as keyof ActivitiyItem];
      const paramId = key.replace('adtParam', '');
      if (/^M\d+$/.test(paramId)) {
        return `M${paramValue} `;
      }
      if (
        (paramId === 'X' || paramId === 'Z') &&
        loadedCncData.notationPattern === NOTATION_JUNKER
      ) {
        return `${paramId}1=${paramValue} `;
      }
      return `${paramId}${paramValue} `;
    })
    .join('');

  let gCodeLine = `N${incrementLineNumber()} ${a}${adtParams}\n`;

  if (isLastLine) gCodeLine = `${gCodeLine}N${incrementLineNumber()} M99`;

  return gCodeLine;
}

function getDressingToolNumber(toolName: string, toolId: number): string {
  const suffix = parseInt(toolName.slice(-1), 10);

  const baseNames = {
    fixedDiamond: `5${toolId}50${suffix}`,
    refractableDiamond: `5${toolId}51${suffix}`,
    dressingDisc: `5${toolId}52${suffix}`,
    fixedDressingRoller: `5${toolId}53${suffix}`,
    sCtrlMovableDressingRoller: `5${toolId}54${suffix}`,
  };

  const baseName = toolName.replace(/[1-4]$/, '') as keyof typeof baseNames;

  return `${baseNames[baseName]}`;
}

function generateLines(
  contour: ContourItem,
  loadedCncData: StoredCncData,
  toolId?: number,
  toolType?: number,
): string {
  let toolVar: string = '5X00';
  if (toolId === 1) toolVar = '5100';
  if (toolId === 2) toolVar = '5200';
  if (toolId === 3) toolVar = '5300';
  if (toolId === 4) toolVar = '5400';

  let lineNumber = 10;
  const incrementLineNumber = () => {
    const currentLineNumber = lineNumber;
    lineNumber += 10;
    return currentLineNumber.toString().padStart(4, '0');
  };

  const jobValue: number | null = (() => {
    if (
      contour.machining === MACHINING_GRINDING &&
      contour.type === TYPE_EXTERNAL
    )
      return 1;
    if (
      contour.machining === MACHINING_DRESSING &&
      contour.type === TYPE_EXTERNAL
    )
      return 2;
    if (
      contour.machining === MACHINING_GRINDING &&
      contour.type === TYPE_INTERNAL
    )
      return 3;
    if (
      contour.machining === MACHINING_DRESSING &&
      contour.type === TYPE_INTERNAL
    )
      return 4;
    return 0;
  })();

  const toolIdLine = toolId
    ? `N${incrementLineNumber()} #50001=${toolId}\n`
    : '';
  // jobLine refers to if it is a grinding OD/ID or dressing OD/ID operation
  const jobLine = jobValue
    ? `N${incrementLineNumber()} #50002=${jobValue}\n`
    : '';
  const toolTypeLine = toolType
    ? `N${incrementLineNumber()} #${toolVar}0=${toolType}\n`
    : '';
  const macroRefLine = macroRef
    ? `N${incrementLineNumber()} ${macroRef}\n`
    : '';
  // dressing tools lines
  const dressingToolLine = contour.dressingTool
    ? `N${incrementLineNumber()} #${getDressingToolNumber(
        contour.dressingTool,
        toolId ?? 0,
      )}=1 (${contour.dressingTool})\n`
    : '';

  let gCodeOutput = '';
  contour.activities.forEach((element: any, index: any) => {
    const isLastLine = contour.activities.length === index + 1;
    gCodeOutput = `${gCodeOutput}${mountGCodeLine(
      element,
      isLastLine,
      incrementLineNumber,
      loadedCncData,
    )}`;
  });
  gCodeOutput = `${toolIdLine}${jobLine}${toolTypeLine}${dressingToolLine}${macroRefLine}${gCodeOutput}\n`;

  return gCodeOutput;
}

function mountGCode(
  contour: ContourItem,
  loadedCncData: StoredCncData,
): string {
  const gCodeOutput = generateLines(contour, loadedCncData);
  const gCodeTemplate = `(${removeAccents(contour.name)})\n${gCodeOutput}%`;

  return gCodeTemplate;
}

function mountGCodeWithProgramNumber(
  contour: ContourItem,
  programNumber: number,
  toolId: number,
  toolType: number,
  loadedCncData: StoredCncData,
): string {
  const gCodeOutput = generateLines(contour, loadedCncData, toolId, toolType);
  const gCodeTemplate = `O${programNumber}(${removeAccents(
    contour.name,
  )})\n${gCodeOutput}%`;

  return gCodeTemplate;
}

const orderedContours = (part: Part): ContourItem[] => {
  return part.operations
    .flatMap((operation) =>
      operation.contoursIds.filter(
        (contourId) => !operation.contoursIdsExcluded?.includes(contourId),
      ),
    )
    .map((contourId) =>
      part.contours.find((contour) => contour.id === contourId),
    )
    .filter((contour) => contour !== undefined) as ContourItem[];
};

/* This function will return an error in case contourId is not found at operations,
since it will only happen if used in wrong context, it will be thrown so the developer can fix it. */
function getOperationData<T>(
  part: Part,
  contourId: number,
  callback: (operation: OperationItem) => T,
): T {
  const operation: OperationItem | undefined = part.operations.find((op) =>
    op.contoursIds.includes(contourId),
  );
  if (!operation) {
    throw new Error(`Operation not found for contourId: ${contourId}`);
  }
  return callback(operation);
}

function generateMapProgram(
  part: Part,
  rangeStart: number,
  loadedCncData: StoredCncData,
): string {
  const header = `O${rangeStart}(Map Program)`;
  const varNumbers = {
    grindingItemsQtd: 50005,
    dressingItemsQtd: 50006,
    bAxisAngle: 50100,
    safetyDistanceBase: 51000, // Base for safety distance variables
  };

  const grindingItemsCount = part.operations.reduce((count, operation) => {
    return (
      count +
      operation.contoursIds.filter(
        (contourId) =>
          part.contours.find(
            (contour) =>
              contour.id === contourId &&
              contour.machining === MACHINING_GRINDING,
          ) !== undefined,
      ).length
    );
  }, 0);

  const dressingItemsCount = part.operations.reduce((count, operation) => {
    return (
      count +
      operation.contoursIds.filter(
        (contourId) =>
          part.contours.find(
            (contour) =>
              contour.id === contourId &&
              contour.machining === MACHINING_DRESSING,
          ) !== undefined,
      ).length
    );
  }, 0);

  const grindingItemsCountLine = `#${varNumbers.grindingItemsQtd}=${grindingItemsCount}`;
  const dressingItemsCountLine = `#${varNumbers.dressingItemsQtd}=${dressingItemsCount}`;

  const operationsLines = part.operations
    .map((operation, index) => {
      if (loadedCncData.hasBAxis === B_AXIS_NO_SPIN) return '';

      const { bAxisAngle } = operation;
      const bAxisAngleLine = `#${varNumbers.bAxisAngle + index}=${bAxisAngle}`;
      return `${bAxisAngleLine}\n`;
    })
    .join('');

  const grindingWheelsLines = part.grindingWheels
    .map((wheel) => {
      const xSafetyDistanceLine = `#${
        varNumbers.safetyDistanceBase + wheel.id * 100 + 2
      }=${wheel.xSafetyDistance}`;
      const zSafetyDistanceLine = `#${
        varNumbers.safetyDistanceBase + wheel.id * 100 + 3
      }=${wheel.zSafetyDistance}`;
      return `${xSafetyDistanceLine}\n${zSafetyDistanceLine}`;
    })
    .join('\n');

  return `${header}\n${grindingItemsCountLine}\n${dressingItemsCountLine}\n${operationsLines}\n${grindingWheelsLines}`;
}

function generateGCodeForPart(
  part: Part,
  rangeStart: number,
  formattedTools: ToolOptions,
  loadedCncData: StoredCncData,
): string[] {
  const gCodeStrings: string[] = [
    `${generateMapProgram(part, rangeStart, loadedCncData)}`,
  ];

  orderedContours(part).forEach((contour: ContourItem, index: number) => {
    const toolId = getOperationData(
      part,
      contour.id,
      (operation) => operation.toolId,
    );

    const gCode = mountGCodeWithProgramNumber(
      contour,
      Number(rangeStart) + 1 + index, // use plus one to make Map Program be the first on the range
      toolId,
      Array.isArray(formattedTools)
        ? formattedTools.find((t) => t.id === toolId)?.value ?? 0
        : 0,
      loadedCncData,
    );
    gCodeStrings.push(gCode);
  });

  return gCodeStrings;
}

export {
  mountGCode,
  getOperationData,
  generateGCodeForPart,
  orderedContours,
  mountGCodeWithProgramNumber,
  generateMapProgram,
};
