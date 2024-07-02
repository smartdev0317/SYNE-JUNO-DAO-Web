import WalletConnect from '@client/components/smart/WalletConnectSection/WalletConnect';
import useAddress from '@client/hooks/useAddress';
import { div, gt, multiple } from '@client/libs/math';
import { commas, decimal } from '@client/libs/parse';
import {
  useGetQueryTotalStakedByUser,
  useGetQueryTotalUserPower,
  useGetTotalStaked,
  useQueryUserHoldAmount,
} from '@client/queries/proposalInfo';
import { SYNEPO, SMALLEST } from '@client/utils/constants';
import Logo from '../../LogoIcon';
import { Progress } from '@chakra-ui/react';
import contracts from '../../../../contracts.json';
import { chainId } from '@client/App';
import { truncate } from '@client/libs/parse';
import CopyToClip from '@client/components/presentational/CopyToClip/CopyToClip';
import './VotingPower.scss';

const VotingPower = () => {
  const { contents: totalBalance, isLoading: isTotalStakedLoading } =
    useGetTotalStaked();
  const { contents: userHoldAmount, isLoading: isHoldAmoutLoading } =
    useQueryUserHoldAmount();
  const { contents: totalUserPower, isLoading } = useGetQueryTotalUserPower();
  const address = useAddress();

  return (
    <div className="voting-power-wrapper">
      {address ? (
        <>
          <h2 className="power-heading">Your Voting Power</h2>
          <div className="d-flex">
            <div className="power-percent">
              {' '}
              {!isTotalStakedLoading &&
                !isLoading &&
                `${
                  gt(totalUserPower?.balance, '0')
                    ? commas(
                        decimal(
                          multiple(
                            div(
                              totalUserPower?.balance ?? 0,
                              totalBalance ?? 0,
                            ),
                            '100',
                          ),
                          4,
                        ),
                      )
                    : '0'
                }%`}
            </div>
            <div className="d-flex staked-desc">
              <Logo />
              <span className="user-balance">
                {commas(
                  decimal(div(totalUserPower?.balance ?? 0, SMALLEST), 4),
                ) ?? 0}
              </span>
              {SYNEPO}
            </div>
            {/* {userHoldAmount > 0 && (
              <h5 className="staked-desc">
                Unusable veSYNE from pending/failed proposals:{' '}
                {div(userHoldAmount, SMALLEST)} {SYNEPO}
              </h5>
            )} */}
          </div>
          <Progress my={17} borderRadius="24px" colorScheme="cyan" size="sm" bgColor="#31335B" value={totalBalance ? 0 : Number(multiple(div(Number(totalUserPower?.balance),totalBalance),'100'))} />
          <CopyToClip value={contracts[chainId].proposal}>
            <h2 className="power-heading c-pointer">DAO’s Address : {truncate(contracts[chainId].proposal, [15,15])}</h2>
          </CopyToClip>
        </>
      ) : (
        <WalletConnect />
      )}
    </div>
  );
};

export default VotingPower;
