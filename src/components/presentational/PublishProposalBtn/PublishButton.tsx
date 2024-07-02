import { verifyActions } from '@client/components/smart/CreateProposal/getActionHelper';
import { div, gt, minus } from '@client/libs/math';
import { commas, decimal } from '@client/libs/parse';
import {
  useGetQueryTotalUserPower,
  useQueryProposalConfig,
  useQueryUserHoldAmount,
} from '@client/queries/proposalInfo';
import { SYNEPO, SMALLEST } from '@client/utils/constants';
import Spin from '../Spin/Spin';

export const ProposalError = () => {
  const { contents: userStaked, isLoading: isUserStakedLoading } =
    useGetQueryTotalUserPower();
  const { contents: daoInfo, isLoading: isDaoInfoLoading } =
    useQueryProposalConfig();
  const { contents: userHoldAmount, isLoading: isHoldAmoutLoading } =
    useQueryUserHoldAmount();
  return (
    <>
      {gt(
        daoInfo?.proposal_creation_token_limit,
        minus(userStaked?.balance, userHoldAmount),
      ) ? (
        <div className="error-msg">
          *Connected Wallet needs
          <span className="req-token">
            {commas(
              decimal(
                div(
                  minus(
                    daoInfo?.proposal_creation_token_limit,
                    minus(userStaked?.balance, userHoldAmount),
                  ),
                  SMALLEST,
                ),
                2,
              ),
            )}
          </span>
          more {SYNEPO} to create proposal. Stake
          <a href="https://juno.loop.markets/stake" target={'_blank'}>
            here
          </a>
          to get more
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

const PublishButton = ({ submitFun, finalMsg, isLoading }) => {
  const { contents: userStaked, isLoading: isUserStakedLoading } =
    useGetQueryTotalUserPower();
  const { contents: daoInfo, isLoading: isDaoInfoLoading } =
    useQueryProposalConfig();
  const { contents: userHoldAmount, isLoading: isHoldAmoutLoading } =
    useQueryUserHoldAmount();
  return (
    <button
      className={
        isLoading ||
        !finalMsg.title?.length ||
        gt(
          daoInfo?.proposal_creation_token_limit,
          minus(userStaked?.balance, userHoldAmount),
        ) ||
        !finalMsg.description.length ||
        !verifyActions(finalMsg)
          ? 'action-btn disabled'
          : 'action-btn'
      }
      onClick={submitFun}
      disabled={
        isLoading ||
        !finalMsg.title?.length ||
        gt(
          daoInfo?.proposal_creation_token_limit,
          minus(userStaked?.balance, userHoldAmount),
        ) ||
        !finalMsg.description.length ||
        !verifyActions(finalMsg)
      }
    >
      {isLoading ? (
        <>
          Publish Proposal <Spin />
        </>
      ) : (
        <span>Publish Proposal</span>
      )}
    </button>
  );
};

export default PublishButton;
