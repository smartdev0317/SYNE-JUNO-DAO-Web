import Spin from '@client/components/presentational/Spin/Spin';
import useAddress from '@client/hooks/useAddress';
import { div, gt, gte, minus } from '@client/libs/math';
import { commas, truncateTitle } from '@client/libs/parse';
import {
  useAllProposals,
  useGetProposalVotesList,
  useGetQueryTotalUserPower,
  useQueryProposalConfig,
  useQueryUserHoldAmount,
} from '@client/queries/proposalInfo';
import { SMALLEST, SYNEPO } from '@client/utils/constants';
import {
  getRemainingTime,
  getTotalTime,
  secondsToTimeConverter,
} from '@client/utils/helper';
import { Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { WalletStatus } from '@cosmos-kit/core';
import { useRecoilValue } from 'recoil';
import { walletState } from '@client/services/state/walletAtoms';
import './ProposalsList.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faPlus } from '@fortawesome/free-solid-svg-icons';

const ProposalsList = () => {
  const { contents, isLoading } = useAllProposals();
  const { contents: userStaked, isLoading: isUserStakedLoading } =
    useGetQueryTotalUserPower();
  const { contents: daoInfo, isLoading: isDaoInfoLoading } =
    useQueryProposalConfig();
  const { contents: userHoldAmount, isLoading: isHoldAmoutLoading } =
    useQueryUserHoldAmount();
  const { address, status: walletStatus } = useRecoilValue(walletState);
  const [allPrposals, setAllProposal] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (contents?.length) {
      const temp = contents
        .slice(0, contents.length)
        .sort((a, b) => b.id - a.id);
      setAllProposal(temp);
    }
  }, [isLoading, contents]);

  const calculteProposalCreationEligibility = (
    userStaked,
    daoInfo,
    userHoldAmount,
  ) => {
    if (!address?.length || walletStatus == WalletStatus.Disconnected) {
      return {
        status: true,
        error: null,
      };
    } else if (userStaked <= '0') {
      return {
        status: true,
        error: `You need min ${commas(
          div(daoInfo?.proposal_creation_token_limit, SMALLEST),
        )} veSYNE to create a proposal.`,
      };
    } else if (
      gt(
        div(daoInfo?.proposal_creation_token_limit, SMALLEST),
        div(minus(userStaked, userHoldAmount), SMALLEST),
      )
    ) {
      return {
        status: true,
        error: `You need min ${commas(
          div(daoInfo?.proposal_creation_token_limit, SMALLEST),
        )} ${SYNEPO} to create a proposal.`,
      };
    } else {
      return {
        status: false,
        error: '',
      };
    }
  };

  const handleCreate = (userStaked, daoInfo, userHoldAmount) => {
    if (
      !calculteProposalCreationEligibility(userStaked, daoInfo, userHoldAmount)
        .status
    ) {
      navigate('create');
    }
  };

  return (
    <div className="mt p-20 proposal-list">
      <div className="heading-sec">
        <div>
          <span className="proposal--heading-title">Proposals</span>
          <p className='proposal--heading-subtitle'>View detailed list of your whole voting history by clicking on it</p>
        </div>
        {isUserStakedLoading || isDaoInfoLoading || isHoldAmoutLoading ? (
          <Spin />
        ) : (
          <Tooltip
            trigger={['hover']}
            color={'#303549'}
            title={
              calculteProposalCreationEligibility(
                userStaked?.balance,
                daoInfo,
                userHoldAmount,
              ).error
            }
          >
            <span
              className={`create-btn ${
                calculteProposalCreationEligibility(
                  userStaked?.balance,
                  daoInfo,
                  userHoldAmount,
                ).status
                  ? 'disabled'
                  : ''
              }`}
              onClick={() =>
                handleCreate(userStaked?.balance, daoInfo, userHoldAmount)
              }
            >
              {' '}
              <span>
                <FontAwesomeIcon
                  icon={faPlus}
                  className="main_icons"
                />
              </span>
              Create a proposal
            </span>
          </Tooltip>
        )}
      </div>
      <div className="all-proposals">
        <div className="proposal-item mt proposal-header">
          <span className="proposal-title">PROPOSAL</span>
          <span className="text-design-status">STATUS</span>
          <span className="text-design-id">NUMBER</span>
        </div>
        {isLoading ? (
          'loading'
        ) : allPrposals?.length ? (
          allPrposals?.map((item, index) => {
            return (
              <Link key={index} to={`/details/${item.id}`}>
                <div className="proposal-item">
                  <span className="proposal-title">
                    {truncateTitle(item.proposal.title, 40)}
                  </span>
                  <span className="text-design-status">
                    <span className={`bg-status ${item.proposal.status}`}>
                      {gt(
                        minus(
                          getTotalTime(
                            item?.proposal?.voting_start_time,
                            item?.proposal?.expiration?.at_time,
                          ),
                          getRemainingTime(item?.proposal?.voting_start_time),
                        ),
                        '0',
                      )
                        ? secondsToTimeConverter(
                            minus(
                              getTotalTime(
                                item?.proposal?.voting_start_time,
                                item?.proposal?.expiration?.at_time,
                              ),
                              getRemainingTime(item?.proposal?.voting_start_time),
                            ),
                            false,
                          )
                        : item.proposal.status}
                    </span>
                  </span>
                  <span className="text-design-id">{item.votes}</span>
                </div>
              </Link>
            );
          })
        ) : address ? (
          <></>
        ) : (
          <span className="connect-text">Connect Wallet</span>
        )}
      </div>
    </div>
  );
};

export default ProposalsList;
