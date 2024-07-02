import { VotesList } from '@client/components/presentational/AllVotesOnProposal/VotesList';
import CastVote from '@client/components/presentational/CastVoteSection/CastVote';
import ExceuteProposal from '@client/components/presentational/ExceuteProposal/ExceuteProposal';
import ProposalVotingDetail from '@client/components/presentational/ProposalVotingDetail/ProposalVotingDetail';
import Spin from '@client/components/presentational/Spin/Spin';
import OpenToast from '@client/components/presentational/Toaster/Toast';
import { plus, div, gt, multiple } from '@client/libs/math';
import { priceKeyIndexState } from '@client/queries/app';
import { useGetProposalDetails, useGetProposalVotesList, useGetQueryUserVote, useGetTotalStaked, useQueryProposalConfig } from '@client/queries/proposalInfo';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import ActionDetails from '../ActionDetails/ActionDetails';
import ClosedProposalDetails from '../ClosedProposalDetails/ClosedProposalDetails';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faCircleCheck, faCircleInfo, faCircleXmark, faClone, faCopy, faCross } from '@fortawesome/free-solid-svg-icons';
import useAddress from '@client/hooks/useAddress';
import { Grid, GridItem, Progress } from '@chakra-ui/react';
import { Tooltip } from 'antd';
import CopyToClip from '@client/components/presentational/CopyToClip/CopyToClip';
import { decimal, truncate } from '@client/libs/parse';
import './ProposalDetail.scss';
import { getVotingPercentage } from '@client/utils/helper';
import { checkNested, getVotingTurnout } from '@client/components/presentational/ProposalVotingDetail/votingDetailHelper';

const ProposalDetails = () => {
  const params = useParams();
  const { id } = params;
  const { contents: details, isLoading } = useGetProposalDetails(id);
  const { contents: voteList } = useGetProposalVotesList(id);
  const { contents: userVote } = useGetQueryUserVote(id);
  const { contents: totalBalance, isLoading: isTotalStakedLoading } = useGetTotalStaked();
  const { contents: daoInfo, isLoading: isDaoInfoLoading } = useQueryProposalConfig();
  const yesNoVotePower = plus(
    details?.proposal?.votes?.yes,
    details?.proposal?.votes?.no,
  );
  const totalVotesPower = plus(
    yesNoVotePower,
    details?.proposal?.votes?.abstain,
  );
  const address = useAddress();
  const serPriceKeyIndexStateState = useSetRecoilState(priceKeyIndexState);
  const [transactionStatus, setTransactionStatus] = useState({});

  const reset = () => {
    serPriceKeyIndexStateState((n) => n + 1);
  };

  const startAt12 = (value) => {
    return (value - 0.5);
  }

  const drawCircle = () => {
    var c = document.getElementById("mcp") as HTMLCanvasElement;
    var ctx = c.getContext("2d");
    var arc_x = c.dataset.arc_x;
    var arc_y = c.dataset.arc_y;
    var arc_radius = c.dataset.arc_radius;

    ctx.beginPath();
    ctx.arc(Number(arc_x), Number(arc_y), Number(arc_radius), 0 * Math.PI, 2 * Math.PI);
    ctx.strokeStyle = c.dataset.arc_color_bg;
    ctx.lineWidth= (Number(c.dataset.arc_size_bg) - 1);
    ctx.stroke();

    var arc1_per = Number(c.dataset.arc_per_1);
    var arc1_to_c = (Number(arc1_per) / 50 );
    var arc1_next_start = arc1_to_c;
    arc1_per = startAt12(arc1_to_c) * Math.PI;
    var arc1_start = startAt12(0) * Math.PI;
    ctx.beginPath();
    ctx.arc(Number(arc_x), Number(arc_y), Number(arc_radius), arc1_start, arc1_per);
    ctx.strokeStyle = c.dataset.arc_color_1;
    ctx.lineWidth= Number(c.dataset.arc_size_1);
    ctx.stroke();

    var arc2_per = Number(c.dataset.arc_per_2);
    var arc2_to_c = (Number(arc2_per) / 50);
    var arc2_next_start = arc2_to_c;
    arc2_per = startAt12(arc1_next_start + arc2_to_c) * Math.PI;
    var arc2_start = startAt12(arc1_next_start) * Math.PI;
    ctx.beginPath();
    ctx.arc(Number(arc_x), Number(arc_y), Number(arc_radius), arc2_start , arc2_per);
    ctx.strokeStyle = c.dataset.arc_color_2;
    ctx.lineWidth= Number(c.dataset.arc_size_2);
    ctx.stroke();


    var arc3_per = Number(c.dataset.arc_per_3);
    var arc3_to_c = (Number(arc3_per) / 50);
    var arc3_next_start = arc3_to_c;
    arc3_per = startAt12(arc1_next_start + arc2_next_start + arc3_to_c) * Math.PI;
    var arc3_start = startAt12(arc1_next_start + arc2_next_start) * Math.PI;
    ctx.beginPath();
    ctx.arc(Number(arc_x), Number(arc_y), Number(arc_radius), arc3_start , arc3_per);
    ctx.strokeStyle = c.dataset.arc_color_3;
    ctx.lineWidth= Number(c.dataset.arc_size_3);
    ctx.stroke();
  }

  useEffect(() => {
    setInterval(drawCircle, 1000)
  }, []);

  return (
    <>
      <OpenToast
        transactionStatusData={transactionStatus}
        resetFunction={reset}
      />
      <div className="main-wrapper">
        {isLoading || !details ? (
          <Spin />
        ) : (
          <>
            <div className="about-section">
              <Link className='back-btn' to={`/`}>
                <span>
                  <FontAwesomeIcon
                    icon={faChevronLeft}
                    className="main_icons"
                  />
                </span>
                Back
              </Link>
              <Grid templateColumns='repeat(12, 1fr)' gap={30} mt="32px" mb="70px">
                <GridItem colSpan={{ base: 12, md: 5, lg: 5 }}>
                  <div className='proposal-status'>
                    <p className='status-header'>
                      Proposal Status<span>Your Vote</span>
                    </p>    
                    <p className={`status-content ${details?.proposal?.status}`}>
                      {details?.proposal?.status.toLowerCase()}
                      <span>{userVote?.vote?.vote?.length ? userVote?.vote?.vote : "N/A"}</span>
                    </p>               
                  </div>
                  <hr />
                  <div className='proposal-chart'>
                    {/* <p className='proposal-chart-header'>
                      Voting Breakdown<span>View votes</span>
                    </p> */}
                    <div className='proposal-chart-body'>
                      <Grid templateColumns='repeat(5, 1fr)' gap={4} mt="20px" mb="32px">
                        <GridItem colSpan={{ base: 5, md: 2, lg: 2 }}>
                          <div className='multi-progress-bar'>
                            <canvas data-arc_x="75"
                              data-arc_y="75"
                              data-arc_radius="65"
                              data-arc_color_bg="#2c3e50"
                              data-arc_size_bg="10"
                              data-arc_per_1={getVotingPercentage(totalVotesPower,details?.proposal?.votes?.yes)}
                              data-arc_color_1="#8AE5B4"
                              data-arc_size_1="10"
                              data-arc_per_2={getVotingPercentage(totalVotesPower,details?.proposal?.votes?.no)}
                              data-arc_color_2="#F5919E"
                              data-arc_size_2="10"
                              data-arc_per_3={getVotingPercentage(totalVotesPower,details?.proposal?.votes?.abstain)}
                              data-arc_color_3="#FFFFFF"
                              data-arc_size_3="10"
                              id="mcp"
                              width="150"
                              height="150">
                              Your browser does not support the HTML5 canvas tag.
                            </canvas>
                            <span className='proposal-score'>
                              {decimal(getVotingPercentage(totalVotesPower,details?.proposal?.votes?.yes), 2)}%
                            </span>
                          </div>
                        </GridItem>
                        <GridItem colSpan={{ base: 5, md: 3, lg: 3 }} mt="10px">
                          <div className='progress-content'>
                            <span className='voting-option'><span className='yes-style'></span>Yes</span>
                            <span className='voting-percentage'>
                              { 
                                getVotingPercentage(totalVotesPower,details?.proposal?.votes?.yes) > getVotingPercentage(totalVotesPower,details?.proposal?.votes?.no) && getVotingPercentage(totalVotesPower,details?.proposal?.votes?.yes) > getVotingPercentage(totalVotesPower,details?.proposal?.votes?.abstain) ? 
                                (
                                  <span className='voting-majority'>majority</span>) : (
                                  <></>
                                )
                              }
                              {decimal(getVotingPercentage(totalVotesPower,details?.proposal?.votes?.yes), 2)}%</span>
                          </div>
                          <div className='progress-content'>
                            <span className='voting-option'><span className='no-style'></span>No</span>
                            <span className='voting-percentage'>
                              { 
                                getVotingPercentage(totalVotesPower,details?.proposal?.votes?.no) > getVotingPercentage(totalVotesPower,details?.proposal?.votes?.yes) && getVotingPercentage(totalVotesPower,details?.proposal?.votes?.no) > getVotingPercentage(totalVotesPower,details?.proposal?.votes?.abstain) ? 
                                (
                                  <span className='voting-majority'>majority</span>) : (
                                  <></>
                                )
                              }
                              {decimal(getVotingPercentage(totalVotesPower,details?.proposal?.votes?.no), 2)}%</span>
                          </div>
                          <div className='progress-content'>
                            <span className='voting-option'><span className='abstain-style'></span>Abstain</span>
                            <span className='voting-percentage'>
                              { 
                                getVotingPercentage(totalVotesPower,details?.proposal?.votes?.abstain) > getVotingPercentage(totalVotesPower,details?.proposal?.votes?.yes) && getVotingPercentage(totalVotesPower,details?.proposal?.votes?.abstain) > getVotingPercentage(totalVotesPower,details?.proposal?.votes?.no) ? 
                                (
                                  <span className='voting-majority'>majority</span>) : (
                                  <></>
                                )
                              }
                              {decimal(getVotingPercentage(totalVotesPower,details?.proposal?.votes?.abstain), 2)}%</span>
                          </div>
                        </GridItem>
                      </Grid>
                    </div>
                    <div className='quoram-content'>
                      <span className='quoram-option'>
                        Quorum : {multiple(checkNested(daoInfo?.threshold, 'quorum')?.value, '100')}%
                        <Tooltip
                          title={
                            'This proportion of voting power must vote on a proposal for it to pass.'
                          }
                          color={'#303549'}
                          overlayInnerStyle={{fontSize:"10px !important"}}
                        >
                          <FontAwesomeIcon
                            icon={faCircleInfo}
                            className="main_icons c-pointer"
                          />
                        </Tooltip>
                      </span>
                      <span className='quoram-percentage'>
                        <FontAwesomeIcon
                          icon={getVotingTurnout(voteList, totalBalance) < multiple(checkNested(daoInfo?.threshold, 'quorum')?.value, '100') ? faCircleXmark : faCircleCheck}
                          className="main_icons c-pointer"
                        />
                        {decimal(getVotingTurnout(voteList, totalBalance), 2)}/100%
                      </span>
                    </div>
                    <Progress my={17} borderRadius="24px" colorScheme="cyan" size="sm" bgColor="#31335B" value={Number(multiple(div(20 ?? 0,20 ?? 0,),'100'))} />
                  </div>
                  {details?.proposal?.status.toLowerCase() == 'open' ? (
                    <CastVote setTransactionStatus={setTransactionStatus} />
                  ) : (
                    <ExceuteProposal
                      setTransactionStatus={setTransactionStatus}
                      proposalDetails={details}
                    />
                  )}
                </GridItem>
                <GridItem colSpan={{ base: 12, md: 7, lg: 7 }}>
                  <div className='proposal-info'>
                    <p className='staking-addr'>
                      Proposal number : {voteList?.length ?? 0}
                    </p>
                    <p className='staking-addr'>
                      Proposer’s Address :  
                      <span>{truncate(details?.proposal?.proposer)}</span>
                      <CopyToClip value={details?.proposal?.proposer}>
                        <FontAwesomeIcon
                          icon={faCopy}
                          className="main_icons c-pointer"
                        />
                      </CopyToClip>
                    </p>
                    <p className='staking-addr'>
                      {address?.length ? (
                        <>
                          <div className="duplicate-btn">
                            <Link
                              to={{
                                pathname: '/create',
                                search: `prefill=${encodeURIComponent(
                                  JSON.stringify(details),
                                )}`,
                              }}
                            >
                              <FontAwesomeIcon icon={faCopy} color="#1C88F2" />
                              Duplicate Proposal
                            </Link>
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                    </p>
                  </div>
                  <div className='proposal-content'>
                    <h1 className="header-text">{details?.proposal?.title}</h1>
                    <div className="description-text">
                      {/* <pre> */}
                      {details?.proposal?.description}
                      {/* </pre> */}
                    </div>
                  </div>
                </GridItem>
              </Grid>
              
              {address?.length ? (
                <VotesList proposalDetails={details} />
              ) : (
                <></>
              )}
            </div>
            {/* <div className="proposal-detail-comp">
              <ClosedProposalDetails details={details} />
              <ProposalVotingDetail
                totalVotesCount={totalVotesPower}
                details={details}
              />
            </div> */}
          </>
        )}
      </div>
    </>
  );
};

export default ProposalDetails;
