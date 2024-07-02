import {
  useAllProposals,
  useLopoTokenInfo,
  useQueryProposalConfig,
} from '@client/queries/proposalInfo';
import ProposalsList from '../ProposalsList/ProposalsList';
// import SYNE_ICON from '@client/assets/loop_icon.svg';
import juno from '@client/assets/juno.png';
import syne from '@client/assets/syne.png';
// import wynd from '@client/assets/wynd.png';
// import loop from '@client/assets/loop.png';
import Logo from '../../LogoIcon';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserGroup,
  faBank,
  faPen,
  faClock,
  faMoneyBills,
  faEdit,
  faChain,
  faPaperclip,
  faHandPaper,
  faFileLines,
  faCopy,
  faNotesMedical,
  faNoteSticky,
  faInfo,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';
import './Overview.scss';
import VotingPower from '@client/components/presentational/VotingPower/VotingPower';
import contracts from '../../../../contracts.json';
import { chainId, chainName } from '@client/App'
import { commas, decimal, numbers, truncate } from '@client/libs/parse';
import { JUNO, JUNOX, SYNE, SYNEPO, SMALLEST } from '@client/utils/constants';
import { div, gt, multiple } from '@client/libs/math';
import Spin from '@client/components/presentational/Spin/Spin';
import {
  useTreasuasryJunoBalance,
  useTreasurySyneBalance,
  useTokenPrices
} from '@client/queries/tokenInfo';
import { checkNested } from '@client/components/presentational/ProposalVotingDetail/votingDetailHelper';
import { getUnstakingPeriod } from '@client/utils/helper';
import CopyToClip from '@client/components/presentational/CopyToClip/CopyToClip';
import useAddress from '@client/hooks/useAddress';
import {useSYNEUnitPrice} from "@client/queries/api";
import { Grid, GridItem, Img } from '@chakra-ui/react'

const Overview = () => {
  const { contents, isLoading } = useAllProposals();
  const { contents: lopoTokenInfo } =
    useLopoTokenInfo();
  const { contents: daoInfo } =
    useQueryProposalConfig();
  const { contents: treasurySyneBalance } = useTreasurySyneBalance();
  const { contents: treausaryJunoBalance } = useTreasuasryJunoBalance();
  const address = useAddress();
  const { contents: synePrice } = useSYNEUnitPrice()

  return (
    <div className="overview-row">
      {isLoading ? (
        <Spin />
      ) : (
        <div className="min-he main-row">
          <div className="center-col">
            <div className="p-6 center-section">
              {/* <h1 className="header-text">{SYNEPO}</h1> */}
              <div className="heading mt">
                <div className="subtitle">Powered by DAODAO</div>
                <div className="header-text"> Community Wallet Voting</div>
                <div className="desc-text">Synergistic DAO for.....</div>
              </div>
              <Grid templateColumns='repeat(12, 1fr)' gap={30} mt="64px" mb="88px">
                <GridItem colSpan={{ base: 12, md: 6, lg: 6 }}>
                  <Grid templateColumns='repeat(12, 1fr)' gap={4}>
                    <GridItem colSpan={12}>
                      <VotingPower />
                    </GridItem>
                    <GridItem colSpan={6}>
                      <div className="conf-info">
                        <span>
                          <FontAwesomeIcon
                            icon={faClock}
                            className="main_icons"
                          />
                        </span>
                        <p>
                          Vote Duration
                          <br />
                          <p className='duration-text'>
                            {address ? (
                              <>
                                {getUnstakingPeriod(
                                  daoInfo?.max_voting_period?.time,
                                )}{' '}
                                Days
                              </>
                            ) : (
                              'Days'
                            )}
                          </p>
                        </p>
                      </div>
                    </GridItem>
                    <GridItem colSpan={6}>
                      <div className="conf-info">
                        <span>
                          <FontAwesomeIcon
                            icon={faFileLines}
                            className="main_icons"
                          />
                        </span>
                        <p>
                          Proposals Created
                          <br />
                          <p className='duration-text'>
                            {contents?.length}
                          </p>
                        </p>
                      </div>
                    </GridItem>
                    <GridItem colSpan={12}>
                      <div className="conf-info">
                        <span>
                          <Logo />
                        </span>
                        <p>
                          Total Supply
                          <br />
                          <p className='duration-text'>
                            {gt(
                              decimal(div(lopoTokenInfo?.total_supply, SMALLEST), 2),
                              '0',
                            )
                              ? numbers(
                                  decimal(div(lopoTokenInfo?.total_supply, SMALLEST), 2),
                                )
                              : ''}{' '}
                            {SYNEPO}
                          </p>
                        </p>
                      </div>
                    </GridItem>
                  </Grid>
                </GridItem>
                <GridItem colSpan={{ base: 12, md: 6, lg: 6 }}>
                  <Grid templateColumns='repeat(12, 1fr)' gap={0}>
                    <GridItem colSpan={12}>
                      <div className='treasury-section'>
                        <h2 className="power-heading">Treasury</h2>
                        <div className='treasury-main-info'>
                          <span className="treasury-bal">~${ commas(decimal(multiple(div(treasurySyneBalance?.balance, SMALLEST), synePrice), 2))}</span>
                          <p className='staking-addr'>
                            Staking Address:
                            <span>{truncate(contracts[chainId].staking)}</span>
                            <CopyToClip value={contracts[chainId].staking}>
                              <FontAwesomeIcon
                                icon={faCopy}
                                className="main_icons c-pointer"
                              />
                            </CopyToClip>
                          </p>
                        </div>
                        <div className='treasury-tokens'>
                          <div className="treasury-token">
                            <Img src={juno} alt="WYMD" />
                            <span>
                            {gt(
                              decimal(
                                div(treausaryJunoBalance?.amount, SMALLEST),
                                2,
                              ),
                              '0',
                            )
                              ? commas(
                                  decimal(
                                    div(treausaryJunoBalance?.amount, SMALLEST),
                                    2,
                                  ),
                                )
                              : '0'} {' '}
                            </span>
                            {chainName == 'juno' ? JUNO : JUNOX}
                          </div>
                          <div className="treasury-token">
                            <Img src={syne} alt="WYMD" />
                            <span>
                            {gt(
                              decimal(
                                div(treasurySyneBalance?.balance, SMALLEST),
                                2,
                              ),
                              '0',
                            )
                              ? commas(
                                  decimal(
                                    div(treasurySyneBalance?.balance, SMALLEST),
                                    2,
                                  ),
                                )
                              : '0'} {' '}
                            </span>
                            {SYNE}
                          </div>
                        </div>
                      </div>
                    </GridItem>
                    <GridItem colSpan={12}>
                      <hr />
                      <div className='passing-conf'>
                        Single Choice Proposals
                        <p className='passing-opt'>
                          Passing Threshhold<span>Majority</span>
                        </p>                
                        <p className='passing-opt'>
                          Quorum
                          <span>
                            {multiple(
                              checkNested(daoInfo?.threshold, 'quorum')?.value,
                              '100',
                            ) ?? ''}
                            %
                          </span>
                        </p>
                        <p className='passing-opt'>
                          {SYNEPO} needed to create/proposal
                          <span>
                            {commas(div(daoInfo?.proposal_creation_token_limit, SMALLEST))}
                            <a className="stake-link" href="https://juno.loop.markets/stake" target={'_blank'}>
                              Stake Now
                            </a>
                          </span>
                        </p>       
                        <p className='passing-opt'>
                          <FontAwesomeIcon
                            icon={faInfoCircle}
                            className="main_icons"
                          />
                          <span className='warning-text'>
                            Failed proposals: will lose the ability to vote again
                            using the same{' '}
                            {`${commas(
                              div(
                                daoInfo.proposal_creation_token_limit,
                                SMALLEST,
                              ),
                            )} ${SYNEPO}.  `}
                            The {SYNEPO} will remain in your wallet and your staking positions & Yields will be unaffected.
                          </span>
                        </p>         
                      </div>
                    </GridItem>
                  </Grid>
                </GridItem>
              </Grid>

              <ProposalsList />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
