import React from 'react';
import {
  faChain,
  faDollarSign,
  faPieChart,
} from '@fortawesome/free-solid-svg-icons';
import contracts from '../../../../contracts.json';
import { commas, truncate } from '@client/libs/parse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SYNEPO, SMALLEST } from '@client/utils/constants';
import { div, multiple } from '@client/libs/math';
import { useQueryProposalConfig } from '@client/queries/proposalInfo';
import CopyToClip from '../CopyToClip/CopyToClip';
import { chainId } from '@client/App';
import { checkNested } from '../ProposalVotingDetail/votingDetailHelper';

const ProposalInfoSection = () => {
  const { contents: daoInfo, isLoading: isDaoInfoLoading } =
    useQueryProposalConfig();
  return (
    <div className="create-right-section">
      <h2 className="address-heading">Addresses</h2>
      <div className="address-block">
        <span className="item-title">DAO</span>
        <CopyToClip value={contracts[chainId].proposal}>
          <span className="item-address">
            <FontAwesomeIcon icon={faChain} className="plus_icon" />
            {truncate(contracts[chainId].proposal)}
          </span>
        </CopyToClip>
      </div>
      <div className="address-block">
        <span className="item-title">Staking</span>
        <CopyToClip value={contracts[chainId].staking}>
          <span className="item-address">
            <FontAwesomeIcon icon={faChain} className="plus_icon" />
            {truncate(contracts[chainId].staking)}
          </span>
        </CopyToClip>
      </div>
      <div className="address-block">
        <span className="item-title">Gov Token</span>
        <CopyToClip value={contracts[chainId].staking}>
          <span className="item-address">
            <FontAwesomeIcon icon={faChain} className="plus_icon" />
            {truncate(contracts[chainId].staking)}
          </span>
        </CopyToClip>
      </div>
      <h2 className="address-heading mt-12">Proposal Info</h2>
      <div className="address-block">
        <span className="item-title">
          <FontAwesomeIcon icon={faDollarSign} className="plus_icon" />
          {SYNEPO} needed to create each proposal:
        </span>
        <span className="item-address">
          {commas(div(daoInfo?.proposal_creation_token_limit, SMALLEST))}{' '}
          <span>
            <a className="stake-link" href="https://juno.loop.markets/stake" target={'_blank'}>
              Stake Now
            </a>
          </span>
        </span>
      </div>
      <div className="address-block">
        <span className="item-title">
          <FontAwesomeIcon icon={faDollarSign} className="plus_icon" />
          Failed proposals:
        </span>
        <span className="item-address">
          will lose the ability to vote again using the same{' '}
          {`${commas(
            div(daoInfo.proposal_creation_token_limit, SMALLEST),
          )} ${SYNEPO}  `}
        </span>
      </div>
      <div className="address-block">
        <span className="item-title">
          <FontAwesomeIcon icon={faPieChart} className="plus_icon" />
          Passing threshold:
        </span>
        <span className="item-address">Majority</span>
      </div>
      <div className="address-block">
        <span className="item-title">
          <FontAwesomeIcon icon={faPieChart} className="plus_icon" />
          Quorum:
        </span>
        <span className="item-address">
          {multiple(
            checkNested(daoInfo?.threshold, 'quorum')?.value,
            '100',
          ) ?? ''}
          %
        </span>
      </div>
    </div>
  );
};

export default ProposalInfoSection;
