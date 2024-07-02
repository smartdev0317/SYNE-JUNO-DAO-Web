import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChain, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { truncate } from '@client/libs/parse';
import Spin from '@client/components/presentational/Spin/Spin';
import './GaugeDetailBox.scss';

const GaugeDetailBox = () => {
  const isLoading = false;
  const details = null;
  const userVote = null;
  return (
    <>
      {isLoading ? (
        <Spin />
      ) : (
        <div className="gauge-details-wrapper">
          <div className="details-box">
            <div className="uper-section">
              <div className="inner-item">
                <div className="title">Gauge ID</div>
                <div className="content">#{details?.id}</div>
              </div>
              <div className="center-border"></div>
              <div className="inner-item">
                <div className="title">Status</div>
                <div className="content"> {details?.proposal?.status}</div>
              </div>
              <div className="center-border"></div>
              <div className="inner-item">
                <div className="title">Next Epoch</div>
                <div className={`content`}>
                  {userVote?.vote?.vote ? (
                    <span className={`${userVote?.vote?.vote}-label p-unset`}>
                      {userVote?.vote?.vote}
                    </span>
                  ) : (
                    <FontAwesomeIcon icon={faCircleInfo} />
                  )}
                </div>
              </div>
            </div>
            <div className="lower-section">
              <span className="proposer">Epoch Length</span>
              <span className="d-f link">
                <FontAwesomeIcon icon={faChain} className="chain-icon" />
                {truncate(details?.proposal?.proposer)}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GaugeDetailBox;
