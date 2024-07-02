import GaugeDetailBox from '@client/components/presentational/GaugeDetailBox/GaugeDetailBox';
import GaugePoolList from '@client/components/presentational/GaugePoolList/GaugePoolList';
import React from 'react';
import './Gauges.scss';

const Gauges = () => {
  return (
    <div className="gauges min-he">
      <div className="pool-list-section">
        <GaugePoolList />
      </div>
      <div className="pool-detail-section">
        <GaugeDetailBox />
      </div>
      <button>Vote Now</button>
    </div>
  );
};

export default Gauges;
