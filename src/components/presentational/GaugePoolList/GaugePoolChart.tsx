import React from 'react';
import { Pie } from 'react-chartjs-2';
import {Chart, ArcElement,LinearScale} from 'chart.js'
Chart.register(ArcElement,LinearScale);

const GaugePoolChart = () => {
  const colorArray = [
    '#AF435D',
    '#D4B957',
    '#96C24E',
    '#8A61E2',
    '#AF6343',
    '#0998B9',
    '#2ED081',
    '#9BB0CF',
  ];
  const data = {
    datasets: [
      {
        label: 'My First Dataset',
        data: [1, 2, 33, 55, 22, 67],
        backgroundColor: [...colorArray],
        hoverOffset: 2,
        borderColor: '#343232',
        borderWidth: 2,
        percentageInnerCutout: 40,
      },
    ],
  };
  return (
    <div>
      <Pie
        data={data}
        width={300}
        height={285}
        options={{
          layout: {
            padding: 2,
          },
          maintainAspectRatio: false,
        }}
      />
    </div>
  );
};

export default GaugePoolChart;
