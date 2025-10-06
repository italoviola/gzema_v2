import React, { useEffect, useState } from 'react';

import Breadcrumbs from 'components/Breadcrumbs';
import Chart from 'components/Chart';
import ElementRegistration from 'components/ElementRegistration';
import { loadCncData } from 'utils/loadCncData';
import { StoredCncData } from 'types/api';
import { MAX_RECT_LEN_DEFAULT, MAX_RECT_DIAM_DEFAULT } from 'utils/constants';

import { Container, Content } from './style';

const breadcrumbsItems = [
  {
    label: 'Visualização',
    url: '/visualization',
    isActive: true,
  },
];

const Visualization: React.FC = () => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [machineData, setMachineData] = useState<{
    maxRectifiableLength: number;
    maxRectifiableDiameter: number;
  }>({
    maxRectifiableLength: MAX_RECT_LEN_DEFAULT,
    maxRectifiableDiameter: MAX_RECT_DIAM_DEFAULT,
  });

  useEffect(() => {
    setLoaded(true);
  }, []);

  // load machine data from electron store
  useEffect(() => {
    async function fetchMachineData() {
      const cncData: StoredCncData = await loadCncData();

      // converting strings to numbers and use default values if not exist
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
    <Container className={loaded ? 'loaded' : ''}>
      <Breadcrumbs items={breadcrumbsItems} />
      <Content>
        <Chart
          worldLimitX={machineData.maxRectifiableLength}
          worldLimitY={machineData.maxRectifiableDiameter}
          origin="visualization"
        />
        <ElementRegistration />
      </Content>
    </Container>
  );
};

export default Visualization;
