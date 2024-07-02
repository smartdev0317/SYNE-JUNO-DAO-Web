import { div, multiple, plus } from '@client/libs/math';
import { decimal, truncate } from '@client/libs/parse';
import {
  useGetProposalVotesList,
  useGetTotalStaked,
} from '@client/queries/proposalInfo';
import { Spin } from 'antd';
import { useParams } from 'react-router';
import './VoteList.scss';

export const VotesList = ({ proposalDetails }) => {
  const params = useParams();
  const { id } = params;
  const { contents: voteList, isLoading } = useGetProposalVotesList(id);
  const { contents: totalBalance, isLoading: isTotalStakedLoading } =
    useGetTotalStaked();
  // const yesNoVotePower = plus(
  //   proposalDetails?.proposal?.votes?.yes,
  //   proposalDetails?.proposal?.votes?.no,
  // );

  // const totalVotesPower = plus(
  //   yesNoVotePower,
  //   proposalDetails?.proposal?.votes?.abstain,
  // );
  return (
    <div className="vote-list-wrapper">
      {isLoading || isTotalStakedLoading ? (
        <Spin />
      ) : (
        <div>
          <h3 className="heading-votes">All Votes</h3>
          <p className='subheading-votes'>
            View detailed list of your whole voting history
          </p>
          <div className="all-votes">
            <div className="vote-item mt vote-header">
              <span className="voter">WALLET</span>
              <span className="vote-style">VOTE</span>
              <span className="power">PERCENTAGE</span>
            </div>
            {voteList?.length ? (
              voteList?.map((item: any, index: any) => {
                return (
                  <div key={index} className="vote-item">
                    <span className="voter">
                      {window.innerWidth < 821
                        ? truncate(item.voter)
                        : item.voter}
                    </span>
                    <span className={`${item.vote}-style`}>
                      <span className='bg-status'>
                        {item.vote}
                      </span>
                    </span>
                    <span className="power">
                      {decimal(multiple(div(item.power, totalBalance), '100'), 4)}
                      %
                    </span>
                  </div>
                );
              })
            ) : (
              <></>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
