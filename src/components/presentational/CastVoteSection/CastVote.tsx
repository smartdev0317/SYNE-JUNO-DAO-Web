import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHand, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import useNewContractMsg from '@client/hooks/useNewContractMsg';
import contracts from '../../../../contracts.json';
import { StdFee } from '@cosmjs/launchpad';
import { unsafelyGetDefaultExecuteFee } from '@client/utils/fees';
import { useChain } from '@cosmos-kit/react';
import { DEFAULT_FEE_NUM } from '@client/utils/constants';
import { DeliverTxResponse } from '@cosmjs/cosmwasm-stargate';
import { useParams } from 'react-router';
import {
  useGetQueryTotalUserPower,
  useGetQueryUserVote,
  useGetTotalStaked,
} from '@client/queries/proposalInfo';
import { div, multiple } from '@client/libs/math';
import { decimal } from '@client/libs/parse';
import './CastVote.scss';
// import { chainName, chainId } from '@client/App';
import CHAIN from '../../../../chain_info.json';

export const chainId = CHAIN['chainId'];
export const chainName = CHAIN['chainId'] == "juno-1" ? "juno" : "junotestnet";

const CastVote = ({ setTransactionStatus }) => {
  const params = useParams();
  const { id: proposalId } = params;
  const [selected, setSelected] = useState('');
  const newContractMsg = useNewContractMsg();
  const { contents: totalBalance, isLoading: isTotalStakedLoading } =
    useGetTotalStaked();
  const [loading, setLoading] = useState(false);
  const { contents: userVote, isLoading } = useGetQueryUserVote(proposalId);
  const { contents: totalUserPower } = useGetQueryTotalUserPower();
  const msgs = [
    newContractMsg(contracts[chainId].proposal, {
      vote: { proposal_id: Number(proposalId), vote: selected },
    }),
  ];
  const defaultExecuteFee = unsafelyGetDefaultExecuteFee();
  const { getSigningCosmWasmClient, address } = useChain(chainName);
  const submit = async () => {
    try {
      setTransactionStatus({
        transactionStatus: 'started',
      });
      setLoading(true);
      const cosmwasmClient = await getSigningCosmWasmClient();
      if (!cosmwasmClient || !address) {
        console.error('stargateClient undefined or address undefined.');
        return;
      }
      const fee: StdFee = {
        amount: defaultExecuteFee.amount,
        gas: (Number(defaultExecuteFee.gas) * DEFAULT_FEE_NUM).toString(),
      };
      let result: DeliverTxResponse;
      if (typeof window['obiSignAndBroadcast'] === 'function') {
        result = await window['obiSignAndBroadcast'](address, [...msgs]);
      } else {
        result = await cosmwasmClient.signAndBroadcast(
          address,
          [...msgs],
          // 'auto',
          fee,
        );
      }
      setTransactionStatus({
        result: result,
        error: null,
        transactionStatus: null,
      });
    } catch (error) {
      setTransactionStatus({
        result: null,
        error: error,
        transactionStatus: null,
      });
    } finally {
      setLoading(false);
    }
  };

  const onSelectChange = (value) => {
    if (selected == value) {
      setSelected('');
    } else {
      setSelected(value);
    }
  };
  // useEffect(() => {
  //   if (userVote?.vote?.vote?.length) {
  //     setSelected(userVote?.vote?.vote);
  //   }
  // }, [isLoading, { ...userVote }]);
  return (
    <>
      <div className="vote-wrapper">
        <div className="inner-center">
          <p className="emoji-section">🗳</p>
          <p className="title">Casting</p>
          <p className="description">
            {!isTotalStakedLoading &&
              `${decimal(
                multiple(div(totalUserPower?.balance, totalBalance), '100'),
                4,
              )} % voting power`}
          </p>
        </div>
        <div className="center-section">
          <div
            className={`${selected == 'yes' ? 'bg-yes-selected' : 'btn-wrap'}`}
            onClick={() => onSelectChange('yes')}
          >
            <span>
              <CheckOutlined className="yes-icon" />
            </span>
            Yes
          </div>
          <div
            className={`${selected == 'no' ? 'bg-no-selected' : 'btn-wrap'}`}
            onClick={() => onSelectChange('no')}
          >
            <span>
              <CloseOutlined className="no-icon" />
            </span>
            No
          </div>
          <div
            className={`${
              selected == 'abstain' ? 'bg-abstain-selected' : 'btn-wrap'
            }`}
            onClick={() => onSelectChange('abstain')}
          >
            <FontAwesomeIcon icon={faHand} className="abstain-icon" />
            Abstain
          </div>
        </div>
        <button
          className={`caste-vote-btn ${
            selected && !loading ? 'enabled' : 'disabled'
          }`}
          onClick={() => selected?.length && submit()}
          disabled={loading}
        >
          {userVote?.vote?.vote?.length ? 'Update your vote' : 'Vote Now'}

          <FontAwesomeIcon icon={faPaperPlane} className="paper-plane" />
        </button>
      </div>
    </>
  );
};

export default CastVote;
