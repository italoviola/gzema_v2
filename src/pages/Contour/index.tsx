/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

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

import { actionParams as actionParamsAux } from 'integration/functions-code';
import { MACHINING_GRINDING, TYPE_EXTERNAL, XZ_REGEX } from 'utils/constants';

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

  const updateContourPoints = useCallback(() => {
    const newPoints: ContourPoint[] = [];

    formData.activities.forEach((activity, activityIndex) => {
      // Verifica se a atividade tem parâmetros X e Z
      const hasX = activity.actionParams.some((param) => param.id === 'X');
      const hasZ = activity.actionParams.some((param) => param.id === 'Z');

      if (hasX && hasZ) {
        const xValue = (activity as any).adtParamX;
        const zValue = (activity as any).adtParamZ;

        // Se temos valores válidos para X e Z, criamos um ponto
        if (
          xValue &&
          zValue &&
          !Number.isNaN(Number(xValue)) &&
          !Number.isNaN(Number(zValue))
        ) {
          newPoints.push({
            id: `point-${activityIndex}`,
            x: Number(zValue), // Z is mapped to X in the chart (horizontal)
            y: Number(xValue), // X is mapped to Y in the chart (vertical)
            radius: 6,
            fill: colors.orangeDark,
          });
        }
      }
    });

    setContourPoints(newPoints);
  }, [formData.activities]);

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isEditingName]);

  const breadcrumbsItems = [
    {
      label: 'Grupo de Trabalho',
      url: '/workgroup',
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

  // Atualiza os pontos do contorno sempre que as atividades mudarem
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

            // Remove props to prevent user error
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

  // Determinar qual ponto deve ser destacado com base no campo focado
  const getFocusedPointId = useCallback(() => {
    // Se houver um campo com foco, usar essa informação
    if (focusedField) {
      if (focusedField.fieldId === 'X' || focusedField.fieldId === 'Z') {
        return `point-${focusedField.index}`;
      }
    }

    // Se não houver campo com foco, mas houver uma linha selecionada, usar o índice da linha
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

  return (
    <Container>
      {formData.activities ? (
        <>
          <Breadcrumbs items={breadcrumbsItems} />
          <PageContent>
            <form name="activity-items-table" className="activity-items-table">
              <BackBtn to="/workgroup">
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
                            <AddBtn
                              type="button"
                              className="icon-add"
                              onClick={() => handleAdd(index)}
                            />
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
                              color={
                                canNavigatePrev[index]
                                  ? colors.blue
                                  : colors.greyMedium
                              }
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
                              color={
                                canNavigateNext[index]
                                  ? colors.blue
                                  : colors.greyMedium
                              }
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
    </Container>
  );
};

export default Contour;
