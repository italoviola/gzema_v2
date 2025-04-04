import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { mountGCode } from 'integration/mount-gcode';
import { loadCncData } from 'utils/loadCncData';

import { Part, ContourItem } from 'types/part';
import { StoredCncData } from 'types/api';

import { CodeBlock } from './styles';

interface PreviewProps {
  contourId: ContourItem['id'];
}

const Preview: React.FC<PreviewProps> = ({ contourId }) => {
  const [gCodePreview, setGCodePreview] = useState<string>('');
  const [loadedCncData, setLoadedCncData] = useState<StoredCncData>(
    {} as StoredCncData,
  );

  useEffect(() => {
    async function fetchData() {
      const cncData: StoredCncData = await loadCncData();

      setLoadedCncData(cncData);
    }
    fetchData();
  }, []);

  const contour = useSelector((state: { part: Part }) =>
    state.part.contours.find((c) => c.id === contourId),
  );

  useEffect(() => {
    if (contour) {
      setGCodePreview(`${mountGCode(contour, loadedCncData)}`);
    }
  }, [contour, loadedCncData]);

  return <CodeBlock>{gCodePreview}</CodeBlock>;
};

export default Preview;
