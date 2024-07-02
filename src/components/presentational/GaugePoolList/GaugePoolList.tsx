import React from 'react';
import GaugePoolChart from './GaugePoolChart';
import './GaugePoolList.scss';

const wyndPools = [
  {
    pool: 'wynd-juno',
    votes: 23431,
  },
  {
    pool: 'wynd-juno',
    votes: 23431,
  },
  {
    pool: 'wynd-juno',
    votes: 23431,
  },
  {
    pool: 'wynd-juno',
    votes: 23431,
  },
  {
    pool: 'wynd-juno',
    votes: 23431,
  },
  {
    pool: 'wynd-juno',
    votes: 23431,
  },
  {
    pool: 'wynd-juno',
    votes: 23431,
  },
];

const GaugePoolList = () => {
  return (
    <div className="gauge-pool-list">
      <div className="pool-chart">
        <GaugePoolChart />
      </div>
      <div className="pool-list-wrapper">
        <h1>Pools</h1>
        {wyndPools.map((item) => {
          return <span className="pool-item">{item.pool}</span>;
        })}
      </div>
    </div>
  );
};

export default GaugePoolList;
