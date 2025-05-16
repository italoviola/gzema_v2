import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import useFormattedTools from 'hooks/useFormattedTools';

import {
  mountGCodeWithProgramNumber,
  orderedContours,
  getOperationData,
  generateMapProgram,
} from 'integration/mount-gcode';
import { loadConfig } from 'utils/loadConfig';
import { loadCncData } from 'utils/loadCncData';

import { Part, ContourItem } from 'types/part';
import { Config, StoredCncData } from 'types/api';
import { ToolOptionItem } from 'types/formattedTools';

import { colors } from 'styles/global.styles';
import {
  Container,
  List,
  ListItem,
  DropdownButton,
  DropdownContent,
  IconWrapper,
  ProgramNumber,
  IconExpand,
  DropdownButtonText,
  SCodeBlock,
} from './styles';

const ProgramsToSendList: React.FC = () => {
  const formattedTools = useFormattedTools();
  const [selectedContourId, setSelectedContourId] = useState<number | null>(
    null,
  );
  const [loadedCncData, setLoadedCncData] = useState<StoredCncData>(
    {} as StoredCncData,
  );
  const [rangeStart, setRangeStart] = useState<number>(0);
  const part = useSelector((state: { part: Part }) => state.part);

  const handleContourClick = (contourId: number) => {
    setSelectedContourId(contourId === selectedContourId ? null : contourId);
  };

  useEffect(() => {
    async function fetchData() {
      const loadedConfig: Config = await loadConfig();
      const cncData: StoredCncData = await loadCncData();

      setRangeStart(loadedConfig.cnc.delRangeStart);
      setLoadedCncData(cncData);
    }
    fetchData();
  }, []);

  const mountCodeBlock = (contour: ContourItem, index: number) => {
    const toolId = getOperationData(part, contour.id, (op) => op.toolId);
    return mountGCodeWithProgramNumber(
      contour,
      Number(rangeStart) + Number(index),
      toolId,
      formattedTools.find((t: ToolOptionItem) => t.id === toolId)?.value ?? 0,
      loadedCncData,
    );
  };

  return (
    <Container>
      <List>
        <ListItem key="map-program">
          <DropdownButton onClick={() => handleContourClick(-1)}>
            <IconWrapper isOpen={selectedContourId === -1}>
              <IconExpand
                className="icon-expand_less"
                color={colors.black}
                fontSize="18px"
              />
            </IconWrapper>
            <DropdownButtonText>
              <ProgramNumber>{rangeStart}</ProgramNumber>
              {': '}
              Map Program
            </DropdownButtonText>
          </DropdownButton>
          {selectedContourId === -1 && (
            <DropdownContent>
              <SCodeBlock>
                {generateMapProgram(part, rangeStart, loadedCncData)}
              </SCodeBlock>
            </DropdownContent>
          )}
        </ListItem>
        {orderedContours(part).map((contour: ContourItem, index: number) => (
          <ListItem key={contour.id}>
            <DropdownButton onClick={() => handleContourClick(contour.id)}>
              <IconWrapper isOpen={selectedContourId === contour.id}>
                <IconExpand
                  className="icon-expand_less"
                  color={colors.black}
                  fontSize="18px"
                />
              </IconWrapper>
              <DropdownButtonText>
                <ProgramNumber>
                  {Number(rangeStart) + Number(index) + 1}
                </ProgramNumber>
                {': '}
                {contour.name}
              </DropdownButtonText>
            </DropdownButton>
            {selectedContourId === contour.id && (
              <DropdownContent>
                <SCodeBlock>{mountCodeBlock(contour, index)}</SCodeBlock>
              </DropdownContent>
            )}
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default ProgramsToSendList;
