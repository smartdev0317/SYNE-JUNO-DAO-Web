import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChain } from '@fortawesome/free-solid-svg-icons';
import { truncate } from '@client/libs/parse';
import { useGetQueryUserVote } from '@client/queries/proposalInfo';
import Spin from '@client/components/presentational/Spin/Spin';
import CopyToClip from '@client/components/presentational/CopyToClip/CopyToClip';
import './ClosedProposalDetails.scss';

const ClosedProposalDetails = ({ details }) => {
  const { contents: userVote, isLoading } = useGetQueryUserVote(details?.id);
  return (
    <>
      {isLoading ? (
        <Spin />
      ) : (
        <div className="closed-details-wrapper">
          <h2 className="details-heading-text">Details</h2>
          <div className="details-box">
            <div className="uper-section">
              <div className="inner-item">
                <div className="title">Proposal</div>
                <div className="content">#{details?.id}</div>
              </div>
              <div className="center-border"></div>
              <div className="inner-item">
                <div className="title">Status</div>
                <div className="content"> {details?.proposal?.status}</div>
              </div>
              <div className="center-border"></div>
              <div className="inner-item">
                <div className="title">You</div>
                <div className={`content`}>
                  {userVote?.vote?.vote ? (
                    <span className={`${userVote?.vote?.vote}-label p-unset`}>
                      {userVote?.vote?.vote}
                    </span>
                  ) : (
                    '-'
                  )}
                </div>
              </div>
            </div>
            <div className="lower-section">
              <span className="proposer">Proposer</span>
              <CopyToClip value={details?.proposal?.proposer}>
                <span className="d-f link pointer">
                  <FontAwesomeIcon icon={faChain} className="chain-icon" />
                  {truncate(details?.proposal?.proposer)}
                </span>
              </CopyToClip>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ClosedProposalDetails;
