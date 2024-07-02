import { useState } from 'react';
import useNewContractMsg from '@client/hooks/useNewContractMsg';
import contracts from '../../../../contracts.json';
import { StdFee } from '@cosmjs/launchpad';
import { unsafelyGetDefaultExecuteFee } from '@client/utils/fees';
import { useChain } from '@cosmos-kit/react';
import { DEFAULT_FEE_NUM } from '@client/utils/constants';
import { DeliverTxResponse } from '@cosmjs/cosmwasm-stargate';
import { useParams } from 'react-router';
import { CongratsEmoji, XEmoji } from '@client/utils/emoji';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faTrash } from '@fortawesome/free-solid-svg-icons';
import { chainId, chainName } from '@client/App';
import './ExecuteProposal.scss';
import useAddress from '@client/hooks/useAddress';
import WalletConnect from '@client/components/smart/WalletConnectSection/WalletConnect';

const STATUS = {
  passed: <CongratsEmoji />,
  failed: <XEmoji />,
  rejected: <XEmoji />,
  executed: <CongratsEmoji />,
};

const ExceuteProposal = ({ setTransactionStatus, proposalDetails }) => {
  const params = useParams();
  const { id: proposalId } = params;
  const newContractMsg = useNewContractMsg();
  const [loading, setLoading] = useState(false);
  const msgs = [
    newContractMsg(
      contracts[chainId].proposal,
      proposalDetails?.proposal?.status.toLowerCase() == 'passed'
        ? {
            execute: { proposal_id: Number(proposalId) },
          }
        : { close: { proposal_id: Number(proposalId) } },
    ),
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
  return (
    <div className="exceute-proposal-page-wrapper">
      <h1 className="heading-status">Status</h1>
      <div className="exceute-proposal-wrapper">
        <div className="inner-center">
          {!address?.length ? (
            <p className="title">Connect Wallet to see proposal</p>
          ) : (
            <p className="title">
              <span className="emoji-span">
                {STATUS[proposalDetails?.proposal?.status.toLowerCase()]}
              </span>
              {proposalDetails?.proposal?.status}
            </p>
          )}
          {!address?.length ? (
            <div className="connect-btn">
              <WalletConnect />
            </div>
          ) : proposalDetails?.proposal?.status.toLowerCase() != 'closed' ? (
            <button
              onClick={submit}
              disabled={
                proposalDetails?.proposal?.status.toLowerCase() == 'open' ||
                loading
              }
              className={
                proposalDetails?.proposal?.status.toLowerCase() == 'open' ||
                loading
                  ? 'exceute-btn disabled'
                  : 'exceute-btn'
              }
            >
              {proposalDetails?.proposal?.status.toLowerCase() == 'passed' ? (
                <>
                  <FontAwesomeIcon icon={faPaperPlane} />Execute
                </>
              ) : proposalDetails?.proposal?.status.toLowerCase() !=
                'passed' ? (
                <>
                  <FontAwesomeIcon icon={faTrash} />Close
                </>
              ) : (
                ''
              )}
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExceuteProposal;
