import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea,
} from 'recharts';

const data1 = [
  { x: 100, y: 100 },
  { x: 200, y: 100 },
  { x: 200, y: 200 },
  { x: 100, y: 200 },
  { x: 100, y: 100 },
];

const data2 = [
  { x: 200, y: 100 },
  { x: 300, y: 100 },
  { x: 300, y: 300 },
  { x: 200, y: 300 },
  { x: 200, y: 200 },
];

const data4 = [
  { x: 300, y: 300 },
  { x: 300, y: 400 },
  { x: 250, y: 400 },
  { x: 250, y: 300 },
];

const data3 = [
  { x: 200, y: 100 },
  { x: 200, y: 130.12 },
];

const Chart: React.FC = () => {
  return (
    <ScatterChart width={800} height={450}>
      <CartesianGrid />
      <XAxis type="number" dataKey="x" name="X" domain={[-400, 400]} />
      <YAxis
        type="number"
        dataKey="y"
        name="Y"
        yAxisId="left"
        domain={[-400, 400]}
      />
      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
      <Legend />
      <Scatter
        name="Dataset 1"
        data={data1}
        fill="#8884d8"
        line
        yAxisId="left"
      />
      <Scatter
        name="Dataset 1"
        data={data2}
        fill="purple"
        line
        yAxisId="left"
      />
      <Scatter
        name="Dataset 1"
        data={data4}
        fill="purple"
        line
        yAxisId="left"
      />
      <Scatter name="Dataset 1" data={data3} fill="orange" yAxisId="left" />
      <ReferenceArea
        x1={100}
        y1={200}
        x2={200}
        y2={100}
        stroke="red"
        // strokeOpacity={0.3}
      />
    </ScatterChart>
  );
};

export default Chart;
