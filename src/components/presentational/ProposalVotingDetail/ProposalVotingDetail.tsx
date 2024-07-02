import { div, gt, gte, minus, multiple, plus } from '@client/libs/math';
import { decimal } from '@client/libs/parse';
import {
  useGetProposalVotesList,
  useGetTotalStaked,
  useQueryProposalConfig,
} from '@client/queries/proposalInfo';
import {
  getRemainingTime,
  getTotalTime,
  getVotingPercentage,
  secondsToTimeConverter,
} from '@client/utils/helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'antd';
import { useParams } from 'react-router';
import {
  checkNested,
  getTimeBarWidth,
  getVotingTurnout,
} from './votingDetailHelper';
import { faCaretUp, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { CheckIcon, CrossIcon } from '@client/utils/emoji';
import { useEffect, useState } from 'react';

const VoteRatioSection = ({ details, totalVotesCount }) => {
  return (
    <div className="vote-status">
      <span className="head p-relative margin-b">Ratio of votes</span>
      <div className="p-relative">
        <div className="progres-bar">
          <span
            className="yes"
            style={{
              width: `${getVotingPercentage(
                totalVotesCount,
                details?.proposal?.votes?.yes,
              )}%`,
            }}
          ></span>
          <span
            className="no"
            style={{
              width: `${getVotingPercentage(
                totalVotesCount,
                details?.proposal?.votes?.no,
              )}%`,
            }}
          ></span>
          <span
            className="abstain"
            style={{
              width: `${getVotingPercentage(
                totalVotesCount,
                details?.proposal?.votes?.abstain,
              )}%`,
            }}
          ></span>
          <Tooltip
            title={
              "A proposal must attain this proportion of 'Yes' votes to pass."
            }
            color={'#303549'}
          >
            <span className="notch">
              <FontAwesomeIcon icon={faCaretUp} />
            </span>
          </Tooltip>
        </div>
        <div className="vote-label-wrapper">
          <label className="yes-label">
            Yes{' '}
            {`${decimal(
              getVotingPercentage(
                totalVotesCount,
                details?.proposal?.votes?.yes,
              ),
              2,
            )}%`}{' '}
          </label>
          <label className="no-label">
            No{' '}
            {`${decimal(
              getVotingPercentage(
                totalVotesCount,
                details?.proposal?.votes?.no,
              ),
              2,
            )}%`}
          </label>
          <label className="abstain-label">
            Abstain{' '}
            {`${decimal(
              getVotingPercentage(
                totalVotesCount,
                details?.proposal?.votes?.abstain,
              ),
              2,
            )}%`}
          </label>
        </div>
      </div>
      <div className="passing-threshould">
        <div className="thres-section">
          <span className="title">Passing threshold</span>
          <Tooltip
            title={
              "A proposal must attain this proportion of 'Yes' votes to pass."
            }
            color={'#303549'}
          >
            <FontAwesomeIcon
              icon={faInfoCircle}
              color="var(--icon-secondary)"
            />
          </Tooltip>
        </div>
        <span className="value">
          Majority
          {gte(
            getVotingPercentage(totalVotesCount, details?.proposal?.votes?.yes),
            '50',
          ) ? (
            <CheckIcon />
          ) : (
            <CrossIcon />
          )}
        </span>
      </div>
    </div>
  );
};

const TurnoutSection = ({ voteList, totalBalance, daoInfo }) => {
  return (
    <div className="vote-status new-gap">
      <span className="head p-relative">
        {decimal(getVotingTurnout(voteList, totalBalance), 5)}% turnout
      </span>
      <div className="p-relative">
        <div className="progres-bar ">
          <span
            style={{
              width: `calc(${getVotingTurnout(
                voteList,
                totalBalance,
              )}% + 6px)`,
            }}
            className={
              getVotingTurnout(voteList, totalBalance) <
              multiple(checkNested(daoInfo?.threshold, 'quorum')?.value, '100')
                ? 'turnout-bar-color'
                : 'completed-turnout-bar'
            }
          ></span>
          <span
            className="notch"
            style={{
              left: `${multiple(
                checkNested(daoInfo?.threshold, 'quorum')?.value,
                '100',
              )}%`,
            }}
          >
            <FontAwesomeIcon icon={faCaretUp} />
          </span>
        </div>
      </div>
      <div className="passing-threshould">
        <span className="title margin-t">
          Quorum
          <Tooltip
            title={
              'This proportion of voting power must vote on a proposal for it to pass.'
            }
            color={'#303549'}
          >
            <FontAwesomeIcon
              icon={faInfoCircle}
              color="var(--icon-secondary)"
            />
          </Tooltip>
        </span>
        <span className="value margin-t">
          {multiple(checkNested(daoInfo?.threshold, 'quorum')?.value, '100')}%
          {getVotingTurnout(voteList, totalBalance) <
          multiple(checkNested(daoInfo?.threshold, 'quorum')?.value, '100') ? (
            <CrossIcon />
          ) : (
            <CheckIcon />
          )}
        </span>
      </div>
    </div>
  );
};

const ProposalVotingDetail = ({ totalVotesCount, details }) => {
  const { contents: totalBalance, isLoading: isTotalStakedLoading } =
    useGetTotalStaked();
  const { contents: daoInfo, isLoading: isDaoInfoLoading } =
    useQueryProposalConfig();
  const params = useParams();
  const { id } = params;
  const { contents: voteList, isLoading } = useGetProposalVotesList(id);
  const [time, setTime] = useState(Date.now());
  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <div className="details-section dark-bg">
      <VoteRatioSection
        details={details}
        totalVotesCount={totalVotesCount}
        key="vote-ratio"
      />
      {checkNested(daoInfo?.threshold, 'quorum')?.status ? (
        <TurnoutSection
          voteList={voteList}
          totalBalance={totalBalance}
          key="turnout"
          daoInfo={daoInfo}
        />
      ) : (
        <></>
      )}

      {gt(
        minus(
          getTotalTime(
            details?.proposal?.voting_start_time,
            details?.proposal?.expiration?.at_time,
          ),
          getRemainingTime(details?.proposal?.voting_start_time),
        ),
        '0',
      ) ? (
        <div className="vote-status new-gap">
          <h3 className="head">Time Left</h3>
          <div className="p-relative">
            <div className="progres-bar">
              <span
                className="abstain"
                style={{
                  width: `${getTimeBarWidth(
                    details?.proposal?.voting_start_time,
                    details?.proposal?.expiration?.at_time,
                  )}%`,
                }}
              ></span>
            </div>
            <label className="remaining-time-label">
              {gt(
                minus(
                  getTotalTime(
                    details?.proposal?.voting_start_time,
                    details?.proposal?.expiration?.at_time,
                  ),
                  getRemainingTime(details?.proposal?.voting_start_time),
                ),
                '0',
              )
                ? secondsToTimeConverter(
                    minus(
                      getTotalTime(
                        details?.proposal?.voting_start_time,
                        details?.proposal?.expiration?.at_time,
                      ),
                      getRemainingTime(details?.proposal?.voting_start_time),
                    ),
                  )
                : '0sec'}{' '}
            </label>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ProposalVotingDetail;
