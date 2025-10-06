/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import ReactDOM from 'react-dom';

import { editContour } from 'state/part/partSlice';

import Breadcrumbs from 'components/Breadcrumbs';
import GrindingTypeLabel from 'components/GrindingTypeLabel';
import Modal from 'components/Modal';
import ContourForm from 'components/ContourForm';
import CodePreview from 'components/CodePreview';
import Tooltip from 'components/Tooltip';
import InfoLabel from 'components/InfoLabel';
import TranslatedToolName from 'components/TranslatedToolName';
import Chart from 'components/Chart';
import Icon from 'components/Icon';

import { actionParams as actionParamsAux } from 'integration/functions-code';
import {
  MACHINING_GRINDING,
  TYPE_EXTERNAL,
  XZ_REGEX,
  MAX_RECT_LEN_DEFAULT,
  MAX_RECT_DIAM_DEFAULT,
} from 'utils/constants';
import { loadCncData } from 'utils/loadCncData';
import { StoredCncData } from 'types/api';

import { ActionParamItem, ActivitiyItem, ContourItem, Part } from 'types/part';

import { StyledIcon } from 'components/SideMenu/styles';
import { PageContent } from 'styles/Components';
import { colors } from 'styles/global.styles';

import defineActionParams from './defineActionParams';

import { ActionParamsValidation } from './interface';

import {
  Container,
  TitleContainer,
  Title,
  STitleEdit,
  Block,
  TableWrapper,
  Table,
  TableHead,
  TableBody,
  TableH,
  HText,
  TableD,
  TableIdText,
  TableInput,
  TableInputLabeled,
  TableInputLabel,
  TableDivision,
  AddBtn,
  DeleteBtn,
  TableDContent,
  TitleEditBtn,
  TitleEditIconEdit,
  TitleEditIconDone,
  CodePreviewBtn,
  PageHead,
  BtnText,
  ScrollBtn,
  RotatedIcon,
  BackBtn,
  BackBtnContent,
  IconBack,
  ChartContainer,
  ShowChartBtn,
  RowActionsInline,
  RepositionWrapper,
  MenuToggleBtn,
  RepositionMenuFloating,
} from './style';

const defaultValue: ContourItem = {
  id: 0,
  name: '',
  machining: MACHINING_GRINDING,
  type: TYPE_EXTERNAL,
  activities: [],
};

interface ContourPoint {
  id: string;
  x: number;
  y: number;
  radius: number;
  fill: string;
}

const Contour: React.FC = () => {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const from = searchParams.get('from');
  const backPath = from === 'visualization' ? '/visualization' : '/workgroup';
  const initialState: ContourItem = useSelector((state: { part: Part }) => {
    const contour = state.part.contours.find((c) => c.id === Number(id));
    return contour || defaultValue;
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalEditDressingOpen, setIsModalEditDressingOpen] =
    useState<boolean>(false);
  const [showChart, setShowChart] = useState<boolean>(true);
  const [formData, setFormData] = useState<ContourItem>({
    ...initialState,
  });
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const prevFormDataRef = useRef<ContourItem>(formData);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  const [visibleFields, setVisibleFields] = useState<number[][]>(
    formData.activities.map(() => [0, 1, 2, 3]),
  );
  const [canNavigateNext, setCanNavigateNext] = useState<boolean[]>([]);
  const [canNavigatePrev, setCanNavigatePrev] = useState<boolean[]>([]);
  const [focusedField, setFocusedField] = useState<{
    fieldId: string;
    index: number;
  } | null>(null);
  const [contourPoints, setContourPoints] = useState<ContourPoint[]>([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableSectionElement>(null);
  const [machineData, setMachineData] = useState<{
    maxRectifiableLength: number;
    maxRectifiableDiameter: number;
  }>({
    maxRectifiableLength: MAX_RECT_LEN_DEFAULT,
    maxRectifiableDiameter: MAX_RECT_DIAM_DEFAULT,
  });
  const [openRepositionMenuIndex, setOpenRepositionMenuIndex] = useState<
    number | null
  >(null);

  const [repositionMenuPos, setRepositionMenuPos] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });

  // ref for measuring the real height of the menu
  const repositionMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (selectedRowIndex === null) return;

      const chartElement = chartRef.current;
      const tableElement = tableRef.current;

      if (
        chartElement &&
        tableElement &&
        !chartElement.contains(event.target as Node) &&
        !tableElement.contains(event.target as Node)
      ) {
        setSelectedRowIndex(null);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [selectedRowIndex]);

  // helper to close menu + deselect row
  const closeRepositionMenu = useCallback(() => {
    setOpenRepositionMenuIndex(null);
    setSelectedRowIndex(null);
  }, []);

  useEffect(() => {
    const handleOutsideMenus = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest('[data-reposition-wrapper]') &&
        !target.closest('[data-reposition-menu="true"]')
      ) {
        if (openRepositionMenuIndex !== null) {
          closeRepositionMenu();
        }
      }
    };

    const handleScroll = () => {
      if (openRepositionMenuIndex !== null) closeRepositionMenu();
    };
    const handleResize = () => {
      if (openRepositionMenuIndex !== null) closeRepositionMenu();
    };

    document.addEventListener('mousedown', handleOutsideMenus);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleOutsideMenus);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [openRepositionMenuIndex, closeRepositionMenu]);

  const updateContourPoints = useCallback(() => {
    const newPoints: ContourPoint[] = [];

    formData.activities.forEach((activity, activityIndex) => {
      const hasX = activity.actionParams.some((param) => param.id === 'X');
      const hasZ = activity.actionParams.some((param) => param.id === 'Z');

      if (hasX && hasZ) {
        const xValue = (activity as any).adtParamX;
        const zValue = (activity as any).adtParamZ;

        if (
          xValue &&
          zValue &&
          !Number.isNaN(Number(xValue)) &&
          !Number.isNaN(Number(zValue))
        ) {
          newPoints.push({
            // includes contour id to allow grouping and drawing the line
            id: `point-${formData.id}-${activityIndex}`,
            x: Number(zValue),
            y: Number(xValue),
            radius: 6,
            fill: colors.orangeDark,
          });
        }
      }
    });

    setContourPoints(newPoints);
  }, [formData.activities, formData.id]);

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isEditingName]);

  const breadcrumbsItems = [
    {
      label: from === 'visualization' ? 'Visualização' : 'Grupo de Trabalho',
      url: backPath,
      isActive: false,
    },
    {
      label: `${formData.name}`,
      url: `/contour/${formData.id}`,
      isActive: true,
    },
  ];

  const updateNavigationAvailability = (
    index: number,
    newVisibleFields: number[][],
  ) => {
    setCanNavigateNext((prev) => {
      const newCanNavigateNext = [...prev];
      newCanNavigateNext[index] =
        newVisibleFields[index][3] <
        formData.activities[index].actionParams.length - 1;
      return newCanNavigateNext;
    });

    setCanNavigatePrev((prev) => {
      const newCanNavigatePrev = [...prev];
      newCanNavigatePrev[index] = newVisibleFields[index][0] > 0;
      return newCanNavigatePrev;
    });
  };

  const handleNext = (index: number) => {
    setVisibleFields((prev) => {
      const newVisibleFields = [...prev];
      if (
        newVisibleFields[index][3] >=
        formData.activities[index].actionParams.length - 1
      ) {
        return prev;
      }
      newVisibleFields[index] = [
        newVisibleFields[index][0] + 4,
        newVisibleFields[index][1] + 4,
        newVisibleFields[index][2] + 4,
        newVisibleFields[index][3] + 4,
      ];
      updateNavigationAvailability(index, newVisibleFields);
      return newVisibleFields;
    });
  };

  const handlePrev = (index: number) => {
    setVisibleFields((prev) => {
      const newVisibleFields = [...prev];
      if (newVisibleFields[index][0] === 0) {
        return prev;
      }
      newVisibleFields[index] = [
        newVisibleFields[index][0] - 4,
        newVisibleFields[index][1] - 4,
        newVisibleFields[index][2] - 4,
        newVisibleFields[index][3] - 4,
      ];
      updateNavigationAvailability(index, newVisibleFields);
      return newVisibleFields;
    });
  };

  useEffect(() => {
    setCanNavigateNext((prev) => {
      const newCanNavigateNext = formData.activities.map((activity, index) => {
        if (prev[index] !== undefined) {
          return prev[index];
        }
        return activity.actionParams.length > 3;
      });
      return newCanNavigateNext;
    });

    setCanNavigatePrev((prev) => {
      const newCanNavigatePrev = formData.activities.map((_, index) => {
        if (prev[index] !== undefined) {
          return prev[index];
        }
        return false;
      });
      return newCanNavigatePrev;
    });
  }, [formData.activities]);

  // update contour points whenever activities change
  useEffect(() => {
    updateContourPoints();
  }, [updateContourPoints]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index?: number,
  ) => {
    const { value } = e.currentTarget;
    if (e.currentTarget.name === 'name') {
      setFormData({
        ...formData,
        [e.currentTarget.name]: value,
      });
    } else if (
      e.currentTarget.name === 'actionCode' ||
      (e.currentTarget.name === 'actionCode' && value === '')
    ) {
      setFormData({
        ...formData,
        activities: formData.activities.map((item, i) => {
          if (i === index) {
            const newActionParams: ActionParamsValidation =
              defineActionParams(value);

            // remove props to prevent user error
            const updatedItem = { ...item };
            Object.keys(updatedItem).forEach((key) => {
              if (key.startsWith('adtParam')) {
                // adtParam = short for additionalParam
                delete (updatedItem as any)[key];
              }
            });

            newActionParams.forEach((param) => {
              const paramName = `adtParam${param.id}`;
              (updatedItem as any)[paramName] = '';
            });

            setVisibleFields((prev) => {
              const newVisibleFields = [...prev];
              newVisibleFields[index] = [0, 1, 2, 3];
              return newVisibleFields;
            });

            setCanNavigateNext((prev) => {
              const newCanNavigateNext = [...prev];
              newCanNavigateNext[index] = newActionParams.length > 3;
              return newCanNavigateNext;
            });

            setCanNavigatePrev((prev) => {
              const newCanNavigatePrev = [...prev];
              newCanNavigatePrev[index] = false;
              return newCanNavigatePrev;
            });

            return {
              ...updatedItem,
              actionParams: newActionParams,
              [e.currentTarget.name]: value,
            };
          }
          return item;
        }),
      });
    } else if (
      index !== undefined &&
      e.currentTarget.name.startsWith('adtParam')
    ) {
      const actionCodeValue = formData.activities[index].actionCode;
      const params = actionParamsAux.find(
        (p) => p.actionCode === actionCodeValue,
      );
      const actionParamId = params?.actionParams.find((ap) => {
        const name = `adtParam${ap.id}`;
        return name === e.currentTarget.name;
      })?.id;
      const actionParamFieldName = `adtParam${actionParamId}`;
      const actionParamFieldValidation = params?.actionParams.find(
        (ap) => ap.id === actionParamId,
      )?.validation;

      if (
        (params &&
          e.currentTarget.name === actionParamFieldName &&
          actionParamFieldValidation &&
          value.match(RegExp(actionParamFieldValidation))) ||
        value === ''
      ) {
        setFormData({
          ...formData,
          activities: formData.activities.map((item, i) => {
            if (i === index) {
              return { ...item, [e.currentTarget.name]: value };
            }
            return item;
          }),
        });
      }
    } else if (value.match(XZ_REGEX) || value === '') {
      setFormData({
        ...formData,
        activities: formData.activities.map((item, i) => {
          if (i === index) {
            return { ...item, [e.currentTarget.name]: value };
          }
          return item;
        }),
      });
    }
  };

  const handleAdd = (index: number) => {
    let newActivities = [...formData.activities];
    const newActivity = {
      ...formData.activities[index],
      id: index + 2,
    };
    newActivities.splice(index + 1, 0, newActivity);
    newActivities = newActivities.map((activity, i) => {
      if (i >= index + 2) {
        return { ...activity, id: activity.id + 1 };
      }
      return activity;
    });
    setFormData({
      ...formData,
      activities: newActivities,
    });

    setVisibleFields((prev) => {
      const newVisibleFields = [...prev];
      newVisibleFields.splice(index + 1, 0, [0, 1, 2, 3]);
      return newVisibleFields;
    });

    setCanNavigateNext((prev) => {
      const newCanNavigateNext = [...prev];
      newCanNavigateNext.splice(
        index + 1,
        0,
        newActivity.actionParams.length > 4,
      );
      return newCanNavigateNext;
    });

    setCanNavigatePrev((prev) => {
      const newCanNavigatePrev = [...prev];
      newCanNavigatePrev.splice(index + 1, 0, false);
      return newCanNavigatePrev;
    });

    setSelectedRowIndex(index + 1);
  };

  const handleDelete = (index: number) => () => {
    if (formData.activities.length > 1) {
      let newActivities = [...formData.activities];
      newActivities.splice(index, 1);
      newActivities = newActivities.map((activity, i) => {
        return { ...activity, id: i + 1 };
      });
      setFormData({
        ...formData,
        activities: newActivities,
      });

      setVisibleFields((prev) => {
        const newVisibleFields = [...prev];
        newVisibleFields.splice(index, 1);
        return newVisibleFields;
      });

      setCanNavigateNext((prev) => {
        const newCanNavigateNext = [...prev];
        newCanNavigateNext.splice(index, 1);
        return newCanNavigateNext;
      });

      setCanNavigatePrev((prev) => {
        const newCanNavigatePrev = [...prev];
        newCanNavigatePrev.splice(index, 1);
        return newCanNavigatePrev;
      });
    }
  };

  const computeMenuPositionSide = (
    btnEl: HTMLElement,
    menuHeight?: number,
  ): { top: number; left: number } => {
    const rect = btnEl.getBoundingClientRect();
    const gapX = 6;
    const estimatedHeight = menuHeight || 34 * 2 + 12; // 2 buttons + padding
    const viewportH = window.innerHeight;
    let top = rect.top + rect.height / 2 - estimatedHeight / 2; // vertical centralized
    const left = rect.right + gapX;

    const margin = 8;
    if (top < margin) top = margin;
    if (top + estimatedHeight > viewportH - margin)
      top = Math.max(margin, viewportH - margin - estimatedHeight);

    return { top, left };
  };

  const toggleRepositionMenu = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number,
  ) => {
    e.stopPropagation();
    setSelectedRowIndex(index);

    // if already open at this index: close and deselect
    if (openRepositionMenuIndex === index) {
      closeRepositionMenu();
      return;
    }

    const btn = e.currentTarget;
    const pos = computeMenuPositionSide(btn);
    setRepositionMenuPos(pos);
    setOpenRepositionMenuIndex(index);
  };

  // re-calculate position after rendering the open menu (to use real height)
  useEffect(() => {
    if (openRepositionMenuIndex !== null && repositionMenuRef.current) {
      const table = tableRef.current;
      if (!table) return;
      const btns = table.querySelectorAll<HTMLButtonElement>(
        '[data-reposition-wrapper] > button',
      );
      const btn = btns[openRepositionMenuIndex];
      if (btn) {
        const realHeight = repositionMenuRef.current.offsetHeight;
        const pos = computeMenuPositionSide(btn, realHeight);
        setRepositionMenuPos(pos);
      }
    }
  }, [openRepositionMenuIndex, formData.activities]);

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const total = formData.activities.length;
    if (targetIndex < 0 || targetIndex >= total) return;

    // reorder activities
    setFormData((prev) => {
      const activities = [...prev.activities];
      const temp = activities[index];
      activities[index] = activities[targetIndex];
      activities[targetIndex] = temp;
      const reIdActivities = activities.map((a, i) => ({ ...a, id: i + 1 }));
      return { ...prev, activities: reIdActivities };
    });

    // reorder auxiliary structures
    const swapInPlace = <T,>(arr: T[]) => {
      const clone = [...arr];
      [clone[index], clone[targetIndex]] = [clone[targetIndex], clone[index]];
      return clone;
    };
    setVisibleFields((prev) => swapInPlace(prev));
    setCanNavigateNext((prev) => swapInPlace(prev));
    setCanNavigatePrev((prev) => swapInPlace(prev));

    // selection always follows the moved row
    setSelectedRowIndex((prevSel) => {
      if (prevSel === index) return targetIndex;
      // if the selection was not on the row, but the open menu indicates intention to move this row,
      // we ensure that the selection follows the same manipulated "entity".
      if (openRepositionMenuIndex === index) return targetIndex;
      return prevSel;
    });

    // menu follows the same row (if it was open on it)
    setOpenRepositionMenuIndex((prev) => (prev === index ? targetIndex : prev));

    // reposition the menu (only if it was open on the moved row)
    requestAnimationFrame(() => {
      if (openRepositionMenuIndex !== index) return;
      const table = tableRef.current;
      if (!table) return;
      const btns = table.querySelectorAll<HTMLButtonElement>(
        '[data-reposition-wrapper] > button',
      );
      const newBtn = btns[targetIndex];
      if (newBtn) {
        const pos = computeMenuPositionSide(newBtn);
        setRepositionMenuPos(pos);
      }
    });

    setFocusedField(null);
  };

  const renderTableBlocks = (length: number, vFields: number[]) => {
    const blocks = [];
    const renderCount = Math.max(...vFields) - length;
    for (let i = 0; i <= renderCount; i += 1) {
      blocks.push(
        <TableD key={i}>
          <TableDContent>
            <TableInputLabel />
            <TableInputLabeled type="text" disabled />
          </TableDContent>
        </TableD>,
      );
    }
    return blocks;
  };

  const toggleEdit = () => {
    setIsEditingName(!isEditingName);
  };

  useEffect(() => {
    if (JSON.stringify(formData) !== JSON.stringify(prevFormDataRef.current))
      dispatch(editContour({ id: formData.id, changes: formData }));
    prevFormDataRef.current = formData;
  }, [dispatch, formData]);

  useEffect(() => {
    setFormData({ ...initialState });
  }, [dispatch, initialState]);

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isEditingName]);

  // determine which point should be highlighted based on the focused field
  const getFocusedPointId = useCallback(() => {
    // if there is a focused field, use that information
    if (focusedField) {
      if (focusedField.fieldId === 'X' || focusedField.fieldId === 'Z') {
        return `point-${focusedField.index}`;
      }
    }

    // if there is no focused field, but there is a selected row, use the row index
    if (selectedRowIndex !== null) {
      return `point-${selectedRowIndex}`;
    }

    return undefined;
  }, [focusedField, selectedRowIndex]);

  const renderField = (
    item: ActivitiyItem,
    param: ActionParamItem,
    fieldName: string,
    index: number,
  ) => {
    const fId = param.fakeId ? param.fakeId : param.id;

    if (fId && fId !== '') {
      return (
        <TableD key={fieldName}>
          <TableDContent>
            <TableInputLabel>{fId}</TableInputLabel>
            <TableInputLabeled
              className="input is-edit"
              type="text"
              name={fieldName}
              value={item[fieldName as keyof ActivitiyItem] as string}
              placeholder={param.placeholder}
              onChange={(e) => handleChange(e, index)}
              onFocus={() => {
                setFocusedField({ fieldId: param.id, index });
                setSelectedRowIndex(index);
              }}
              onBlur={() => setFocusedField(null)}
            />
            {focusedField?.fieldId === param.id &&
              focusedField?.index === index && (
                <Tooltip>{param.placeholder}</Tooltip>
              )}
          </TableDContent>
        </TableD>
      );
    }
    return null;
  };

  // loading machine data from electron store
  useEffect(() => {
    async function fetchMachineData() {
      const cncData: StoredCncData = await loadCncData();

      // converting strings to numbers and using default values if they don't exist
      const maxLength =
        Number(cncData.maxRectifiableLength) || MAX_RECT_LEN_DEFAULT;
      const maxDiameter =
        Number(cncData.maxRectifiableDiameter) || MAX_RECT_DIAM_DEFAULT;

      setMachineData({
        maxRectifiableLength: maxLength,
        maxRectifiableDiameter: maxDiameter,
      });
    }

    fetchMachineData();
  }, []);

  return (
    <Container>
      {formData.activities ? (
        <>
          <Breadcrumbs items={breadcrumbsItems} />
          <PageContent>
            <form name="activity-items-table" className="activity-items-table">
              <BackBtn to={backPath}>
                <BackBtnContent>
                  <IconBack
                    className="icon-expand_less"
                    color={colors.green}
                    fontSize="16px"
                  />
                  <div>Voltar</div>
                </BackBtnContent>
              </BackBtn>
              <PageHead>
                <TitleContainer>
                  {isEditingName ? (
                    <STitleEdit
                      ref={nameInputRef}
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      style={{ width: `${formData.name.length}ch` }}
                    />
                  ) : (
                    <Title>{formData.name}</Title>
                  )}
                  <TitleEditBtn type="button" onClick={toggleEdit}>
                    {isEditingName ? (
                      <TitleEditIconEdit className="icon-check_circle" />
                    ) : (
                      <TitleEditIconDone className="icon-create" />
                    )}
                  </TitleEditBtn>
                </TitleContainer>
                <TitleContainer>
                  <GrindingTypeLabel
                    contourType={formData.type}
                    fontSize="14px"
                  />
                  {formData.dressingTool && (
                    <InfoLabel fontSize="14px" color={colors.blue}>
                      <TranslatedToolName name={formData.dressingTool} />
                    </InfoLabel>
                  )}
                  <CodePreviewBtn
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <StyledIcon
                      className="icon-code"
                      color={colors.white}
                      fontSize="28px"
                    />
                    <BtnText>Code Preview</BtnText>
                  </CodePreviewBtn>
                  <ShowChartBtn
                    type="button"
                    style={{ marginLeft: '8px' }}
                    onClick={() => setShowChart(!showChart)}
                  >
                    <StyledIcon
                      className={
                        showChart
                          ? 'icon-visibility_off'
                          : 'icon-remove_red_eye'
                      }
                      color={colors.blue}
                      fontSize="26px"
                    />
                    <BtnText>Gráfico</BtnText>
                  </ShowChartBtn>
                </TitleContainer>
              </PageHead>
              {showChart && (
                <ChartContainer>
                  <div ref={chartRef}>
                    <Chart
                      points={contourPoints}
                      focusedPointId={getFocusedPointId()}
                      worldLimitX={machineData.maxRectifiableLength}
                      worldLimitY={machineData.maxRectifiableDiameter}
                      disableShapeSelection
                    />
                  </div>
                </ChartContainer>
              )}
              <Block showChart={showChart}>
                <TableWrapper>
                  <Table className="table table-ordenation">
                    <TableHead className="table-ordenation head">
                      <tr>
                        <TableH />
                        <TableH />
                        <TableH>
                          <HText>Código</HText>
                        </TableH>
                        <TableH />
                        <TableH colSpan={6}>
                          <HText>Parâmetros Adicionais</HText>
                        </TableH>
                        <TableH />
                      </tr>
                    </TableHead>
                    <TableBody ref={tableRef}>
                      {formData.activities.map((item, index) => (
                        <tr
                          key={item.id}
                          style={{
                            backgroundColor:
                              selectedRowIndex === index
                                ? `${colors.blueLighter}`
                                : 'transparent',
                          }}
                        >
                          <TableD>
                            <RowActionsInline>
                              <AddBtn
                                type="button"
                                className="icon-add"
                                onClick={() => handleAdd(index)}
                                title="Duplicar abaixo"
                              />
                              <RepositionWrapper>
                                <MenuToggleBtn
                                  type="button"
                                  $active={openRepositionMenuIndex === index}
                                  onClick={(e) =>
                                    toggleRepositionMenu(e, index)
                                  }
                                  title="Reordenar"
                                >
                                  <Icon
                                    className={
                                      openRepositionMenuIndex === index
                                        ? 'icon-x'
                                        : 'icon-more_vert'
                                    }
                                    color={colors.white}
                                    fontSize="18px"
                                  />
                                </MenuToggleBtn>
                              </RepositionWrapper>
                            </RowActionsInline>
                          </TableD>
                          <TableD>
                            <TableIdText>{item.id}</TableIdText>
                          </TableD>
                          <TableD>
                            <TableInput
                              className="input is-edit"
                              type="text"
                              name="actionCode"
                              value={item.actionCode}
                              onChange={(e) => handleChange(e, index)}
                              onFocus={() => {
                                setSelectedRowIndex(index);
                              }}
                            />
                          </TableD>
                          <TableD>
                            <TableDivision>|</TableDivision>
                          </TableD>
                          <TableD>
                            <ScrollBtn
                              type="button"
                              onClick={() => handlePrev(index)}
                              bgColor={
                                canNavigatePrev[index]
                                  ? colors.blue
                                  : colors.greyMedium
                              }
                              color={colors.white}
                            >
                              <RotatedIcon
                                className="icon-expand_less"
                                color={colors.white}
                                fontSize="22px"
                              />
                            </ScrollBtn>
                          </TableD>
                          {item.actionParams.map((param, paramIndex) => {
                            if (visibleFields[index].includes(paramIndex)) {
                              return renderField(
                                item,
                                param,
                                `adtParam${param.id}` as keyof ActionParamItem,
                                index,
                              );
                            }
                            return null;
                          })}
                          {renderTableBlocks(
                            item.actionParams.length,
                            visibleFields[index],
                          )}
                          <TableD>
                            <ScrollBtn
                              type="button"
                              onClick={() => handleNext(index)}
                              bgColor={
                                canNavigateNext[index]
                                  ? colors.blue
                                  : colors.greyMedium
                              }
                              color={colors.white}
                            >
                              <RotatedIcon
                                className="icon-expand_more"
                                color={colors.white}
                                fontSize="22px"
                              />
                            </ScrollBtn>
                          </TableD>
                          <TableD>
                            <DeleteBtn
                              type="button"
                              className="icon-delete"
                              onClick={handleDelete(index)}
                              title="Remover linha"
                            />
                          </TableD>
                        </tr>
                      ))}
                    </TableBody>
                  </Table>
                </TableWrapper>
              </Block>
            </form>
          </PageContent>
        </>
      ) : (
        'Página não encontrada'
      )}
      <Modal
        title={`Code Preview de ${formData.name}`}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <CodePreview contourId={formData.id} />
      </Modal>
      <Modal
        title="Editar Dressagem"
        isOpen={isModalEditDressingOpen}
        onClose={() => setIsModalEditDressingOpen(false)}
      >
        <ContourForm
          variation="edit"
          machining={initialState.machining}
          contourId={initialState.id}
          onButtonClick={() => setIsModalEditDressingOpen(false)}
        />
      </Modal>
      {ReactDOM.createPortal(
        <RepositionMenuFloating
          ref={repositionMenuRef}
          data-reposition-menu="true"
          open={openRepositionMenuIndex !== null}
          top={repositionMenuPos.top}
          left={repositionMenuPos.left}
        >
          <ScrollBtn
            type="button"
            onClick={() =>
              openRepositionMenuIndex !== null &&
              handleMove(openRepositionMenuIndex, 'up')
            }
            disabled={openRepositionMenuIndex === 0}
            bgColor={
              openRepositionMenuIndex === 0 ? colors.greyMedium : colors.blue
            }
            color={
              openRepositionMenuIndex === 0 ? colors.greyMedium : colors.blue
            }
            title="Mover para cima"
          >
            <Icon
              className="icon-expand_less"
              color={colors.white}
              fontSize="18px"
            />
          </ScrollBtn>
          <ScrollBtn
            type="button"
            onClick={() =>
              openRepositionMenuIndex !== null &&
              handleMove(openRepositionMenuIndex, 'down')
            }
            disabled={
              openRepositionMenuIndex === formData.activities.length - 1
            }
            bgColor={
              openRepositionMenuIndex === formData.activities.length - 1
                ? colors.greyMedium
                : colors.blue
            }
            color={
              openRepositionMenuIndex === formData.activities.length - 1
                ? colors.blue
                : colors.white
            }
            title="Mover para baixo"
          >
            <Icon
              className="icon-expand_more"
              color={colors.white}
              fontSize="18px"
            />
          </ScrollBtn>
        </RepositionMenuFloating>,
        document.body,
      )}
    </Container>
  );
};

export default Contour;
